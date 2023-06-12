from flask import Flask
from models import db
from flask_sqlalchemy import SQLAlchemy
from credential import host,user,password,database

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://'+user+':@'+host+'/'+database
db.init_app(app)

from user_blueprint import user_blueprint
from role_blueprint import role_blueprint
from hospital_blueprint import hospital_blueprint
from appointment_blueprint import appointment_blueprint

app.register_blueprint(user_blueprint)
app.register_blueprint(role_blueprint)
app.register_blueprint(hospital_blueprint)
app.register_blueprint(appointment_blueprint)

if __name__ == "__main__":
    app.run(debug=True)
