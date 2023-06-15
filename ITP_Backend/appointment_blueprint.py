# appointment.py
from flask import Blueprint, jsonify, request
from models import Appointment, db

appointment_blueprint = Blueprint('appointment', __name__)

@appointment_blueprint.route('/appointment', methods=['POST'])
def create_appointment():
    data = request.get_json()
    new_appointment = Appointment(hospital_id=data['hospital_id'], user_id=data['user_id'],
                                  reminder_time=data['reminder_time'], reminder_date=data['reminder_date'],
                                  appointment_time=data['appointment_time'], appointment_date=data['appointment_date'],
                                  additional_note=data['additional_note'], appointment_title=data['appointment_title'])
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({'message': 'New appointment created!'})

@appointment_blueprint.route('/appointment/<int:appointment_id>', methods=['GET'])
def get_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if appointment:
        return jsonify({
            'hospital_id': appointment.hospital_id,
            'user_id': appointment.user_id,
            'reminder_time': int(appointment.reminder_time.total_seconds()),
            'reminder_date': appointment.reminder_date.isoformat(),
            'appointment_time': int(appointment.appointment_time.total_seconds()),
            'appointment_date': appointment.appointment_date.isoformat(),
            'additional_note': appointment.additional_note,
            'appointment_title': appointment.appointment_title
        })
    else:
        return jsonify({'message': 'Appointment not found!'}), 404

@appointment_blueprint.route('/appointment/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    data = request.get_json()
    appointment = Appointment.query.get(appointment_id)
    if appointment:
        appointment.hospital_id = data.get('hospital_id', appointment.hospital_id)
        appointment.user_id = data.get('user_id', appointment.user_id)
        appointment.reminder_time = data.get('reminder_time', appointment.reminder_time)
        appointment.reminder_date = data.get('reminder_date', appointment.reminder_date)
        appointment.appointment_time = data.get('appointment_time', appointment.appointment_time)
        appointment.appointment_date = data.get('appointment_date', appointment.appointment_date)
        appointment.additional_note = data.get('additional_note', appointment.additional_note)
        appointment.appointment_title = data.get('appointment_title', appointment.appointment_title)
        db.session.commit()
        return jsonify({'message': 'Appointment updated!'})
    else:
        return jsonify({'message': 'Appointment not found!'}), 404

@appointment_blueprint.route('/appointment/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if appointment:
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({'message': 'Appointment deleted!'})
    else:
        return jsonify({'message': 'Appointment not found!'}), 404

@appointment_blueprint.route('/appointment/user/<int:user_id>', methods=['GET'])
def get_appointments_by_user(user_id):
    appointments = Appointment.query.filter_by(user_id=user_id).all()
    if appointments:
        return jsonify([{'appointment_id': a.appointment_id,
                         'hospital_id': a.hospital_id,
                         'reminder_time': int(a.reminder_time.total_seconds()),
                         'reminder_date': a.reminder_date,
                         'appointment_time': int(a.appointment_time.total_seconds()),
                         'appointment_date': a.appointment_date,
                         'additional_note': a.additional_note,
                         'appointment_title': a.appointment_title} for a in appointments])
    else:
        return jsonify({'message': 'No appointments found for this user!'}), 404

