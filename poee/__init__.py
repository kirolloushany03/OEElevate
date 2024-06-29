from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'f908ced235bdd1bb2a13d72717b22fba87f29ccc'
app.config['JWT_SECRET_KEY'] = 'f908ced235bdd1bb2a13d72717b22fba87f29ccc'
app.config['SQLALCHEMY_DATABASE_URI']= 'sqlite:///oee.db'
db = SQLAlchemy(app)

jwt = JWTManager(app)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_pyload):
    return (
        jsonify({"message":"the token has expired", "error":"token_expired"})
    )

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return (
        jsonify({"message":"signature verfication faild", "error":"invalid_token"})
    )

@jwt.unauthorized_loader
def missing_token_callback(error):
    return (
        jsonify({"message":"request does not contain an access token", "error":"authorization_required"})
    )


from poee import routes

with app.app_context():
    db.create_all()