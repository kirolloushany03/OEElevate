from datetime import datetime
from poee import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    company_name = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    machine = db.relationship('Machine', backref='machines', lazy=True)

    def __repr__(self):
        return (f'<User id={self.id}, username={self.username}, email={self.email}, '
                f'company_name={self.company_name}, created_at={self.created_at}>')
    
class Machine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    machine_name = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    oee_record = db.relationship('OEERecord', backref='oee_records', lazy=True)
    
    def __repr__(self):
        return (f'<Machine id={self.id}, machine_name={self.machine_name}, created_at={self.created_at}, '
                    f'user_id={self.user_id}>')
    
class OEERecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    run_time = db.Column(db.Float, nullable=False)
    planned_production_time = db.Column(db.Float, nullable=False)
    total_units = db.Column(db.Integer, nullable=False)
    ideal_cycle_time = db.Column(db.Float, nullable=False)
    good_units = db.Column(db.Integer, nullable=False)
    
    availability = db.Column(db.Float)
    performance = db.Column(db.Float)
    quality = db.Column(db.Float)
    oee = db.Column(db.Float)

    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    machine_id = db.Column(db.Integer, db.ForeignKey('machine.id'))
    
    def __repr__(self):
        return (f'<OEERecord id={self.id}, run_time={self.run_time}, planned_production_time={self.planned_production_time}, '
                f'total_units={self.total_units}, ideal_cycle_time={self.ideal_cycle_time}, good_units={self.good_units}, '
                f'availability={self.availability}, performance={self.performance}, quality={self.quality}, oee={self.oee}, '
                f'created_at={self.created_at}, machine_id={self.machine_id}>')
