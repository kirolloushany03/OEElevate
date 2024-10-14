from poee import app, db
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from poee.models import Machine, User, OEERecord
from sqlalchemy import func

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