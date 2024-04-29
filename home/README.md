# home

# PROJECT: Home Password Manager
# AUTHOR: Bertocchi Daniele
# VERSION: 1.0.3

================================================================================
  |                                   HOME                           
================================================================================

# INSTALL

1. Installare express => npm install express
2. Installare pg => npm install pg
3. Installare cors => npm install cors


# POSTGRES INSTALLATION [https://ubuntu.com/server/docs/databases-postgresql]

0. Pre-Steps

	sudo ufw allow 5432/tcp

1. apt install postgresql
2. nano /etc/postgresql/14/main/pg_hba.conf

	- ipv4

	host    all       backup      0.0.0.0/0          trust								
	host    all       all         0.0.0.0/0          md5


3. nano /etc/postgresql/14/main/postgresql.conf

	listen_addresses = '*'


4. service postgresql restart => other option [start / stop / restart]

5. sudo -u postgres psql postgres 							:accesso alla console con utente postgres:postgres

5. 1. \password postgres => inserire 2 volte la psw 		:impostare la psw dell'utente postgres 
5. 2. [ \q o ctlr+d per uscire dalla console ]
5. 3. sudo -u postgres createuser --superuser bertocchi		:creare utente O crearlo da pgadmin
5. 4. sudo -u postgres psql \password bertocchi		

6. Create User DB

	CREATE USER bertocchi WITH PASSWORD 'daniele' SUPERUSER;


7. Create Database

	CREATE DATABASE password OWNER bertocchi;


# DATABASE CONFIGURATION


1. Creazione Tabella

	CREATE TABLE daniele (
	    id SERIAL PRIMARY KEY,
	    tag TEXT NOT NULL,
	    name TEXT,
	    username TEXT,
	    password TEXT,
	    link TEXT,
	    note TEXT
	);


	CREATE TABLE lisa (
	    id SERIAL PRIMARY KEY,
	    tag TEXT NOT NULL,
	    name TEXT,
	    username TEXT,
	    password TEXT,
	    link TEXT,
	    note TEXT
	);



	ALTER TABLE daniele ADD CONSTRAINT unique_name_daniele UNIQUE (name);

	ALTER TABLE lisa ADD CONSTRAINT unique_name_lisa UNIQUE (name);


2. Insert Data


	INSERT INTO daniele (tag, name, username, password)
	VALUES ('servizi', 'imetec', 'bertocchi.daniele@outlook.it', 'Dominionluna1$');

	INSERT INTO lisa (tag, name, username, password)
	VALUES ('servizi', 'imetec', 'bertocchi.daniele@outlook.it', 'Dominionluna1$');
