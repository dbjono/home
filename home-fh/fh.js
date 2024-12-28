const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Configura Multer
const storage = multer.diskStorage({
    destination: './uploads/', // Crea una cartella "uploads"
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Nome del file JSON che useremo come database
const DB_FILE = 'db.json';

// Funzione per leggere i dati dal file JSON
function readDb() {
    try {
        const data = fs.readFileSync(DB_FILE);
        return JSON.parse(data);
    } catch (err) {
        // Se il file non esiste o c'è un errore, restituisci un array vuoto
        return [];
    }
}

// Funzione per salvare i dati nel file JSON
function writeDb(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Inizializza il database (array vuoto) se il file non esiste
if (!fs.existsSync(DB_FILE)) {
    writeDb([]);
}

// Servi i file statici dalla cartella corrente
app.use(express.static(__dirname));

// Gestisci l'upload del file e salva i metadati nel database
app.post('/upload', upload.array('files'), (req, res) => {
    const filesData = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
    }));

    const db = readDb();
    db.push(...filesData);
    writeDb(db);

    console.log("Files uploaded and metadata saved:", filesData);
    res.json({ message: 'File caricati con successo!', files: filesData });
});

// Restituisci i dati dei file caricati quando richiesto dal frontend
app.get('/files', (req, res) => {
    const db = readDb();
    res.json(db);
});

// Gestisci l'eliminazione del file
app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename); // Percorso completo del file

    // 1. Elimina il file dal file system
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Errore durante l'eliminazione del file dal filesystem:", err);
            return res.status(500).send('Errore durante l\'eliminazione del file');
        }

        // 2. Rimuovi i metadati del file dal database (db.json)
        const db = readDb();
        const updatedDb = db.filter(file => file.filename !== filename);
        writeDb(updatedDb);

        console.log('File eliminato:', filename);
        res.send('File eliminato con successo');
    });
});

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});