const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3031;

// Configurazione della connessione al database
const client = new Client({
  user: 'bertocchi', // Il tuo username per PostgreSQL
  host: 'localhost',
  database: 'password', // Il nome del tuo database PostgreSQL
  password: 'daniele', // La tua password per PostgreSQL
  port: 5432,
});

client.connect();

// Middleware CORS
app.use(cors());


app.use(bodyParser.json());

// Endpoint per gestire la richiesta di inserimento di nuove password
app.post('/addPasswords', (req, res) => {
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
    }
  });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
