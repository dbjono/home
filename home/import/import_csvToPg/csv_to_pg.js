const fs = require('fs');
const csv = require('csv-parser');
const pgp = require('pg-promise')();
const { host, port, database, user, password, table } = require('./config'); // Imposta la tua configurazione di connessione al database
const { column1, column2, column3, column4} = require('./csvColumn');

////////////////// DATABASE DATA
const db = pgp({
  host,
  port,
  database,
  user,
  password
});

//const table = table 
//const column1 = column1
//const column2 = column2
//const column3 = column3
//const column4 = column4
//const column5 = column5
//const column6 = column6

////////////////////////////////

////////////////// CSV DATA


////////////////////////////////

const csvFilePath = 'ebbt-automaticTests.CSV'; // Sostituisci con il tuo percorso effettivo del file CSV

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
          `INSERT INTO ${table} (${column1}, ${column2}, ${column3}, ${column4}) 
           VALUES ($1, $2, $3, $4)`,
          [
            row[column1],
            row[column2],
            row[column3],
            row[column4]
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
