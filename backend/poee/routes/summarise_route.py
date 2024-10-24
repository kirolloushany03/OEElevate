from flask import jsonify, request
from poee import app, chat_session
from poee.models import Machine, OEERecord
from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route('/api/summarize/<int:machine_id>', methods=['GET'])
@jwt_required()
def summarize(machine_id):

    if not machine_id:
        return jsonify({"error": "machine_id is required"}), 400

    try:
        # Get the machine and its OEE records
        machine = Machine.query.get(machine_id)

        if not machine:
            return jsonify({"error": "Machine not found"}), 404

        oee_record = OEERecord.query.filter_by(machine_id=machine_id).order_by(OEERecord.created_at.desc()).first()

        if not oee_record:
            return jsonify({"error": "No OEE records found for this machine"}), 404

        availability = oee_record.availability
        performance = oee_record.performance
        quality = oee_record.quality
        oee = oee_record.oee

        prompt = f"Summarize the performance of machine '{machine.machine_name}' with an availability of {availability * 100}%, performance of {performance * 100}%, quality of {quality * 100}%, and OEE score of {oee * 100}% and tell me what to do to make it better. and make it only in few lines just make small one what is the porblem and solution to it"

        # Generate the summary using the chat session
        response = chat_session.send_message(prompt)

        # Return the summary to the client
        return jsonify({"summary": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
