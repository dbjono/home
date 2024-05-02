const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Imposta l'intestazione CORS per consentire le richieste da qualsiasi origine
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Gestisce la richiesta GET per il file CSV
    if (req.url === '/data.csv') {
        const filePath = path.join(__dirname, 'data.csv');
        serveFile(filePath, 'text/csv', res);
    }
    // Gestisce la richiesta GET per il file JSON
    else if (req.url === '/data.json') {
        const filePath = path.join(__dirname, 'data.json');
        serveFile(filePath, 'application/json', res);
    }
    // Gestisce le richieste per altre risorse
    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Risorsa non trovata');
    }
});

// Funzione di utilità per servire i file
function serveFile(filePath, contentType, res) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('File non trovato');
            return;
        }

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Errore interno del server');
                return;
            }

            res.writeHead(200, {'Content-Type': contentType});
            res.end(data);
        });
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
