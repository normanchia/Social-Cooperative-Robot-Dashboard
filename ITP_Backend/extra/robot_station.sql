CREATE TABLE robot_station(
    station_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    station_name VARCHAR(255),
    station_location VARCHAR(255)
);

INSERT INTO robot_station (station_name, station_location)
VALUES ('Station Alpha', '300m');

INSERT INTO robot_station (station_name, station_location)
VALUES ('Station Bravo', '600m');

INSERT INTO robot_station (station_name, station_location)
VALUES ('Station Charlie', '200m');

INSERT INTO robot_station (station_name, station_location)
VALUES ('Station Delta', '900m');

INSERT INTO robot_station (station_name, station_location)
VALUES ('Station Echo', '700m');
