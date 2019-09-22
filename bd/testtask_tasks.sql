-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: testtask
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.16.04.1

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
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(125) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `date_up` date DEFAULT NULL,
  `date_st` date NOT NULL,
  `date_end` date DEFAULT NULL,
  `priority` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `creator` int(11) NOT NULL,
  `performer` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `creator_fk` (`creator`),
  KEY `performer_fk` (`performer`),
  KEY `priority_fk` (`priority`),
  KEY `status_fk` (`status`),
  CONSTRAINT `creator_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `performer_fk` FOREIGN KEY (`performer`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `priority_fk` FOREIGN KEY (`priority`) REFERENCES `prioritys` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `status_fk` FOREIGN KEY (`status`) REFERENCES `statuses` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'Сделать тестовую задачу','Сделать задачу для проверки корректности запросов','2019-09-22','2019-09-17','2019-09-17',1,1,11,12),(2,'Добавть еще данных','Добавить данные для дополнительной проверки','2019-09-22','2019-09-17','2019-09-18',1,2,11,13),(3,'Проверить корректность данных','Убедится что данные вставляются кореектно','2019-09-22','2019-09-21','2019-09-21',2,1,11,14),(4,'Проверить обновление данных','Убедится что данные обновляются после вставки','2019-09-22','2019-09-21','2019-09-21',1,3,11,13),(5,'Проверить функции связанные с временем','Убедиться в правильной работоспособности функций','2019-09-23','2019-09-22','2019-09-29',1,3,11,15),(6,'Проверить запрос','Убедиться что все запросы работают корректно','2019-09-22','2019-09-17','2019-09-22',2,3,11,15),(7,'Тест даты','Задача для тестирования дат','2019-09-22','2019-09-22','2019-09-22',2,2,11,12),(8,'Проверить оставшиеся запросы','Убедиться в корректности передаваемых данных','2019-09-22','2019-09-22','2019-09-22',2,1,11,15),(9,'Еще одна тестовая задача','Просто тест запроса','2019-09-23','2019-09-22','2019-09-25',3,3,11,15),(10,'Проверка запроса на будущее','Проверить','2019-09-23','2019-09-23','2019-10-15',3,3,11,15);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-23  1:23:31
