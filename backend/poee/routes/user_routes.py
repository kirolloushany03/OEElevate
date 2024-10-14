from poee import app
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from poee.models import User

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