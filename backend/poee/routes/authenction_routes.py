# poee/routes/auth_routes.py
from poee import app, db
from flask import request, jsonify
from flask_jwt_extended import create_access_token
from poee.models import User
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, jwt_required,get_jwt_identity, create_refresh_token





# -------------------------------------------(register)--------------------------------------------------
@app.route("/api/auth/register", methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    company_name = data.get('company_name')
    email = data.get('email')
    password = data.get('password')

    if not all([username, company_name, email, password]):
        return jsonify({"error": "Missing required field"}), 400

    existing_user_email= User.query.filter_by(email=email).first()
    existing_user_username= User.query.filter_by(username=username).first()

    if existing_user_email or existing_user_username:
        error_message = ''
        if existing_user_email:
            error_message ='the email is already taken choose another one'
        if existing_user_username:
            error_message += ' and ' if error_message else ''
            error_message += 'the username is already taken choose another one'
        return jsonify({"error":error_message}), 400

    hashed_password = pbkdf2_sha256.hash(password)

    new_user = User(
        username=username,
        company_name=company_name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message":"Congratualtions you registerd successfully"}), 200

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
        access_token = create_access_token(identity=user.id, fresh=True)
        refresh_token = create_refresh_token(identity=user.id)
        return {"access_token": access_token, "refresh_token": refresh_token}

    return jsonify({"message":"Inavalid credentials"}), 400


# -------------------------------------------(refresh token)--------------------------------------------------

@app.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_token = create_access_token(identity=current_user_id, fresh=False)
    new_refresh_token =  create_access_token(identity=current_user_id, fresh=False)

    return jsonify(access_token=new_token, refresh2_acesstoken=new_refresh_token)