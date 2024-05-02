# home

# PROJECT: Import from csv to db
# AUTHOR: Bertocchi Daniele
# VERSION: 1.0.3

================================================================================
  |                                Import from csv to db                           
================================================================================

# INSTALL




# DATABASE CONFIGURATION


1. Creazione Tabella

	CREATE TABLE ipAddresses (
    ip INET PRIMARY KEY,    
    availability text,
    team TEXT,
    type TEXT,
    environment TEXT,
    hostname TEXT,
    software TEXT,
    osVersion TEXT,
    owner TEXT,
    security TEXT,
    pswWeakness TEXT,
    note TEXT
);



2. Insert Data


	INSERT INTO ipadresses (
		ip, subnet, gateway, availability, team, type, environment,
		hostname, software, osVersion, owner, security, pswWeakness,
		note, mapping
	) VALUES (
		'192.168.1.100', '192.168.1.0/24', '192.168.1.1', 'Available',
		'IT Team', 'Server', 'Production', 'server-01',
		'Web Server', 'Ubuntu 20.04', 'John Doe', 'Firewall Enabled',
		'Password123', 'Important server for web applications.',
		'{"key1": "value1", "key2": "value2"}'
	);

3. Update Data

	UPDATE ipadresses
	SET availability = 'No'
	WHERE availability IS DISTINCT FROM 'Yes';
