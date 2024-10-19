const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Database setup
const db = new sqlite3.Database(':memory:'); // Using an in-memory database for simplicity

// Function to get media info from the database
function getMediaInfo(id, callback) {
    db.get(`SELECT * FROM media WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
}

// Endpoint to fetch media info from the database
app.get('/media/:id', (req, res) => {
    const id = req.params.id;
    getMediaInfo(id, (err, media) => {
        if (err) {
            return res.status(500).send('Errore durante il recupero dei dati.');
        }
        if (!media) {
            return res.status(404).send('Media non trovato.');
        }
        res.status(200).json(media);
    });
});

module.exports = app;
