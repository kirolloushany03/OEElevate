
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
            user_id = get_jwt_identity()
            current_user = User.query.get(user_id)

            if current_user is None:
                return jsonify({"error": "User not found."}), 404

            # Check if the user role is in the allowed roles
            if current_user.is_employee in allowed_roles:
                return fn(*args, **kwargs)
            else:
                return jsonify({"error": "Access forbidden: insufficient permissions."}), 403
        return inner
    return wrapper


