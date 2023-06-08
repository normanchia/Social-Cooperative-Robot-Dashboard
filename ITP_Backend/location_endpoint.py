from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from credential import username,password

server = 'se-team10-server.database.windows.net'
database = 'SE_Team10_DB'
port = '1433'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mssql+pymssql://{username}:{password}@{server}/{database}'
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Location(db.Model):
    __tablename__ = 'Location'
    l_id = db.Column(db.String(20), primary_key=True)
    l_name = db.Column(db.String(100))
    l_blk = db.Column(db.String(100))
    # l_geo = db.Column(db.String(100))

    def __init__(self, l_id, l_name, l_blk, l_geo):
        self.l_id = l_id
        self.l_name = l_name
        self.l_blk = l_blk
        # self.l_geo = l_geo

class LocationSchema(ma.Schema):
    class Meta:
        fields = ('l_id', 'l_name', 'l_blk')
        # fields = ('l_id', 'l_name', 'l_blk', 'l_geo')

location_schema = LocationSchema()
locations_schema = LocationSchema(many=True)

# endpoint to create new location
@app.route("/location", methods=["POST"])
def add_location():
    l_id = request.json['l_id']
    l_name = request.json['l_name']
    l_blk = request.json['l_blk']
    # l_geo = request.json['l_geo']

    new_location = Location(l_id, l_name, l_blk)
    # new_location = Location(l_id, l_name, l_blk, l_geo)

    db.session.add(new_location)
    db.session.commit()

    return location_schema.jsonify(new_location)

# endpoint to show all locations
@app.route("/location", methods=["GET"])
def get_location():
    all_locations = Location.query.all()
    result = locations_schema.dump(all_locations)
    return jsonify(result)

# endpoint to get location detail by id
@app.route("/location/<id>", methods=["GET"])
def location_detail(id):
    location = Location.query.get(id)
    return location_schema.jsonify(location)

# endpoint to update location
@app.route("/location/<id>", methods=["PUT"])
def location_update(id):
    location = Location.query.get(id)
    l_name = request.json['l_name']
    l_blk = request.json['l_blk']
    # l_geo = request.json['l_geo']

    location.l_name = l_name
    location.l_blk = l_blk
    # location.l_geo = l_geo

    db.session.commit()
    return location_schema.jsonify(location)

# endpoint to delete location
@app.route("/location/<id>", methods=["DELETE"])
def location_delete(id):
    location = Location.query.get(id)
    db.session.delete(location)
    db.session.commit()

    return location_schema.jsonify(location)

if __name__ == '__main__':
    app.run(debug=True)
