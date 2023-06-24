from flask import Blueprint, jsonify, request
from models import Driver_Request, db,Robot
from datetime import datetime

driver_request_blueprint = Blueprint('driver_request', __name__)

# Create a new driver request
@driver_request_blueprint.route('/driver_request', methods=['POST'])
def create_driver_request():
    # Get data from request
    request_data = request.get_json()
    user_id = request_data['user_id']
    driver_id = request_data['driver_id']
    request_status = 0
    completion_time = None

    # Create a new driver request
    new_request = Driver_Request(request_status=request_status, user_id=user_id, driver_id=driver_id, completion_time=completion_time)

    # Add the new driver request to the database
    db.session.add(new_request)
    db.session.commit()

    # Return a response
    return jsonify({'message': 'New driver request created!'})

@driver_request_blueprint.route('/driver_request/<int:request_id>', methods=['PUT'])
def update_driver_request(request_id):
    # Get data from request
    request_data = request.get_json()
    request_status = request_data['request_status']

    completion_time = None  # Default value

    if request_status == 3:
        completion_time = datetime.utcnow()

    # Find the driver request by request_id
    driver_request = Driver_Request.query.get(request_id)
    if driver_request:
        # Update the driver request status and completion time
        driver_request.request_status = request_status
        driver_request.completion_time = completion_time
        db.session.commit()

        # Return a response
        return jsonify({'message': 'Driver request updated!'})
    else:
        return jsonify({'message': 'Driver request not found!'}), 404



#Get all robot requests by destination station id and request status = 0
@driver_request_blueprint.route('/driver_request/driver/<int:driver_id>/status/<int:request_status>', methods=['GET'])
def get_driver_requests(driver_id, request_status):
    requests = Driver_Request.query.filter_by(driver_id=driver_id, request_status=request_status).all()
    if requests:
        return jsonify([{'request_id': r.request_id,
                         'request_status': r.request_status,
                         'user_id': r.user_id,
                            'driver_id': r.driver_id,
                         'completion_time': r.completion_time.strftime('%Y-%m-%d %H:%M:%S') if r.completion_time else None} for r in requests])
    else:
        return jsonify({'message': 'No requests found for this driver with given status!'}), 404
    

#Get all robot requests by destination station id and request status NOT 3
@driver_request_blueprint.route('/driver_request/driver/<int:driver_id>', methods=['GET'])
def get_driver_requests_not_completed(driver_id):
    requests = Driver_Request.query.filter_by(driver_id=driver_id).filter(Driver_Request.request_status != 3).all()
    if requests:
        return jsonify([{'request_id': r.request_id,
                         'request_status': r.request_status,
                         'user_id': r.user_id,
                            'driver_id': r.driver_id,
                         'completion_time': r.completion_time.strftime('%Y-%m-%d %H:%M:%S') if r.completion_time else None} for r in requests])
    else:
        return jsonify({'message': 'No requests found for this driver with given status!'}), 404
