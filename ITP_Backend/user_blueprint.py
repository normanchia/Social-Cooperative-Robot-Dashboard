from flask import Blueprint, jsonify, request
from models import User, db
#For JWT Token
from flask_jwt_extended import create_access_token

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

