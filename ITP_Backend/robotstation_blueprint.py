from flask import Blueprint, jsonify, request
from models import RobotStation, db

robotstation_blueprint = Blueprint('robot_station', __name__)

@robotstation_blueprint.route('/robotstation', methods=['POST'])
def create_robotstation():
    data = request.get_json()
    new_robotstation = RobotStation(station_name=data['station_name'], station_location=data['station_location'])
    db.session.add(new_robotstation)
    db.session.commit()
    return jsonify({'message': 'New robot station created!'})

@robotstation_blueprint.route('/robotstation/<int:station_id>', methods=['GET'])
def get_robotstation(station_id):
    station = RobotStation.query.get(station_id)
    if station:
        return jsonify({'station_name': station.station_name, 'station_location': station.station_location})
    else:
        return jsonify({'message': 'Robot station not found!'}), 404

@robotstation_blueprint.route('/robotstation/<int:station_id>', methods=['PUT'])
def update_robotstation(station_id):
    data = request.get_json()
    station = RobotStation.query.get(station_id)
    if station:
        station.station_name = data.get('station_name', station.station_name)
        station.station_location = data.get('station_location', station.station_location)
        db.session.commit()
        return jsonify({'message': 'Robot station updated!'})
    else:
        return jsonify({'message': 'Robot station not found!'}), 404

@robotstation_blueprint.route('/robotstation/<int:station_id>', methods=['DELETE'])
def delete_robotstation(station_id):
    station = RobotStation.query.get(station_id)
    if station:
        db.session.delete(station)
        db.session.commit()
        return jsonify({'message': 'Robot station deleted!'})
    else:
        return jsonify({'message': 'Robot station not found!'}), 404

@robotstation_blueprint.route('/robotstations', methods=['GET'])
def get_all_robotstations():
    stations = RobotStation.query.all()
    return jsonify([{'station_id': s.station_id, 'station_name': s.station_name, 'station_location': s.station_location} for s in stations])
