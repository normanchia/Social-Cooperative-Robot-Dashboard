from flask import Flask
from models import db
from appointment_blueprint import appointment_blueprint
from location_blueprint import location_blueprint
from schemas import ma
from credential import username, password, server, database

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mssql+pymssql://{username}:{password}@{server}/{database}'

db.init_app(app)
ma.init_app(app)

app.register_blueprint(appointment_blueprint)
app.register_blueprint(location_blueprint)

if __name__ == "__main__":
    app.run(debug=True)
