CREATE TABLE driver_request (
    request_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    request_status INT NOT NULL,
    user_id INT NOT NULL,
    driver_id INT NOT NULL,
    completion_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (driver_id) REFERENCES user(user_id)
    
);