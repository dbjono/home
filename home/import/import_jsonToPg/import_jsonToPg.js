const fs = require('fs');
const { Client } = require('pg');
const { host, port, database, user, password, table } = require('./config'); // Imposta la tua configurazione di connessione al database

// Configura le informazioni di connessione al database
const client = new Client({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
});

// Leggi il file JSON
fs.readFile('AllEbbsBugs.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Errore durante la lettura del file JSON:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        await insertDataIntoDatabase(jsonData);
    } catch (error) {
        console.error('Errore durante il parsing del JSON:', error);
    }
});

// Funzione per inserire i dati nel database
async function insertDataIntoDatabase(data) {
    try {
        // Connetti al database
        await client.connect();

        // Itera su ogni oggetto nel JSON
        for (const item of data) {
            const keys = Object.keys(item);
            const values = Object.values(item);

            const placeholders = Array(keys.length).fill('$', 0).map((value, index) => `${value}${index + 1}`).join(', ');

            const query = {
                text: `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
                values: values,
            };

            await client.query(query);
            console.log('Elemento inserito nel database:', item);
        }

        console.log('Inserimento completato!');
    } catch (error) {
        console.error('Errore durante l\'inserimento nel database:', error);
    } finally {
        // Chiudi la connessione al database
        await client.end();
    }
}
