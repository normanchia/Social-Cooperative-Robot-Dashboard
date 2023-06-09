from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Appointment(db.Model):
    __tablename__ = 'Appointment'
    a_id = db.Column(db.String(20), primary_key=True)
    a_name = db.Column(db.String(100))
    loc_id = db.Column(db.String(100))
    a_time = db.Column(db.String(100))
    a_date = db.Column(db.String(100))
    a_retime = db.Column(db.String(100)) #reminder time

    def __init__(self, a_id, a_name, loc_id, a_time, a_date, a_retime):
        self.a_id = a_id
        self.a_name = a_name
        self.loc_id = loc_id
        self.a_time = a_time
        self.a_date = a_date
        self.a_retime = a_retime

class Location(db.Model):
    __tablename__ = 'Location'
    l_id = db.Column(db.String(20), primary_key=True)
    l_name = db.Column(db.String(100))
    l_blk = db.Column(db.String(100))

    def __init__(self, l_id, l_name, l_blk):
        self.l_id = l_id
        self.l_name = l_name
        self.l_blk = l_blk
