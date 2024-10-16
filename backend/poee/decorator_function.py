
from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import jsonify
from poee.models import User

from flask_jwt_extended import get_jwt_identity

def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def inner(*args, **kwargs):
            user_id = get_jwt_identity()  # Get the current user's ID
            current_user = User.query.get(user_id)  # Fetch the user object from the database

            if current_user is None:
                return jsonify({"error": "User not found."}), 404

            # Now you can check the role
            if current_user.is_employee != required_role:  # Assuming is_employee is a boolean
                return jsonify({"error": "Access forbidden: insufficient permissions."}), 403
            
            return fn(*args, **kwargs)  # Call the original function
        return inner
    return wrapper
