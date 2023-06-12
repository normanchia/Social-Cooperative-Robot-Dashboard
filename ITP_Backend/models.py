# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Role(db.Model):
    role_id = db.Column(db.Integer, primary_key=True)
    role_type = db.Column(db.String(50), nullable=False)

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.role_id'), nullable=False)

class Hospital(db.Model):
    hospital_id = db.Column(db.Integer, primary_key=True)
    postal_code = db.Column(db.String(10), nullable=False)
    hospital_name = db.Column(db.String(100), nullable=False)

class Appointment(db.Model):
    appointment_id = db.Column(db.Integer, primary_key=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.hospital_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    reminder_time = db.Column(db.DateTime, nullable=False)
    reminder_date = db.Column(db.DateTime, nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    additional_note = db.Column(db.Text, nullable=True)
    appointment_title = db.Column(db.String(100), nullable=False)
