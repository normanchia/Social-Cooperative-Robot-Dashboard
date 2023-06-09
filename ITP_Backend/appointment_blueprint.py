from flask import Blueprint, request, jsonify
from models import Appointment, db
from schemas import AppointmentSchema

appointment_blueprint = Blueprint('appointment_blueprint', __name__)

appointment_schema = AppointmentSchema()
appointments_schema = AppointmentSchema(many=True)

@appointment_blueprint.route('/appointment', methods=['POST'])
def add_appointment():
    a_id = request.json['a_id']
    a_name = request.json['a_name']
    loc_id = request.json['loc_id']
    a_time = request.json['a_time']
    a_date = request.json['a_date']
    a_retime = request.json['a_retime']

    new_appointment = Appointment(a_id, a_name, loc_id, a_time, a_date, a_retime)

    db.session.add(new_appointment)
    db.session.commit()

    return appointment_schema.jsonify(new_appointment)

@appointment_blueprint.route('/appointment', methods=['GET'])
def get_appointments():
    all_appointments = Appointment.query.all()
    result = appointments_schema.dump(all_appointments)
    return jsonify(result)

@appointment_blueprint.route('/appointment/<a_id>', methods=['GET'])
def get_appointment(a_id):
    appointment = Appointment.query.get(a_id)
    return appointment_schema.jsonify(appointment)

@appointment_blueprint.route('/appointment/<a_id>', methods=['PUT'])
def update_appointment(a_id):
    appointment = Appointment.query.get(a_id)

    a_name = request.json['a_name']
    loc_id = request.json['loc_id']
    a_time = request.json['a_time']
    a_date = request.json['a_date']
    a_retime = request.json['a_retime']

    appointment.a_name = a_name
    appointment.loc_id = loc_id
    appointment.a_time = a_time
    appointment.a_date = a_date
    appointment.a_retime = a_retime

    db.session.commit()

    return appointment_schema.jsonify(appointment)

@appointment_blueprint.route('/appointment/<a_id>', methods=['DELETE'])
def delete_appointment(a_id):
    appointment = Appointment.query.get(a_id)
    db.session.delete(appointment)
    db.session.commit()

    return appointment_schema.jsonify(appointment)
