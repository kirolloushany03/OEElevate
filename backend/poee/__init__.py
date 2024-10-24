from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from flask_mail import Mail
from dotenv import load_dotenv
import google.generativeai as genai
import os

load_dotenv()


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['SECURITY_PASSWORD_SALT'] = os.getenv("SECURITY_PASSWORD_SALT")
app.config['SQLALCHEMY_DATABASE_URI']= 'sqlite:///oee.db'

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

app.config['MAIL_SERVER'] = 'smtp.fastmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'oeelevate@fastmail.com'
app.config['MAIL_PASSWORD'] = '2v3j3z226p9l7z7j'

db = SQLAlchemy(app)
jwt = JWTManager(app)
mail = Mail(app)

# .env
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")

# Configure the Google Generative AI model
genai.configure(api_key=GOOGLE_API_KEY)

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Create the model and chat session
model = genai.GenerativeModel(
    model_name="gemini-1.5-pro-002",
    generation_config=generation_config,
)

# Define a global chat session that can be reused
chat_session = model.start_chat()

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
