--- load with 
--- sqlite3 database.db < schema.sql
DROP TABLE IF EXISTS account;

CREATE TABLE account (
	userName VARCHAR(20) PRIMARY KEY,
	password VARCHAR,
	gender VARCHAR,
	skillLevel VARCHAR(20),
	playTimes VARCHAR,
	score INTEGER DEFAULT 0
);
