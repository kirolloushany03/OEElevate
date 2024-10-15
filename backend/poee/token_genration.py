from itsdangerous import URLSafeTimedSerializer
from poee import app

def generate_invitation_token(admin_id, factory_id):
    s = URLSafeTimedSerializer(app.config['f908ced235bdd1bb2a13d72717b22fba87f29ccc'])
    return s.dumps({'admin_id': admin_id, 'factory_id':factory_id}, salt='invite-token')

def confirm_invitatation_token(token, expiration=3600):#the link avaliable for one hour
    s = URLSafeTimedSerializer(app.config['f908ced235bdd1bb2a13d72717b22fba87f29ccc'])
    try:
        data = s.loads(token, salt='invite-token', max_age=expiration)
    except Exception:
        return None
    return data
