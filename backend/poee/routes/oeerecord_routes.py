from poee import app, db
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from poee.models import OEERecord, Machine
from poee.claculations import Calculations
from sqlalchemy import func
from datetime import datetime
from poee.decorator_function import is_employee_role


@app.route('/api/machine/<int:id>/oeeRecords', methods=['POST'])
@jwt_required()
@is_employee_role([False, True])
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
@is_employee_role([False, True])
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
@is_employee_role(False)
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
@is_employee_role(False)
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
