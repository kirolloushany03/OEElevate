from poee import app
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from poee.models import User, Factory

# -------------------------------------------(get user info)--------------------------------------------------

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        factory = Factory.query.get(user.factory_id)
        company_name = factory.company_name if factory else None

        return jsonify(
            {
                'username': user.username,
                'company_name': company_name,
                'email':user.email,
                'created_at': user.created_at
            }
        ), 200
    else:
        return jsonify({"error":"user not found"}),400