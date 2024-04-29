# home

# PROJECT: Hub R&D IP Mapping Page
# AUTHOR: Bertocchi Daniele
# VERSION: 1.0.10

================================================================================
  |                                   HOME                           
================================================================================

# INSTALL

1. Installare express => npm install express
2. Installare pg => npm install pg
3. Installare cors => npm install cors

# TOOLS


# API

- Page Hosted on Default Port: 3031


- /ipadresses	[Execute a SELECT in table IPADDRESSES all Ip's];

- /addIp [Execute an INSERT in table IPADDRESSES of all data's into ip addresses (ip, availability, team, type, environment, hostname, software, osVersion, owner, security, pswWeakness, note); IF Ip is present will execute an UPDATE]

- /api/ipaddresses [Execute a SELECT in table IPADDRESSES where the value AVAILABILITY is equal to YES]

- /api/UsedIpAddresses [Execute a SELECT in table IPADDRESSES where the value AVAILABILITY is equal to NO]

- /delIp [Execute an INSERT in table IPADDRESSES equal to NULL of all data's into ip addresses (ip, availability, team, type, environment, hostname, software, osVersion, owner, security, pswWeakness, note)]




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


INSERT INTO ipaddresses (
		ip, availability, team, type, environment, hostname, software, osversion,
		owner, security, pswweakness, note
	) VALUES (
		'172.29.1.75', '', '', '','', '', '', '','', '', '', ''
	);
	



3. Update Data

	UPDATE ipadresses
	SET availability = 'No'
	WHERE availability IS DISTINCT FROM 'Yes';
