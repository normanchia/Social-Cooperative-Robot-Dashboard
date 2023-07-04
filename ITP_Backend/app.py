from flask import Flask
from models import db
from flask_sqlalchemy import SQLAlchemy
from credential import host,user,password,database
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://' + user + ':' + password + '@' + host + '/' + database
db.init_app(app)

# Configure JWT settings
app.config['JWT_SECRET_KEY'] = 'asdfg1234'  # Replace with your own secret key
jwt = JWTManager(app)

from user_blueprint import user_blueprint
from role_blueprint import role_blueprint
from hospital_blueprint import hospital_blueprint
from appointment_blueprint import appointment_blueprint
from robotstation_blueprint import robotstation_blueprint
from robot_blueprint import robot_blueprint
from robot_request_blueprint import robot_request_blueprint
from driver_request_blueprint import driver_request_blueprint

app.register_blueprint(user_blueprint)
app.register_blueprint(role_blueprint)
app.register_blueprint(hospital_blueprint)
app.register_blueprint(appointment_blueprint)
app.register_blueprint(robotstation_blueprint)
app.register_blueprint(robot_blueprint)
app.register_blueprint(robot_request_blueprint)
app.register_blueprint(driver_request_blueprint)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
