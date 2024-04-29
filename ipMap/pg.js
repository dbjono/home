const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
var http = require('http');
var url = require('url');

const app = express();
const port = 3030;


//////////////////////////////// HOST PAGE SECTION ///

const PORT = process.env.PORT || 3031; // Porta configurabile, default 3000
const publicDirectoryPath = path.join(__dirname, './'); // Nome della directory dei file pubblici

app.use(express.static(publicDirectoryPath));

app.listen(PORT, () => {
  //console.log(`Server avviato sulla porta ${PORT}`);
});

//////////////////////////////////////////////////////

///////////////////// CONFIG FILE

// Leggere il contenuto del file di configurazione JSON
fs.readFile('config.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Errore nella lettura del file di configurazione:', err);
    return;
  }

  try {

    // Analizzare il contenuto JSON
      const config = JSON.parse(data);
      //console.log(config)
      
    // Variabili di Accesso
      host = config.host;
      database = config.database;
      dport = config.port;
      user = config.user;
      password = config.password;
      

      //////////////////////////////// VIEW DATA SECTION ///

      // Configurazione della connessione al database PostgreSQL
      const client = new Client({
        user: user,
        password: password,
        host: host,
        database: database,    
        port: dport,
      });
      client.connect();

// Middleware CORS
app.use(cors());

      // Endpoint per gestire la richiesta dei dati
      app.get('/ipadresses', (req, res) => {
        client.query('SELECT * FROM ipaddresses ORDER BY ip ASC', (err, result) => {
            if (err) {
                console.error('Errore nella query:', err);
                res.status(500).send('Errore nel recupero dei dati');
            } else {
                res.json(result.rows); // Invia i dati come JSON alla richiesta della pagina HTML
            }
        });
      });



      /////////////////////////////////////////////////////////

      //////////////////////////////// ADD PASSWORD SECTION ///

      app.use(bodyParser.json());


      ////////// VLAN 14 ///

      // Endpoint per gestire la richiesta di inserimento di nuove password
      app.post('/addIP', (req, res) => {
        const { ip, availability, team, type, environment, hostname, software, osVersion, owner, security, pswWeakness, note} = req.body;

        // Esegui la query per inserire o aggiornare le password nel database
        const query = `
          INSERT INTO ipaddresses (ip, availability, team, type, environment, hostname, software, osVersion, owner, security, pswWeakness, note)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (ip)
          DO UPDATE SET ip = $1, availability = $2, team = $3, type = $4, environment = $5, hostname = $6, software = $7, osVersion = $8, owner = $9, security = $10, pswWeakness = $11, note = $12
          RETURNING *;
        `;

        client.query(query, [ip, availability, team, type, environment, hostname, software, osVersion, owner, security, pswWeakness, note], (err, result) => {
          if (err) {
            console.error('Errore nell\'inserimento/aggiornamento dell ip:', err);
            res.status(500).send('Errore nell\'inserimento/aggiornamento dell ip');
            console.log(req.body)
          } else {
            res.json({ message: 'Ip inserito/aggiornato correttamente', data: result.rows });
            console.log(result.rows)
          }
        });
      });




      /////////////////////////////////////////////////////////


      //////////////////////////////// FREE IP LIST ///

      app.get('/api/ipaddresses', async (req, res) => {
      try {
        // Esegui una query per ottenere gli indirizzi IP con availability uguale a 'Yes'
        const result = await client.query('SELECT ip FROM ipAddresses WHERE availability = $1', ['Yes']);
        const ipAddresses = result.rows.map(row => row.ip);

        // Invia la risposta come JSON
        res.json(ipAddresses);
      } catch (error) {
        console.error('Errore durante la query:', error);
        res.status(500).send('Internal Server Error');
      }
      });

      ///////////////////////////////////////////


      //////////////////////////////// OCCUPIED IP LIST VIEW///

      app.get('/api/UsedIpAddresses', async (req, res) => {
      try {
        // Esegui una query per ottenere gli indirizzi IP con availability uguale a 'Yes'
        const result = await client.query('SELECT ip FROM ipAddresses WHERE availability = $1', ['No']);
        const ipAddresses = result.rows.map(row => row.ip);

        // Invia la risposta come JSON
        res.json(ipAddresses);
      } catch (error) {
        console.error('Errore durante la query:', error);
        res.status(500).send('Internal Server Error');
      }
      });

      ///////////////////////////////////////////


      //////////////////////////////// OCCUPIED IP LIST DELETE///

      // Endpoint per gestire la richiesta di inserimento di nuove password
      app.post('/delIp', (req, res) => {
      const { ip, availability, team, type, environment, hostname, software, osVersion, owner, security, pswWeakness, note} = req.body;

      // Esegui la query per inserire o aggiornare le password nel database
      const query = `
        INSERT INTO ipaddresses (ip, availability, team, type, environment, hostname, software, osVersion, owner, security, pswWeakness, note)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (ip)
        DO UPDATE SET ip = $1, availability = $2, team = $3, type = $4, environment = $5, hostname = $6, software = $7, osVersion = $8, owner = $9, security = $10, pswWeakness = $11, note = $12
        RETURNING *;
      `;

      client.query(query, [ip, availability, team, type, environment, hostname, software, osVersion, owner, security, pswWeakness, note], (err, result) => {
        if (err) {
          console.error('Errore nell\'inserimento/aggiornamento dell ip:', err);
          res.status(500).send('Errore nell\'inserimento/aggiornamento dell ip');
          console.log(req.body)
        } else {
          res.json({ message: 'Ip inserito/aggiornato correttamente', data: result.rows });
          console.log(result.rows)
        }
      });
      });

      /////////////////////////////////////////////////////////////


    


      app.listen(port, () => {
      console.log("===============================================")
      console.log(" PROJECT: HUB R&D VLAN MAPPING")
      console.log(" AUTHOR: Bertocchi Daniele")
      console.log(" RELEASE: 1.0.10")
      console.log(` Server Postgres avviato su http://${host}:${port}`);
      console.log(` Server R&D IP Mapping Page avviato su http://${host}:${PORT}`);
      console.log(` Database Data: Database Name: ${database}`);
      console.log(` Database Data: Database User: ${user}`);
      console.log("===============================================")
        
     
      });

   } catch (parseError) {
    console.error('Errore nella conversione del JSON:', parseError);
  }

});

///////////////////////////////// UPDATE SERVICE


var server = http.createServer(function(req, res) {
  var page = url.parse(req.url).pathname; 
  
  //console.log(page);
  res.writeHead(200, {"Content-Type": "text/plain"});
  if (page == '/') 
  {
    res.write('Cosa vuoi aggiornare e dove?');
  } 
   else if (page == '/updateAll') 
  {
    require('child_process').exec("./update_service/update.bat"); 
    console.log("***************************")
    console.log("sono qui")
  }
  res.end();
});

server.listen(3032);
