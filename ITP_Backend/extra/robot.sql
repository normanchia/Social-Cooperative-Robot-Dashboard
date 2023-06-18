CREATE TABLE robot (
    robot_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    robot_name VARCHAR(255),
    robot_status INT,
    robot_destination INT,
    robot_pickup INT,
    FOREIGN KEY (robot_destination) REFERENCES robot_station(station_id),
    FOREIGN KEY (robot_pickup) REFERENCES robot_station(station_id)
);

INSERT INTO Robot (robot_name, robot_status, robot_destination, robot_pickup)
VALUES
('Robot1', 0, NULL, NULL),
('Robot2', 0, NULL, NULL),
('Robot3', 0, NULL, NULL),
('Robot4', 1, 1, 2),
('Robot5', 1, 3, 4);
