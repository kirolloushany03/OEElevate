from poee import app, db, mail
from flask import jsonify, request, url_for
from poee.models import User
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask_mail import Message
from passlib.hash import pbkdf2_sha256

@app.route('/api/auth/request_reset', methods=['POST'])
def request_reset():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    token = serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])

    reset_url = url_for('reset_password', token=token, _external=True)

    msg = Message('Password Reset Request', sender='oeelevate@fastmail.com', recipients=[email])
    msg.body = f'Your password reset link is {reset_url}. If you did not request this, please ignore this email.'
    mail.send(msg)

    return jsonify({"message": "Password reset link has been sent to your email."}), 200

#-------------------------------------------------------------------------------------------

@app.route('/api/auth/reset_password/<token>', methods=['POST'])
def reset_password(token):
    try:
        serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        email = serializer.loads(token, salt=app.config['SECURITY_PASSWORD_SALT'], max_age=3600)
    except (SignatureExpired, BadSignature):
        return jsonify({"error": "The reset link is invalid or has expired"}), 400

    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({"error": "Password is required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    hashed_password = pbkdf2_sha256.hash(password)
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Password has been reset successfully"}), 200