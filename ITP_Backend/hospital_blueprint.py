# hospital.py
from flask import Blueprint, jsonify, request
from models import Hospital, db

hospital_blueprint = Blueprint('hospital', __name__)

@hospital_blueprint.route('/hospital', methods=['POST'])
def create_hospital():
    data = request.get_json()
    new_hospital = Hospital(postal_code=data['postal_code'], hospital_name=data['hospital_name'])
    db.session.add(new_hospital)
    db.session.commit()
    return jsonify({'message': 'New hospital created!'})

@hospital_blueprint.route('/hospital/<int:hospital_id>', methods=['GET'])
def get_hospital(hospital_id):
    hospital = Hospital.query.get(hospital_id)
    if hospital:
        return jsonify({'postal_code': hospital.postal_code, 'hospital_name': hospital.hospital_name})
    else:
        return jsonify({'message': 'Hospital not found!'}), 404

@hospital_blueprint.route('/hospital/<int:hospital_id>', methods=['PUT'])
def update_hospital(hospital_id):
    data = request.get_json()
    hospital = Hospital.query.get(hospital_id)
    if hospital:
        hospital.postal_code = data.get('postal_code', hospital.postal_code)
        hospital.hospital_name = data.get('hospital_name', hospital.hospital_name)
        db.session.commit()
        return jsonify({'message': 'Hospital updated!'})
    else:
        return jsonify({'message': 'Hospital not found!'}), 404

@hospital_blueprint.route('/hospital/<int:hospital_id>', methods=['DELETE'])
def delete_hospital(hospital_id):
    hospital = Hospital.query.get(hospital_id)
    if hospital:
        db.session.delete(hospital)
        db.session.commit()
        return jsonify({'message': 'Hospital deleted!'})
    else:
        return jsonify({'message': 'Hospital not found!'}), 404

@hospital_blueprint.route('/hospitals', methods=['GET'])
def get_all_hospitals():
    hospitals = Hospital.query.all()
    return jsonify([{'hospital_id': h.hospital_id, 'postal_code': h.postal_code, 'hospital_name': h.hospital_name} for h in hospitals])
