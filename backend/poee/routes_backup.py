from poee import db, app, mail
from poee.models import OEERecord, Machine, User
from poee.claculations import Calculations
from flask import jsonify, request, url_for
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, jwt_required,get_jwt_identity, create_refresh_token
from sqlalchemy import func
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask_mail import Message

# -------------------------------------------(check_running)--------------------------------------------------
@app.route("/api/", methods=['GET'])
def check_running():
    return "Server is up and running", 200

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

    #corrected if there is the user is invalid
    if not user:
        return jsonify({"message": "Invalid credentials"}), 400

    if email and pbkdf2_sha256.verify(password, user.password):
        access_token = create_access_token(identity=user.id, fresh=True)
        refresh_token = create_refresh_token(identity=user.id)
        return {"access_token": access_token, "refresh_token": refresh_token}

    return jsonify({"message":"Inavalid credentials"}), 400

# -------------------------------------------(refresh token)--------------------------------------------------

@app.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_token = create_access_token(identity=current_user_id, fresh=False)
    new_refresh_token =  create_access_token(identity=current_user_id, fresh=False)

    return jsonify(access_token=new_token, refresh2_acesstoken=new_refresh_token)



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
    return jsonify(machine_list), 200

#----------------------imporved the database query as now we do 2 only instad of 5----------
@app.route('/api/machines/<int:id>', methods=['GET'])
@jwt_required()
def get_machine_by_id(id):
    user_id = get_jwt_identity()

    # Fetch the machine by ID and ensure it belongs to the current user
    machine = Machine.query.filter_by(id=id, user_id=user_id).first()
    if not machine:
        return jsonify({"error": "Machine not found"}), 404

    # Fetch OEE records for the machine
    oee_records = OEERecord.query.filter_by(machine_id=machine.id).order_by(OEERecord.created_at.desc()).all()

    # Calculate sum and averages using subqueries
    good_units_sum = db.session.query(func.sum(OEERecord.good_units)).filter_by(machine_id=machine.id).scalar() or 0
    total_entries = len(oee_records)

    if total_entries > 0:
        averages = db.session.query(
            func.avg(OEERecord.availability),
            func.avg(OEERecord.performance),
            func.avg(OEERecord.quality),
            func.avg(OEERecord.oee)
        ).filter_by(machine_id=machine.id).one()

        average_availability, average_performance, average_quality, average_oee = averages
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
        "average_availability": round(average_availability, 2),
        "average_performance": round(average_performance, 2),
        "average_quality": round(average_quality, 2),
        "average_oee": round(average_oee, 2),
        "created_at": machine.created_at.isoformat()
    }

    return jsonify(machine_data), 200


#----------------with subquery-------------------------
@app.route('/api/machines/summary', methods=['GET'])
@jwt_required()
def get_machine_summary():
    user_id = get_jwt_identity()
    machines = Machine.query.filter_by(user_id=user_id).order_by(Machine.created_at.desc()).all()

    if not machines:
        return jsonify([]), 200

    machine_ids = [machine.id for machine in machines]

    latest_entries_subquery = db.session.query(
        OEERecord.machine_id,
        OEERecord.created_at,
        OEERecord.good_units,
        OEERecord.availability,
        OEERecord.performance,
        OEERecord.quality,
        OEERecord.oee
    ).filter(OEERecord.machine_id.in_(machine_ids)).order_by(OEERecord.created_at.desc()).limit(5).subquery()

    stats_query = db.session.query(
        OEERecord.machine_id,
        func.sum(OEERecord.good_units).label('total_good_units'),
        func.avg(OEERecord.availability).label('average_availability'),
        func.avg(OEERecord.performance).label('average_performance'),
        func.avg(OEERecord.quality).label('average_quality'),
        func.avg(OEERecord.oee).label('average_oee')
    ).filter(OEERecord.machine_id.in_(machine_ids)).group_by(OEERecord.machine_id).all()

    stats_dict = {stat.machine_id: stat for stat in stats_query}

    machine_summaries = []

    for machine in machines:
        machine_id = machine.id
        latest_entries = db.session.query(
            latest_entries_subquery
        ).filter(latest_entries_subquery.c.machine_id == machine_id).all()

        stat = stats_dict.get(machine_id, None)
        if stat:
            total_good_units = stat.total_good_units
            average_availability = stat.average_availability
            average_performance = stat.average_performance
            average_quality = stat.average_quality
            average_oee = stat.average_oee
        else:
            total_good_units = 0
            average_availability = 0
            average_performance = 0
            average_quality = 0
            average_oee = 0

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

#------------------------------------------------------
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


