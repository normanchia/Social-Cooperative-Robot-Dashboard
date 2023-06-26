-- MySQL dump 10.13  Distrib 8.0.33, for macos13.3 (arm64)
--
-- Host: localhost    Database: itp_team10_se
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reminder_time` time DEFAULT NULL,
  `reminder_date` date DEFAULT NULL,
  `appointment_time` time DEFAULT NULL,
  `appointment_date` date DEFAULT NULL,
  `additional_note` varchar(255) DEFAULT NULL,
  `appointment_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `location_id` (`hospital_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,1,1,'09:30:00','2023-06-15','10:00:00','2023-06-16','Please bring any medical records.','General Check-up'),(2,2,1,'14:00:00','2023-06-17','15:30:00','2023-06-18','Fasting required before the appointment.','Blood Test'),(3,3,1,'11:45:00','2023-06-19','12:30:00','2023-06-20','Follow-up appointment for medication review.','Medication Consultation'),(4,1,2,'10:30:00','2023-06-15','11:00:00','2023-06-16','Please bring any previous test results.','Annual Check-up'),(5,2,2,'15:00:00','2023-06-17','16:30:00','2023-06-18','Fasting required for blood work.','Lab Test'),(6,3,2,'09:45:00','2023-06-19','10:30:00','2023-06-20','Discussion about test results.','Follow-up Consultation');
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver_request`
--

DROP TABLE IF EXISTS `driver_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `request_status` int NOT NULL,
  `user_id` int NOT NULL,
  `driver_id` int NOT NULL,
  `completion_time` datetime DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `user_id` (`user_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `driver_request_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `driver_request_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver_request`
--

LOCK TABLES `driver_request` WRITE;
/*!40000 ALTER TABLE `driver_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `driver_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospital`
--

DROP TABLE IF EXISTS `hospital`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospital` (
  `hospital_id` int NOT NULL AUTO_INCREMENT,
  `postal_code` varchar(10) NOT NULL,
  `hospital_name` varchar(255) NOT NULL,
  PRIMARY KEY (`hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospital`
--

LOCK TABLES `hospital` WRITE;
/*!40000 ALTER TABLE `hospital` DISABLE KEYS */;
INSERT INTO `hospital` VALUES (1,'123456','Singapore General Hospital'),(2,'234567','National University Hospital'),(3,'345678','Changi General Hospital'),(4,'456789','Tan Tock Seng Hospital'),(5,'567890','Mount Elizabeth Hospital');
/*!40000 ALTER TABLE `hospital` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `robot`
--

DROP TABLE IF EXISTS `robot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `robot` (
  `robot_id` int NOT NULL AUTO_INCREMENT,
  `robot_name` varchar(255) DEFAULT NULL,
  `robot_status` int DEFAULT NULL,
  `station_location` int DEFAULT NULL,
  PRIMARY KEY (`robot_id`),
  KEY `station_location` (`station_location`),
  CONSTRAINT `robot_ibfk_1` FOREIGN KEY (`station_location`) REFERENCES `robot_station` (`station_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `robot`
--

LOCK TABLES `robot` WRITE;
/*!40000 ALTER TABLE `robot` DISABLE KEYS */;
INSERT INTO `robot` VALUES (1,'Robot1',1,2),(2,'Robot2',1,3),(3,'Robot3',1,5),(4,'Robot4',1,2),(5,'Robot5',1,4);
/*!40000 ALTER TABLE `robot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `robot_request`
--

DROP TABLE IF EXISTS `robot_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `robot_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `request_status` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `robot_id` int DEFAULT NULL,
  `pickup_station` int DEFAULT NULL,
  `destination_station` int DEFAULT NULL,
  `request_time` timestamp NULL DEFAULT NULL,
  `completion_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `user_id` (`user_id`),
  KEY `robot_id` (`robot_id`),
  KEY `pickup_station` (`pickup_station`),
  KEY `destination_station` (`destination_station`),
  CONSTRAINT `robot_request_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `robot_request_ibfk_2` FOREIGN KEY (`robot_id`) REFERENCES `Robot` (`robot_id`),
  CONSTRAINT `robot_request_ibfk_3` FOREIGN KEY (`pickup_station`) REFERENCES `robot_station` (`station_id`),
  CONSTRAINT `robot_request_ibfk_4` FOREIGN KEY (`destination_station`) REFERENCES `robot_station` (`station_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `robot_request`
--

LOCK TABLES `robot_request` WRITE;
/*!40000 ALTER TABLE `robot_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `robot_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `robot_station`
--

DROP TABLE IF EXISTS `robot_station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `robot_station` (
  `station_id` int NOT NULL AUTO_INCREMENT,
  `station_name` varchar(255) DEFAULT NULL,
  `station_location` varchar(255) DEFAULT NULL,
  `slot_available` int DEFAULT NULL,
  `total_slot` int DEFAULT NULL,
  PRIMARY KEY (`station_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `robot_station`
--

LOCK TABLES `robot_station` WRITE;
/*!40000 ALTER TABLE `robot_station` DISABLE KEYS */;
INSERT INTO `robot_station` VALUES (1,'Station Alpha','300m',2,2),(2,'Station Bravo','600m',0,2),(3,'Station Charlie','200m',1,2),(4,'Station Delta','900m',1,2),(5,'Station Echo','700m',1,2);
/*!40000 ALTER TABLE `robot_station` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_type` varchar(45) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'SuperUser'),(2,'User'),(3,'Driver');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(45) NOT NULL,
  `address` varchar(255) NOT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `fk_role` (`role_id`),
  CONSTRAINT `fk_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'superuser','password','Address 1',1),(2,'user','password','Address 2',2),(3,'driver','password','Address 3',3),(5,'JohnDoe','supersecurepassword','123 Main St',NULL),(7,'norman','norman','528b',2),(8,'','','',2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-26 23:13:27
