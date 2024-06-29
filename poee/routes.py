from poee import db, app
from poee.models import OEERecord, Machine, User
from poee.claculations import Calculations
from flask import jsonify, request
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, jwt_required,get_jwt_identity
from sqlalchemy import func
from datetime import datetime


# -------------------------------------------(register)--------------------------------------------------
@app.route("/api/auth/register", methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    company_name = data.get('company_name')
    email = data.get('email')
    password = data.get('password')

    if not all([username, company_name, email, password]):
        return jsonify({"error": "Missing required field"}), 400
    
    existing_user_email= User.query.filter_by(email=email).first()
    existing_user_username= User.query.filter_by(username=username).first()

    if existing_user_email or existing_user_username:
        error_message = ''
        if existing_user_email:
            error_message ='the email is already taken choose another one'
        if existing_user_username:
            error_message += ' and ' if error_message else ''
            error_message += 'the username is already taken choose another one'
        return jsonify({"error":error_message}), 400
        
    hashed_password = pbkdf2_sha256.hash(password)

    new_user = User(
        username=username,
        company_name=company_name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message":"Congratualtions you registerd successfully"}), 200

# -------------------------------------------(login)--------------------------------------------------

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if email and pbkdf2_sha256.verify(password, user.password):
        access_token = create_access_token(identity=user.id)
        return {"access_token": access_token}
    
    return jsonify({"message":"Inavalid credentials"}), 400

# -------------------------------------------(get user info)--------------------------------------------------

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        return jsonify(
            {
                'username': user.username,
                'company_name':user.company_name,
                'email':user.email,
                'created_at': user.created_at
            }
        ), 200
    else:
        return jsonify({"error":"user not found"}),400


# -------------------------------------------(create machine)--------------------------------------------------

@app.route('/api/machines', methods=['POST'])
@jwt_required()
def create_machine():
    data = request.get_json()

    user_id = get_jwt_identity()
    machine_name = data.get('machine_name')

    if not machine_name:
        return jsonify({"error":"Missing required feild: machine_name"}), 400

    existing_machine = Machine.query.filter_by(machine_name=machine_name).first()
    if existing_machine:
        return jsonify({"errors":"the machine name already exists"}), 400
    
    new_machine = Machine(machine_name=machine_name, user_id=user_id)
    
    db.session.add(new_machine)
    db.session.commit()

    return jsonify(
        {
            "id":new_machine.id,
            "machine_name":new_machine.machine_name,
            "created_at":new_machine.created_at
        }
    )

# -------------------------------------------(get all machines for the user)----------------------------------------

@app.route('/api/machines', methods=['GET'])
@jwt_required()
def get_all_machines_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error":"user not found"}), 200
    
    machines = Machine.query.filter_by(user_id=user_id).all()

    if not machines:
        return jsonify({"message":"no machines for this user"}), 200

    machine_list = []
    for machine in machines:
        latest_entry = OEERecord.query.filter_by(machine_id=machine.id).order_by(OEERecord.created_at.desc()).first()
        machine_list.append({
                'id':machine.id,
                'machine_name':machine.machine_name,
                "latest_entry": latest_entry.created_at.isoformat() if latest_entry else None,
                'created_at':machine.created_at.isoformat()
            })
    # machine_list.append(machine_data)

    return jsonify(machine_list), 200


@app.route('/api/machines/<int:id>', methods=['GET'])
@jwt_required()
def get_machine_by_id(id):
    user_id = get_jwt_identity()
    
    # Fetch the machine by ID and ensure it belongs to the current user
    machine = Machine.query.filter_by(id=id, user_id=user_id).first()
    if not machine:
        return jsonify({"error": "Machine not found"}), 404

    # Fetch all OEE records for the machine
    oee_records = OEERecord.query.filter_by(machine_id=machine.id).all()

    # Calculate sum and averages
    good_units_sum = sum(record.good_units for record in oee_records)
    total_entries = len(oee_records)

    if total_entries > 0:
        average_availability = db.session.query(func.avg(OEERecord.availability)).filter_by(machine_id=machine.id).scalar()
        average_performance = db.session.query(func.avg(OEERecord.performance)).filter_by(machine_id=machine.id).scalar()
        average_quality = db.session.query(func.avg(OEERecord.quality)).filter_by(machine_id=machine.id).scalar()
        average_oee = db.session.query(func.avg(OEERecord.oee)).filter_by(machine_id=machine.id).scalar()
    else:
        average_availability = 0
        average_performance = 0
        average_quality = 0
        average_oee = 0

    # Prepare the response data
    machine_data = {
        "id": machine.id,
        "name": machine.machine_name,
        "entries": [
            {
                "id": record.id,
                "run_time": record.run_time,
                "planned_production_time": record.planned_production_time,
                "total_units": record.total_units,
                "ideal_cycle_time": record.ideal_cycle_time,
                "good_units": record.good_units,
                "availability": record.availability,
                "performance": record.performance,
                "quality": record.quality,
                "oee": record.oee,
                "created_at": record.created_at.isoformat()
            }
            for record in oee_records
        ],
        "good_units": good_units_sum,
        "average_availability": average_availability,
        "average_performance": average_performance,
        "average_quality": average_quality,
        "average_oee": average_oee,
        "created_at": machine.created_at.isoformat()
    }

    return jsonify(machine_data), 200

@app.route('/api/machines/summary', methods=['GET'])
@jwt_required()
def get_machine_summary():
    user_id = get_jwt_identity()
    machines = Machine.query.filter_by(user_id=user_id).order_by(Machine.created_at.desc()).limit(5).all()

    if not machines:
        return jsonify({"message": "No machines found for this user"}), 200

    machine_summaries = []

    for machine in machines:
        latest_entries = OEERecord.query.filter_by(machine_id=machine.id) \
                                        .order_by(OEERecord.created_at.desc()) \
                                        .limit(5).all()
        
        total_good_units = db.session.query(func.sum(OEERecord.good_units)) \
                                    .filter_by(machine_id=machine.id).scalar() or 0
    
        average_availability = db.session.query(func.avg(OEERecord.availability)) \
                                        .filter_by(machine_id=machine.id).scalar() or 0
        
        average_performance = db.session.query(func.avg(OEERecord.performance)) \
                                        .filter_by(machine_id=machine.id).scalar() or 0
        
        average_quality = db.session.query(func.avg(OEERecord.quality)) \
                                    .filter_by(machine_id=machine.id).scalar() or 0
        
        average_oee = db.session.query(func.avg(OEERecord.oee)) \
                                .filter_by(machine_id=machine.id).scalar() or 0

        machine_summaries.append({
            'id': machine.id,
            'machine_name': machine.machine_name,
            'latest_entries': [
                {
                    'created_at': entry.created_at.isoformat(),
                    'good_units': entry.good_units,
                    'availability': entry.availability,
                    'performance': entry.performance,
                    'quality': entry.quality,
                    'oee': entry.oee
                } for entry in latest_entries
            ],
            'total_good_units': total_good_units,
            'average_availability': round(average_availability, 2),
            'average_performance': round(average_performance, 2),
            'average_quality': round(average_quality, 2),
            'average_oee': round(average_oee, 2)
        })

    return jsonify(machine_summaries), 200


@app.route('/api/machine/<int:id>/oeeRecords', methods=['POST'])
@jwt_required()
def add_oee_record(id):

    data = request.get_json()

    # Extract data from request
    run_time = data.get('run_time')
    planned_production_time = data.get('planned_production_time')
    total_units = data.get('total_units')
    ideal_cycle_time = data.get('ideal_cycle_time')
    good_units = data.get('good_units')
    date_str = data.get('date')

    # Convert date string to datetime object
    created_at = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S')

    # Calculate metrics
    availability = Calculations.calculate_availability(run_time, planned_production_time)
    performance = Calculations.calculate_performance(total_units, ideal_cycle_time, run_time)
    quality = Calculations.calculate_quality(good_units, total_units)
    oee = Calculations.calculate_oee(availability, performance, quality)

    # Create new OEERecord object
    new_oee_record = OEERecord(
        run_time=run_time,
        planned_production_time=planned_production_time,
        total_units=total_units,
        ideal_cycle_time=ideal_cycle_time,
        good_units=good_units,
        availability=availability,
        performance=performance,
        quality=quality,
        oee=oee,
        created_at=created_at,
        machine_id=id
    )

    # Add to database session and commit
    db.session.add(new_oee_record)
    db.session.commit()

    # Prepare response
    response = jsonify({
        "id": new_oee_record.id,
        "run_time": new_oee_record.run_time,
        "planned_production_time": new_oee_record.planned_production_time,
        "total_units": new_oee_record.total_units,
        "ideal_cycle_time": new_oee_record.ideal_cycle_time,
        "good_units": new_oee_record.good_units,
        "availability": new_oee_record.availability,
        "performance": new_oee_record.performance,
        "quality": new_oee_record.quality,
        "oee": new_oee_record.oee,
        "created_at": new_oee_record.created_at.isoformat(),
        "machine_id": new_oee_record.machine_id
    })

    return response, 201

@app.route('/api/machine/<int:id>/oeeRecords', methods=['GET'])
@jwt_required()
def get_oee_records(id):
    machine = Machine.query.get(id)
    if not machine:
        return jsonify({"error": "Machine not found"}), 404

    oee_records = OEERecord.query.filter_by(machine_id=id).all()

    if not oee_records:
        return jsonify([]), 200  # Return an empty array if no records found

    records_list = []
    for record in oee_records:
        records_list.append({
            'id': record.id,
            'machine': {
                'id': machine.id,
                'name': machine.machine_name
            },
            'run_time': record.run_time,
            'planned_production_time': record.planned_production_time,
            'total_units': record.total_units,
            'ideal_cycle_time': record.ideal_cycle_time,
            'good_units': record.good_units,
            'availability': round(record.availability, 2),
            'performance': round(record.performance, 2),
            'quality': round(record.quality, 2),
            'oee': round(record.oee, 2),
            'date': record.created_at.isoformat()
        })

    return jsonify(records_list), 200