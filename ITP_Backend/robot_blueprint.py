# robot.py
from flask import Blueprint, jsonify, request
from models import Robot, db

robot_blueprint = Blueprint('robot', __name__)

@robot_blueprint.route('/robot', methods=['POST'])
def create_robot():
    data = request.get_json()
    new_robot = Robot(robot_name=data['robot_name'], robot_status=data['robot_status'],
                      robot_destination=data['robot_destination'], robot_pickup=data['robot_pickup'])
    db.session.add(new_robot)
    db.session.commit()
    return jsonify({'message': 'New robot created!'})

@robot_blueprint.route('/robot/<int:robot_id>', methods=['GET'])
def get_robot(robot_id):
    robot = Robot.query.get(robot_id)
    if robot:
        return jsonify({'robot_name': robot.robot_name, 'robot_status': robot.robot_status,
                        'robot_destination': robot.robot_destination, 'robot_pickup': robot.robot_pickup})
    else:
        return jsonify({'message': 'Robot not found!'}), 404

@robot_blueprint.route('/robots', methods=['GET'])
def get_all_robots():
    robots = Robot.query.all()
    return jsonify([{'robot_id': r.robot_id, 'robot_name': r.robot_name, 'robot_status': r.robot_status,
                     'robot_destination': r.robot_destination, 'robot_pickup': r.robot_pickup} for r in robots])
