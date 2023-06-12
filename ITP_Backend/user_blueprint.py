from flask import Blueprint, jsonify, request
from models import User, db

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/user', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(username=data['username'], password=data['password'], address=data['address'])
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
