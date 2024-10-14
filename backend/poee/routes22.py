from poee import db, app, mail
from poee.models import OEERecord, Machine, User
from poee.claculations import Calculations
from flask import jsonify, request, url_for
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, jwt_required,get_jwt_identity, create_refresh_token
from sqlalchemy import func
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask_mail import Message

# -------------------------------------------(check_running)--------------------------------------------------
@app.route("/api/", methods=['GET'])
def check_running():
    return "Server is up and running", 200









# -------------------------------------------(create machine)--------------------------------------------------






#------------------------------------------------------


#--------------------------------------------(forgetting password try)-----------------------------
#route of requesting a password reset

