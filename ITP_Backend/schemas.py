from flask_marshmallow import Marshmallow
from models import Appointment, Location

ma = Marshmallow()

class AppointmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Appointment
        fields = ('a_id', 'a_name', 'loc_id','a_time','a_date','a_retime')

class LocationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Location
        fields = ('l_id', 'l_name', 'l_blk')
