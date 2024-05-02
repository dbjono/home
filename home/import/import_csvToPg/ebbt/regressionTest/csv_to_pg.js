const fs = require('fs');
const csv = require('csv-parser');
const pgp = require('pg-promise')();
const { host, port, database, user, password, table } = require('./config/config'); // Imposta la tua configurazione di connessione al database
const { column1, column2, column3, column4, column5, column6, column7, column8} = require('./config/csvColumn');

////////////////// DATABASE DATA
const db = pgp({
  host,
  port,
  database,
  user,
  password
});

////////////////////////////////

////////////////// CSV DATA


////////////////////////////////

const csvFilePath = 'ebbt-regression-all.CSV'; // Sostituisci con il tuo percorso effettivo del file CSV

const rows = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    rows.push(row);
  })
  .on('end', async () => {
    for (const row of rows) {
      try {
        await db.none(
          `INSERT INTO ${table} (${column1}, ${column2}, ${column3}, ${column4}, ${column5}, ${column6}, ${column7}, ${column8}) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            row[column1],
            row[column2],
            row[column3],
            row[column4],
            row[column5],
            row[column6],
            row[column7],
            row[column8]
          ]
        );
        console.log(`Inserimento riuscito dei dati`);
      } catch (error) {
        console.error(`Errore durante l'inserimento dei dati`, error);
      }
    }

    pgp.end();
    console.log('Processo completato.');
  });
