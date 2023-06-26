CREATE TABLE robot (
    robot_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    robot_name VARCHAR(255),
    robot_status INT,
    station_location INT,
    FOREIGN KEY (station_location) REFERENCES robot_station(station_id)
);

INSERT INTO Robot (robot_name, robot_status, station_location)
VALUES
('Robot1', 1, 1),
('Robot2', 1, 3),
('Robot3', 1, 1),
('Robot4', 1, 2),
('Robot5', 1, 4);
