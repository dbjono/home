# home

# PROJECT: Import from csv to db
# AUTHOR: Bertocchi Daniele
# VERSION: 1.0.3

================================================================================
  |                                Import from csv to db  EBBS EBBT                         
================================================================================

# INSTALL




# DATABASE CONFIGURATION

## EBBS

import_jsonToPg

db: ebbs
tables: ebbs

1. Creazione Tabella

	CREATE TABLE ebbs (
    key text PRIMARY KEY,   
    summary text,
    priority TEXT,
    resolution TEXT,
    status TEXT,
    assignee TEXT,
    reporter TEXT,
    createdDate TEXT,
    updatedDate TEXT,
    resolutionDate TEXT,
    fixVersions TEXT,
    affectedVersions text,
    labels text
);



## EBBT


import_csvToPg

db: ebbt

tables: automatictest
tables: regressiontest