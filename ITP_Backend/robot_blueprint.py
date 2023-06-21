# robot.py
from flask import Blueprint, jsonify, request
from models import Robot,RobotStation, db

robot_blueprint = Blueprint('robot', __name__)

@robot_blueprint.route('/robot', methods=['POST'])
def create_robot():
    data = request.get_json()
    new_robot = Robot(robot_name=data['robot_name'], robot_status=data['robot_status'],
                      station_location=data['station_location'])
    db.session.add(new_robot)
    db.session.commit()
    return jsonify({'message': 'New robot created!'})

@robot_blueprint.route('/robot/<int:robot_id>', methods=['GET'])
def get_robot(robot_id):
    robot = Robot.query.get(robot_id)
    if robot:
        return jsonify({'robot_name': robot.robot_name, 'robot_status': robot.robot_status,
                        'station_location': robot.station_location})
    else:
        return jsonify({'message': 'Robot not found!'}), 404

@robot_blueprint.route('/robots', methods=['GET'])
def get_all_robots():
    robots = Robot.query.all()
    return jsonify([{'robot_id': r.robot_id, 'robot_name': r.robot_name, 'robot_status': r.robot_status,
                     'station_location': r.station_location} for r in robots])

@robot_blueprint.route('/robot/<int:robot_id>/station/<int:station_id>', methods=['PUT'])
def update_robot_station(robot_id, station_id):
    # Get the robot and station
    robot = Robot.query.get(robot_id)
    station = RobotStation.query.get(station_id)
    if robot and station:
        # Update the robot's station
        robot.station_location = station.station_id
        db.session.commit()
        return jsonify({'message': f'Robot {robot_id} now stationed at {station.station_name}.'})
    else:
        return jsonify({'message': 'Robot or station not found!'}), 404

