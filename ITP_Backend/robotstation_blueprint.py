from flask import Blueprint, jsonify, request
from models import RobotStation, db

robotstation_blueprint = Blueprint('robot_station', __name__)

@robotstation_blueprint.route('/robotstation', methods=['POST'])
def create_robotstation():
    data = request.get_json()
    new_robotstation = RobotStation(station_name=data['station_name'], station_location=data['station_location'],
                                    slot_available=data['slot_available'],total_slot=data['total_slot'])
    db.session.add(new_robotstation)
    db.session.commit()
    return jsonify({'message': 'New robot station created!'})

@robotstation_blueprint.route('/robotstation/<int:station_id>', methods=['GET'])
def get_robotstation(station_id):
    station = RobotStation.query.get(station_id)
    if station:
        return jsonify({'station_name': station.station_name, 'station_location': station.station_location,
                        'slot_available': station.slot_available},total_slot=data['total_slot'])
    else:
        return jsonify({'message': 'Robot station not found!'}), 404

@robotstation_blueprint.route('/robotstation/<int:station_id>', methods=['PUT'])
def update_robotstation(station_id):
    data = request.get_json()
    station = RobotStation.query.get(station_id)
    if station:
        station.station_name = data.get('station_name', station.station_name)
        station.station_location = data.get('station_location', station.station_location)
        station.slot_available = data.get('slot_available',station.slot_available)
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
    return jsonify([{'station_id': s.station_id, 'station_name': s.station_name, 'station_location': s.station_location,
                     'total_slot': s.total_slot,'slot_available': s.slot_available} for s in stations])

from models import Robot

@robotstation_blueprint.route('/update_slots', methods=['PUT'])
def update_slots():
    # Get all stations
    stations = RobotStation.query.all()

    for station in stations:
        # Get robots that are currently stationed at this station
        robots_at_station = Robot.query.filter_by(station_location=station.station_id).count()

        # Update the available slots
        station.slot_available = station.total_slot - robots_at_station

    # Commit changes
    db.session.commit()

    # Get all stations again to return the updated ones
    updated_stations = RobotStation.query.all()

    return jsonify([{'station_id': s.station_id, 'station_name': s.station_name, 'station_location': s.station_location,
                     'total_slot': s.total_slot, 'slot_available': s.slot_available} for s in updated_stations])

# Get RobotStation by station_name
@robotstation_blueprint.route('/robotstation/<string:station_name>', methods=['GET'])
def get_robotstation_by_name(station_name):
    station = RobotStation.query.filter_by(station_name=station_name).first()
    if station:
        return jsonify({'station_id': station.station_id, 'station_name': station.station_name, 'station_location': station.station_location,
                        'total_slot': station.total_slot, 'slot_available': station.slot_available})
    else:
        return jsonify({'message': 'Robot station not found!'}), 404
