
from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify

def role_required(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()
            
            if current_user['role'] != required_role:
                return jsonify({'error': 'Access forbidden: insufficient role permissions'}), 403

            return func(*args, **kwargs)  # Continue if role matches
        return wrapper
    return decorator