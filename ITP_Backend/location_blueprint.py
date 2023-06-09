from flask import Blueprint, request, jsonify
from models import Location, db
from schemas import LocationSchema

location_blueprint = Blueprint('location_blueprint', __name__)

location_schema = LocationSchema()
locations_schema = LocationSchema(many=True)

@location_blueprint.route("/addLocation", methods=["POST"])
def add_location():
    l_id = request.json['l_id']
    l_name = request.json['l_name']
    l_blk = request.json['l_blk']

    new_location = Location(l_id, l_name, l_blk)

    db.session.add(new_location)
    db.session.commit()

    return location_schema.jsonify(new_location)

@location_blueprint.route("/locations", methods=["GET"])
def get_locations():
    all_locations = Location.query.all()
    result = locations_schema.dump(all_locations)
    return jsonify(result)

@location_blueprint.route("/get-location/<id>", methods=["GET"])
def location_detail(id):
    location = Location.query.get(id)
    return location_schema.jsonify(location)

@location_blueprint.route("/update-location/<id>", methods=["PUT"])
def location_update(id):
    location = Location.query.get(id)
    l_name = request.json['l_name']
    l_blk = request.json['l_blk']

    location.l_name = l_name
    location.l_blk = l_blk

    db.session.commit()
    return location_schema.jsonify(location)

@location_blueprint.route("/delete-location/<id>", methods=["DELETE"])
def location_delete(id):
    location = Location.query.get(id)
    db.session.delete(location)
    db.session.commit()

    return location_schema.jsonify(location)

