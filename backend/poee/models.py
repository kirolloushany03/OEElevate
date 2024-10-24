from datetime import datetime
from poee import db
from flask_login import UserMixin

class Factory(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    company_name = db.Column(db.String(120), nullable=False)
    
    # Relationships
    users = db.relationship('User', backref='factory', lazy=True)
    machines = db.relationship('Machine', backref='factory', lazy=True)

    def __repr__(self):
        return f'<Factory id={self.id}, company_name={self.company_name}, created_at={self.created_at}>'

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    is_employee = db.Column(db.Boolean, default=False) #True = emplee then need token // False= admin
    
    # Relationships
    machines = db.relationship('Machine', backref='user', lazy=True)
    factory_id = db.Column(db.Integer, db.ForeignKey('factory.id'))

    def __repr__(self):
        return (f'<User id={self.id}, username={self.username}, email={self.email}, '
                f'created_at={self.created_at}, factory_id={self.factory_id}>')

class Machine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    machine_name = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    factory_id = db.Column(db.Integer, db.ForeignKey('factory.id'))
    
    # Relationships
    oee_records = db.relationship('OEERecord', backref='machine', lazy=True)

    def __repr__(self):
        return (f'<Machine id={self.id}, machine_name={self.machine_name}, created_at={self.created_at}, '
                f'user_id={self.user_id}, factory_id={self.factory_id}>')

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

    last_modified_at = db.Column(db.DateTime, onupdate=datetime.utcnow)  # Auto-update the timestamp when modified
    last_modified_by = db.Column(db.Integer, db.ForeignKey('user.id'))  # Link to the user who last modified the record
    last_modifier = db.relationship('User', foreign_keys=[last_modified_by])  # Relationship with the User who modified it

    def __repr__(self):
        return (f'<OEERecord id={self.id}, run_time={self.run_time}, planned_production_time={self.planned_production_time}, '
                f'total_units={self.total_units}, ideal_cycle_time={self.ideal_cycle_time}, good_units={self.good_units}, '
                f'availability={self.availability}, performance={self.performance}, quality={self.quality}, oee={self.oee}, '
                f'created_at={self.created_at}, machine_id={self.machine_id}, last_modified_by={self.last_modified_by}>')