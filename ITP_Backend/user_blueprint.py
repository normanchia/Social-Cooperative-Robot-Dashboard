from flask import Blueprint, jsonify, request, current_app
from models import User, db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from jwt import ExpiredSignatureError, InvalidTokenError

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/user', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(username=data['username'], password=data['password'], address=data['address'], role_id=data['role_id'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'New user created!'})

@user_blueprint.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({'username': user.username, 'address': user.address, 'role_id': user.role_id})
    else:
        return jsonify({'message': 'User not found!'}), 404

#Login Route
@user_blueprint.route('/login', methods=['POST'])
def login():

    data = request.get_json()
    username = data['username']
    password = data['password']

    # Perform authentication and retrieve user's role from the database
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        # Authentication successful
        access_token = create_access_token(identity=user.username, additional_claims={'role_id': user.role_id})
        return jsonify({'access_token': access_token})
    
    else:
        # Authentication failed
        return jsonify({'message': 'Invalid credentials'}), 401
    

@user_blueprint.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if user:
            user_details = {
                'user_id': user.user_id,
                'username': user.username,
                'address': user.address,
                'role_id': user.role_id
            }
            return jsonify(user_details)
        else:
            return jsonify({'message': 'User not found'}), 404
    except ExpiredSignatureError:
        return jsonify({'message': 'Expired token'}), 401
    except InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
