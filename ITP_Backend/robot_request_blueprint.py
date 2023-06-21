from flask import Blueprint, jsonify, request
from models import Robot_Request, db
from datetime import datetime

robot_request_blueprint = Blueprint('robot_request', __name__)

@robot_request_blueprint.route('/robot_request', methods=['POST'])
def create_robot_request():
    data = request.get_json()
    new_request = Robot_Request(request_status=data['request_status'], user_id=data['user_id'],
                               robot_id=data['robot_id'], pickup_station=data['pickup_station'],
                               destination_station=data['destination_station'], request_time=datetime.utcnow())
    db.session.add(new_request)
    db.session.commit()
    return jsonify({'message': 'New robot request created!'})

@robot_request_blueprint.route('/robot_request/<int:request_id>', methods=['GET'])
def get_robot_request(request_id):
    robot_request = Robot_Request.query.get(request_id)
    if robot_request:
        return jsonify({'request_status': robot_request.request_status, 'user_id': robot_request.user_id,
                        'robot_id': robot_request.robot_id, 'pickup_station': robot_request.pickup_station,
                        'destination_station': robot_request.destination_station, 'request_time': robot_request.request_time,
                        'completion_time': robot_request.completion_time})
    else:
        return jsonify({'message': 'Robot request not found!'}), 404

@robot_request_blueprint.route('/robot_request/user/<int:user_id>/status/<int:request_status>', methods=['GET'])
def get_user_requests(user_id, request_status):
    requests = Robot_Request.query.filter_by(user_id=user_id, request_status=request_status).all()
    if requests:
        return jsonify([{'request_id': r.request_id,
                         'request_status': r.request_status, 'user_id': r.user_id, 'robot_id': r.robot_id,
                         'pickup_station': r.pickup_station_rel.station_name, 'destination_station': r.destination_station_rel.station_name,
                         'request_time': r.request_time.strftime('%Y-%m-%d %H:%M:%S'),
                         'completion_time': r.completion_time.strftime('%Y-%m-%d %H:%M:%S') if r.completion_time else None} for r in requests])
    else:
        return jsonify({'message': 'No requests found for this user with given status!'}), 404

@robot_request_blueprint.route('/robot_request/user/<int:user_id>/status_not/<int:request_status>', methods=['GET'])
def get_user_not_requests(user_id, request_status):
    requests = Robot_Request.query.filter(Robot_Request.user_id == user_id, Robot_Request.request_status != request_status).all()
    if requests:
        return jsonify([{'request_id': r.request_id,
                         'request_status': r.request_status,
                         'user_id': r.user_id,
                         'robot_id': r.robot_id,
                         'pickup_station_id': r.pickup_station,
                         'pickup_station_name': r.pickup_station_rel.station_name,
                         'destination_station_id': r.destination_station,
                         'destination_station_name': r.destination_station_rel.station_name,
                         'request_time': r.request_time.strftime('%Y-%m-%d %H:%M:%S'),
                         'completion_time': r.completion_time.strftime('%Y-%m-%d %H:%M:%S') if r.completion_time else None} for r in requests])
    else:
        return jsonify({'message': 'No requests found for this user with given status!'}), 404


@robot_request_blueprint.route('/robot_request/<int:request_id>', methods=['PUT'])
def update_robot_request(request_id):
    data = request.get_json()
    robot_request = Robot_Request.query.get(request_id)
    if robot_request:
        robot_request.request_status = data.get('request_status', robot_request.request_status)
        robot_request.user_id = data.get('user_id', robot_request.user_id)
        robot_request.robot_id = data.get('robot_id', robot_request.robot_id)
        robot_request.pickup_station = data.get('pickup_station', robot_request.pickup_station)
        robot_request.destination_station = data.get('destination_station', robot_request.destination_station)
        robot_request.request_time = data.get('request_time', robot_request.request_time)
        robot_request.completion_time = data.get('completion_time', robot_request.completion_time)
        db.session.commit()
        return jsonify({'message': 'Robot request updated!'})
    else:
        return jsonify({'message': 'Robot request not found!'}), 404

@robot_request_blueprint.route('/robot_request/<int:request_id>', methods=['DELETE'])
def delete_robot_request(request_id):
    robot_request = Robot_Request.query.get(request_id)
    if robot_request:
        db.session.delete(robot_request)
        db.session.commit()
        return jsonify({'message': 'Robot request deleted!'})
    else:
        return jsonify({'message': 'Robot request not found!'}), 404
