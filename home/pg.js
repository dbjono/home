const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');
const path = require('path');

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

//////////////////////////////// VIEW DATA SECTION ///

// Configurazione della connessione al database PostgreSQL
const client = new Client({
    user: 'bertocchi',
    host: 'localhost',
    database: 'password',
    password: 'daniele',
    port: 5432,
});
client.connect();

// Middleware CORS
app.use(cors());

// Endpoint per gestire la richiesta dei dati
app.get('/daniele', (req, res) => {
    client.query('SELECT * FROM daniele', (err, result) => {
        if (err) {
            console.error('Errore nella query:', err);
            res.status(500).send('Errore nel recupero dei dati');
        } else {
            res.json(result.rows); // Invia i dati come JSON alla richiesta della pagina HTML
        }
    });
});

// Endpoint per gestire la richiesta dei dati
app.get('/lisa', (req, res) => {
    client.query('SELECT * FROM lisa', (err, result) => {
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


////////// DANIELE ///

// Endpoint per gestire la richiesta di inserimento di nuove password
app.post('/addPasswordsDani', (req, res) => {
    const { tag, name, username, password, link, note } = req.body;
  
    // Esegui la query per inserire o aggiornare le password nel database
    const query = `
      INSERT INTO daniele (tag, name, username, password, link, note)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (name)
      DO UPDATE SET tag = $1, username = $3, password = $4, link = $5, note = $6
      RETURNING *;
    `;
  
    client.query(query, [tag, name, username, password, link, note], (err, result) => {
      if (err) {
        console.error('Errore nell\'inserimento/aggiornamento delle password:', err);
        res.status(500).send('Errore nell\'inserimento/aggiornamento delle password');
      } else {
        res.json({ message: 'Password inserite/aggiornate correttamente', data: result.rows });
        console.log(result.rows)
      }
    });
  });

////////// LISA ///

// Endpoint per gestire la richiesta di inserimento di nuove password
app.post('/addPasswordsLisa', (req, res) => {
  const { ltag, lname, lusername, lpassword, llink, lnote } = req.body;

  // Esegui la query per inserire o aggiornare le password nel database
  const query = `
    INSERT INTO lisa (tag, name, username, password, link, note)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (name)
    DO UPDATE SET tag = $1, username = $3, password = $4, link = $5, note = $6
    RETURNING *;
  `;

  client.query(query, [ltag, lname, lusername, lpassword, llink, lnote], (err, result) => {
    if (err) {
      console.error('Errore nell\'inserimento/aggiornamento delle password:', err);
      res.status(500).send('Errore nell\'inserimento/aggiornamento delle password');
    } else {
      res.json({ message: 'Password inserite/aggiornate correttamente', data: result.rows });
      console.log(result.rows)
    }
  });
});


/////////////////////////////////////////////////////////

app.listen(port, () => {
console.log("===============================================")
console.log(" PROJECT: Home Password Manager")
console.log(" AUTHOR: Bertocchi Daniele")
console.log(" RELEASE: 1.0.3")
console.log(` Server Postgres avviato su http://localhost:${port}`);
console.log(` Server Home Page avviato sulla porta ${PORT}`);
console.log("===============================================")
    
});
