-- MySQL dump 10.13  Distrib 9.0.1, for Win64 (x86_64)
--
-- Host: localhost    Database: degreeprogress
-- ------------------------------------------------------
-- Server version	9.0.1

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
-- Current Database: `degreeprogress`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `degreeprogress` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `degreeprogress`;

--
-- Table structure for table `genedclasses`
--

DROP TABLE IF EXISTS `genedclasses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genedclasses` (
  `Class` char(7) NOT NULL,
  `GenEd` varchar(38) DEFAULT NULL,
  PRIMARY KEY (`Class`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genedclasses`
--

LOCK TABLES `genedclasses` WRITE;
/*!40000 ALTER TABLE `genedclasses` DISABLE KEYS */;
/*!40000 ALTER TABLE `genedclasses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userclasses`
--

DROP TABLE IF EXISTS `userclasses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userclasses` (
  `UserPass` varchar(16) NOT NULL,
  `Class` char(7) NOT NULL,
  `Credits` tinyint DEFAULT NULL,
  PRIMARY KEY (`UserPass`,`Class`),
  KEY `Class` (`Class`),
  CONSTRAINT `userclasses_ibfk_1` FOREIGN KEY (`UserPass`) REFERENCES `userinformation` (`Userpass`) ON DELETE CASCADE,
  CONSTRAINT `userclasses_ibfk_2` FOREIGN KEY (`Class`) REFERENCES `genedclasses` (`Class`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userclasses`
--

LOCK TABLES `userclasses` WRITE;
/*!40000 ALTER TABLE `userclasses` DISABLE KEYS */;
/*!40000 ALTER TABLE `userclasses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userinformation`
--

DROP TABLE IF EXISTS `userinformation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userinformation` (
  `Userpass` varchar(16) NOT NULL,
  `UserEmail` varchar(320) DEFAULT NULL,
  `UserFirstName` varchar(50) DEFAULT NULL,
  `UserLastName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Userpass`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userinformation`
--

LOCK TABLES `userinformation` WRITE;
/*!40000 ALTER TABLE `userinformation` DISABLE KEYS */;
/*!40000 ALTER TABLE `userinformation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usertimerestrictions`
--

DROP TABLE IF EXISTS `usertimerestrictions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usertimerestrictions` (
  `UserPass` varchar(16) NOT NULL,
  `DayOfWeek` varchar(4) NOT NULL,
  `StartDeadTime` time NOT NULL,
  `EndDeadTime` time DEFAULT NULL,
  PRIMARY KEY (`UserPass`,`DayOfWeek`,`StartDeadTime`),
  CONSTRAINT `usertimerestrictions_ibfk_1` FOREIGN KEY (`UserPass`) REFERENCES `userinformation` (`Userpass`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usertimerestrictions`
--

LOCK TABLES `usertimerestrictions` WRITE;
/*!40000 ALTER TABLE `usertimerestrictions` DISABLE KEYS */;
/*!40000 ALTER TABLE `usertimerestrictions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-26 15:22:31
