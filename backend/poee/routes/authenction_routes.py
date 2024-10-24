# poee/routes/auth_routes.py
from poee import app, db
from flask import request, jsonify
from flask_jwt_extended import create_access_token
from poee.models import User, Factory
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, jwt_required,get_jwt_identity, create_refresh_token
from poee.token_genration import generate_invitation_token, confirm_invitation_token
from poee.decorator_function import is_employee_role



# -------------------------------------------(register)--------------------------------------------------
@app.route("/api/auth/register", methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    company_name = data.get('company_name')
    email = data.get('email')
    password = data.get('password')
    invite_token = data.get('invite_token', None)
    is_employee = data.get('is_employee', False)

    if not all([username, email, password]):
        return jsonify({"error": "Missing required field"}), 400

    if is_employee == False:
        if not company_name:
            return jsonify({"error": "Missing the Company Name"})
    else:
        if not invite_token:
            return jsonify({"error": "Missing the invite token"})

    existing_user_email = User.query.filter_by(email=email).first()
    existing_user_username = User.query.filter_by(username=username).first()

    if existing_user_email or existing_user_username:
        error_message = ''
        if existing_user_email:
            error_message = 'The email is already taken, choose another one.'
        if existing_user_username:
            error_message += ' and ' if error_message else ''
            error_message += 'The username is already taken, choose another one.'
        return jsonify({"error": error_message}), 400

    hashed_password = pbkdf2_sha256.hash(password)

    if invite_token:
        # Employee registration
        token_data = confirm_invitation_token(invite_token)
        if not token_data:
            return jsonify({"error": "Invalid or expired token"}), 400

        factory_id = token_data['factory_id']  # Extract factory ID from token

        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            is_employee=is_employee,  # Employee role
            factory_id=factory_id  # Link to existing factory
        )

    else:
        # Admin registration (no token)
        # Create the new factory and assign the factory ID to the admin
        new_factory = Factory(
            company_name=company_name
        )
        db.session.add(new_factory)
        db.session.flush()  # Flush to get the new factory_id before committing

        # Create admin user and link to the new factory
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            is_employee=is_employee,  # Admin role
            factory_id=new_factory.id  # Link the admin to the newly created factory
        )

    # Save the new user in the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Congratulations, you registered successfully"}), 200


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
        access_token = create_access_token(identity=user.id, fresh=True, additional_claims={"is_employee": user.is_employee})
        refresh_token = create_refresh_token(identity=user.id)
        return {"access_token": access_token, "refresh_token": refresh_token, "is_employee": user.is_employee}

    return jsonify({"message":"Inavalid credentials"}), 400


# -------------------------------------------(refresh token)--------------------------------------------------

@app.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_token = create_access_token(identity=current_user_id, fresh=False)
    new_refresh_token =  create_access_token(identity=current_user_id, fresh=False)

    return jsonify(access_token=new_token, refresh2_acesstoken=new_refresh_token)



@app.route('/api/admin/invite', methods=['GET'])
@jwt_required()
@is_employee_role(False)
def invite_employee():
    admin_id = get_jwt_identity()

    # Fetch the user and get the factory_id from the user model
    user = User.query.get(admin_id)  # Assuming current_user contains user ID
    if user is None:
        return jsonify({"error": "User not found."}), 404

    factory_id = user.factory_id  # Get factory_id from the user

    if not factory_id:
        return jsonify({"error": "Factory ID not associated with this user."}), 400

    token = generate_invitation_token(admin_id, factory_id)

    return jsonify({'invite_token': token}), 200
