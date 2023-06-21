CREATE TABLE robot_station(
    station_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    station_name VARCHAR(255),
    station_location VARCHAR(255),
    slot_available INT,
    total_slot INT
);

INSERT INTO robot_station (station_name, station_location,slot_available,total_slot)
VALUES ('Station Alpha', '300m',0,2);

INSERT INTO robot_station (station_name, station_location,slot_available,total_slot)
VALUES ('Station Bravo', '600m',1,2);

INSERT INTO robot_station (station_name, station_location,slot_available,total_slot)
VALUES ('Station Charlie', '200m',1,2);

INSERT INTO robot_station (station_name, station_location,slot_available,total_slot)
VALUES ('Station Delta', '900m',1,2);

INSERT INTO robot_station (station_name, station_location,slot_available,total_slot)
VALUES ('Station Echo', '700m',2,2);
