CREATE DATABASE  IF NOT EXISTS `io` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `io`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: io
-- ------------------------------------------------------
-- Server version	5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message` longtext COLLATE utf8mb4_bin NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `username` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES ('Triggered','2018-04-18 14:56:26','busunkim96',1),('!squeak','2018-04-18 14:56:31','busunkim96',2),('hi','2018-04-19 00:00:53','busunkim96',3),('hi','2018-04-19 00:00:53','busunkim96',4),('hi','2018-04-19 00:00:53','busunkim96',5),('hi','2018-04-19 00:00:53','busunkim96',6),('hi','2018-04-19 00:00:53','busunkim96',7),('hi','2018-04-19 00:00:53','busunkim96',8),('blah blah blah','2018-04-19 00:01:00','busunkim96',9),('blah blah blah','2018-04-19 00:01:00','busunkim96',10),('blah blah blah','2018-04-19 00:01:00','busunkim96',11),('blah blah blah','2018-04-19 00:01:01','busunkim96',12),('blah blah blah','2018-04-19 00:01:01','busunkim96',13),('blah blah blah','2018-04-19 00:01:01','busunkim96',14),('this is george\'s thing','2018-04-19 00:01:07','busunkim96',15),('this is george\'s thing','2018-04-19 00:01:07','busunkim96',16),('this is george\'s thing','2018-04-19 00:01:07','busunkim96',17),('this is george\'s thing','2018-04-19 00:01:07','busunkim96',18),('this is george\'s thing','2018-04-19 00:01:07','busunkim96',19),('this is george\'s thing','2018-04-19 00:01:07','busunkim96',20),('hiya','2018-04-19 00:28:10','busunkim96',21),('hi','2018-04-19 00:42:31','busunkim96',22),('hi','2018-04-19 00:42:31','busunkim96',23),('?','2018-04-19 00:42:42','busunkim96',24),('?','2018-04-19 00:42:42','busunkim96',25);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-18 12:44:29
