CREATE USER 'someuser'@'localhost';
SET password FOR 'someuser'@'localhost' = password('strongpwd');
CREATE DATABASE mydb;
GRANT ALL ON mydb.* TO 'someuser'@'localhost';
CREATE TABLE Employee3 (empid VARCHAR(255) NOT NULL, Name VARCHAR(255) NULL, Details VARCHAR(255) NULL);