# --------------------dashbord--------------------

@app.route('/api/machines/lowest_oee', methods=['GET'])
@jwt_required()
def get_machines_with_lowest_oee():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()

    # Get the 'count' query parameter from the request, defaulting to 5 if not provided
    count = request.args.get('count', default=5, type=int)

    # Query to calculate average OEE for each machine
    avg_oee_query = db.session.query(
        OEERecord.machine_id,
        func.avg(OEERecord.oee).label('average_oee')
    ).join(Machine, OEERecord.machine_id == Machine.id) \
     .filter(Machine.user_id == user_id) \
     .group_by(OEERecord.machine_id) \
     .order_by(func.avg(OEERecord.oee)) \
     .limit(count) \
     .all()

    # Extract the limited machine IDs
    limited_machine_ids = [record.machine_id for record in avg_oee_query]

    if not limited_machine_ids:
        return jsonify([]), 200

    # Query to calculate total good units and other averages for the limited machines
    stats_query = db.session.query(
        OEERecord.machine_id,
        Machine.machine_name,
        func.sum(OEERecord.good_units).label('total_good_units'),
        func.avg(OEERecord.availability).label('average_availability'),
        func.avg(OEERecord.performance).label('average_performance'),
        func.avg(OEERecord.quality).label('average_quality'),
        func.avg(OEERecord.oee).label('average_oee')
    ).join(Machine, OEERecord.machine_id == Machine.id) \
    .filter(OEERecord.machine_id.in_(limited_machine_ids)) \
    .group_by(OEERecord.machine_id, Machine.machine_name) \
    .all()

    # Convert the stats query result to a dictionary for easy access
    stats_dict = {stat.machine_id: stat for stat in stats_query}

    machine_summaries = []

    # Loop through each machine and prepare its summary
    for machine_id in limited_machine_ids:
        stat = stats_dict.get(machine_id)

        # If stats are available, extract them; otherwise, use defaults
        if stat:
            machine_name = stat.machine_name
            total_good_units = stat.total_good_units
            average_availability = stat.average_availability
            average_performance = stat.average_performance
            average_quality = stat.average_quality
            average_oee = stat.average_oee
        else:
            machine_name = ''
            total_good_units = 0
            average_availability = 0
            average_performance = 0
            average_quality = 0
            average_oee = 0

        # Append the machine summary to the list
        machine_summaries.append({
            'id': machine_id,
            'name': machine_name,
            'good_units': total_good_units,
            'average_availability': round(average_availability, 2),
            'average_performance': round(average_performance, 2),
            'average_quality': round(average_quality, 2),
            'average_oee': round(average_oee, 2)
        })

    # Return the sorted and limited list of machine summaries as JSON
    return jsonify(machine_summaries), 200

#------------------------------------
@app.route('/api/bad-units-rate', methods=['GET'])
@jwt_required()
def get_bad_units_rate():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()

    # Query to get the sum of total units and good units for the user's machines
    totals = db.session.query(
        func.sum(OEERecord.total_units).label('total_units'),
        func.sum(OEERecord.good_units).label('good_units')
    ).join(Machine, OEERecord.machine_id == Machine.id) \
    .filter(Machine.user_id == user_id) \
    .first()

    total_units = totals.total_units or 0
    good_units = totals.good_units or 0

    # Compute bad units rate
    if total_units > 0:
        bad_units_rate = (total_units - good_units) / total_units
    else:
        bad_units_rate = 0

    # Return the bad units rate as JSON
    return str(round(bad_units_rate, 4)), 200


#--------------------------------------------(forgetting password try)-----------------------------
#route of requesting a password reset
@app.route('/api/auth/request_reset', methods=['POST'])
def request_reset():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    token = serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])

    reset_url = url_for('reset_password', token=token, _external=True)

    msg = Message('Password Reset Request', sender='oeelevate@fastmail.com', recipients=[email])
    msg.body = f'Your password reset link is {reset_url}. If you did not request this, please ignore this email.'
    mail.send(msg)

    return jsonify({"message": "Password reset link has been sent to your email."}), 200

#-------------------------------------------------------------------------------------------

@app.route('/api/auth/reset_password/<token>', methods=['POST'])
def reset_password(token):
    try:
        serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        email = serializer.loads(token, salt=app.config['SECURITY_PASSWORD_SALT'], max_age=3600)
    except (SignatureExpired, BadSignature):
        return jsonify({"error": "The reset link is invalid or has expired"}), 400

    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({"error": "Password is required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    hashed_password = pbkdf2_sha256.hash(password)
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Password has been reset successfully"}), 200
