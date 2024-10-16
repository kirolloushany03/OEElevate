from itsdangerous import URLSafeTimedSerializer
from poee import app

def generate_invitation_token(admin_id, factory_id):
    s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return s.dumps({'admin_id': admin_id, 'factory_id': factory_id}, salt='invite-token')

def confirm_invitation_token(token, expiration=3600):  # Token valid for one hour
    s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        data = s.loads(token, salt='invite-token', max_age=expiration)
    except Exception:
        return None
    return data
