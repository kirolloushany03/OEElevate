
from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import jsonify
from poee.models import User

from flask_jwt_extended import get_jwt_identity

def is_employee_role(allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def inner(*args, **kwargs):
            user_id = get_jwt_identity()  # Get the current user's ID
            current_user = User.query.get(user_id)  # Fetch the user object from the database

            if current_user is None:
                return jsonify({"error": "User not found."}), 404
            
            # Check if current_user.is_employee is in the allowed_roles
            if isinstance(allowed_roles, list):
                if current_user.is_employee not in allowed_roles:  # Checking against a list
                    return jsonify({"error": "Access forbidden: insufficient permissions."}), 403
            else:
                # For single role check, e.g., just admin (False)
                if current_user.is_employee != allowed_roles:
                    return jsonify({"error": "Access forbidden: insufficient permissions."}), 403
            
            return fn(*args, **kwargs)  # Call the original function
        return inner
    return wrapper




