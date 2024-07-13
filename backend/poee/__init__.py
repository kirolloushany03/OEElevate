from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SECRET_KEY'] = 'f908ced235bdd1bb2a13d72717b22fba87f29ccc'
app.config['JWT_SECRET_KEY'] = 'f908ced235bdd1bb2a13d72717b22fba87f29ccc'
app.config['SQLALCHEMY_DATABASE_URI']= 'sqlite:///oee.db'

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

db = SQLAlchemy(app)

jwt = JWTManager(app)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_pyload):
    return (
        jsonify({"message":"the token has expired", "error":"token_expired"}), 401
    )

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return (
        jsonify({"message":"signature verfication faild", "error":"invalid_token"}), 401
    )

@jwt.unauthorized_loader
def missing_token_callback(error):
    return (
        jsonify({"message":"request does not contain an access token", "error":"authorization_required"}), 401
    )

@jwt.needs_fresh_token_loader
def toekn_not_fresh_callback(jwt_header, jwt_payload):
    return(
        jsonify(
            {
                "description": "The token is not fresh",
                "error": "fresh_token_required"
            }
        ),
        401,
    )

from poee import routes

with app.app_context():
    db.create_all()
