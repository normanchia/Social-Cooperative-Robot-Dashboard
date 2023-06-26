CREATE TABLE robot_request (
    request_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    request_status INT,
    user_id INT,
    robot_id INT,
    pickup_station INT,
    destination_station INT,
    request_time TIMESTAMP,
    completion_time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (robot_id) REFERENCES Robot(robot_id),
    FOREIGN KEY (pickup_station) REFERENCES robot_station(station_id),
    FOREIGN KEY (destination_station) REFERENCES robot_station(station_id)
);
