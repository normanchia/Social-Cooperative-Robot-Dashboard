# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Role(db.Model):
    __tablename__ = 'role'
    role_id = db.Column(db.Integer, primary_key=True)
    role_type = db.Column(db.String(50), nullable=False)

class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.role_id'), nullable=False)

class Hospital(db.Model):
    __tablename__ = 'hospital'
    hospital_id = db.Column(db.Integer, primary_key=True)
    postal_code = db.Column(db.String(10), nullable=False)
    hospital_name = db.Column(db.String(100), nullable=False)

class Appointment(db.Model):
    __tablename__ = 'appointment'
    appointment_id = db.Column(db.Integer, primary_key=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.hospital_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    reminder_time = db.Column(db.DateTime, nullable=False)
    reminder_date = db.Column(db.DateTime, nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    additional_note = db.Column(db.Text, nullable=True)
    appointment_title = db.Column(db.String(100), nullable=False)

class RobotStation(db.Model):
    __tablename__ = 'robot_station'
    station_id = db.Column(db.Integer, primary_key=True)
    station_name = db.Column(db.String(255))
    station_location = db.Column(db.String(255))
    slot_available = db.Column(db.Integer)
    total_slot = db.Column(db.Integer)

    # Backrefs
    pickup_requests = db.relationship('Robot_Request', backref='pickup_station_backref', foreign_keys='Robot_Request.pickup_station')
    destination_requests = db.relationship('Robot_Request', backref='destination_station_backref', foreign_keys='Robot_Request.destination_station')


class Robot(db.Model):
    __tablename__ = 'robot'
    robot_id = db.Column(db.Integer, primary_key=True)
    robot_name = db.Column(db.String(128))
    robot_status = db.Column(db.Integer)
    station_location = db.Column(db.Integer, db.ForeignKey('robot_station.station_id'))

class Robot_Request(db.Model):
    __tablename__ = 'robot_request'
    request_id = db.Column(db.Integer, primary_key=True)
    request_status = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    robot_id = db.Column(db.Integer, db.ForeignKey('robot.robot_id'))
    pickup_station = db.Column(db.Integer, db.ForeignKey('robot_station.station_id'))
    destination_station = db.Column(db.Integer, db.ForeignKey('robot_station.station_id'))
    request_time = db.Column(db.DateTime)
    completion_time = db.Column(db.DateTime)

    # Relationship
    pickup_station_rel = db.relationship("RobotStation", foreign_keys=[pickup_station])
    destination_station_rel = db.relationship("RobotStation", foreign_keys=[destination_station])

class Driver_Request(db.Model):
    __tablename__ = 'driver_request'
    request_id = db.Column(db.Integer, primary_key=True)
    request_status = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    driver_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    completion_time = db.Column(db.DateTime)