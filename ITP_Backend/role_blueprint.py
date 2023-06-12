from flask import Blueprint, jsonify, request
from models import Role, db

role_blueprint = Blueprint('role', __name__)

@role_blueprint.route('/role/<int:role_id>', methods=['GET'])
def get_role(role_id):
    role = Role.query.get(role_id)
    if role:
        return jsonify({'role_type': role.role_type})
    else:
        return jsonify({'message': 'Role not found!'}), 404
