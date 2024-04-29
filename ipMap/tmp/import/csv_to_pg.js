const fs = require('fs');
const csv = require('csv-parser');
const pgp = require('pg-promise')();
const { host, port, database, user, password } = require('./config'); // Imposta la tua configurazione di connessione al database

const db = pgp({
  host,
  port,
  database,
  user,
  password
});

const csvFilePath = 'vlan14.CSV'; // Sostituisci con il tuo percorso effettivo del file CSV

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
          `INSERT INTO ipAddresses (ip, availability, team, type, environment, hostname, software, osversion, owner, security, pswweakness, note) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            row.ip,
            row.Availability,
            row.team,
            row.type,
            row.environment,
            row.hostname,
            row.software,
            row.osversion,
            row.owner,
            row.security,
            row.pswweakness,
            row.note
          ]
        );
        console.log(`Inserimento riuscito per l'IP: ${row.ip}`);
      } catch (error) {
        console.error(`Errore durante l'inserimento per l'IP: ${row.ip}`, error);
      }
    }

    pgp.end();
    console.log('Processo completato.');
  });
