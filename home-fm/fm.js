const express = require('express');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Database setup
const db = new sqlite3.Database(':memory:'); // Using an in-memory database for simplicity

function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fileName TEXT,
            filePath TEXT,
            size TEXT,
            type TEXT,
            tmdbInfo TEXT
        )`);
    });
}

initializeDatabase();

// Function to format file sizes
function formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

// Function to clean file names
function cleanFileName(fileName) {
    return fileName
        .replace(/[\._-]/g, ' ') // Replace special characters with spaces
        .replace(/\b(1080p|720p|480p|x264|x265|h264|h265|bluray|web-dl|hdrip|brrip|dvdrip|bdrip|dts|ac3|aac|sub|subs|ita|eng|fr|es|nl|multi|fd|by)\b/gi, '') // Remove keywords
        .replace(/\s{2,}/g, ' ') // Remove multiple spaces
        .trim(); // Remove leading and trailing spaces
}

// Function to extract the main title
function extractMainTitle(fileName) {
    const cleanedFileName = cleanFileName(fileName);
    const titleMatch = cleanedFileName.match(/^[^\d]+/); // Match up to the first digit
    return titleMatch ? titleMatch[0].trim() : cleanedFileName;
}

// Function to apply exceptions
function applyExceptions(title) {
    // Add more exceptions as needed
    const exceptions = {
        'Babylon': 'Babylon 5'
    };

    return exceptions[title] || title;
}

// Function to introduce a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry function with exponential backoff
async function retryWithBackoff(fn, retries = 5, delayMs = 1000) {
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === retries - 1) {
                throw error;
            }
            const delayTime = delayMs * Math.pow(2, attempt);
            console.log(`Retrying in ${delayTime}ms...`);
            await delay(delayTime);
            attempt++;
        }
    }
}

// Caching results
const cache = new Map();

function readFilesRecursively(directory, fileCallback) {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            readFilesRecursively(filePath, fileCallback);
        } else {
            fileCallback(filePath, stats);
        }
    });
}

// Database operations
function saveMediaInfo(media) {
    db.run(`INSERT INTO media (fileName, filePath, size, type, tmdbInfo) VALUES (?, ?, ?, ?, ?)`,
        [media.name, media.filePath, media.size, media.type, JSON.stringify(media.tmdbInfo)]);
}

function getMediaInfo(fileName, callback) {
    db.get(`SELECT * FROM media WHERE fileName = ?`, [fileName], (err, row) => {
        if (err) {
            console.error(err.message);
            return callback(null);
        }
        callback(row);
    });
}

async function searchMediaInfo(fileName) {
    const mainTitle = applyExceptions(extractMainTitle(fileName));

    return new Promise((resolve, reject) => {
        getMediaInfo(mainTitle, async (cachedMedia) => {
            if (cachedMedia) {
                return resolve(JSON.parse(cachedMedia.tmdbInfo));
            }

            const apiKey = 'da75def4578028e2b16862576d4d4858';
            const searchUrl = 'https://api.themoviedb.org/3/search/multi';

            const fetchData = async () => {
                console.log(`Requesting TMDB for: ${mainTitle}`);
                const response = await axios.get(searchUrl, {
                    params: {
                        api_key: apiKey,
                        query: mainTitle
                    }
                });
                console.log(`Response from TMDB for ${mainTitle}:`, response.data);
                return response.data.results;
            };

            try {
                const results = await retryWithBackoff(fetchData);
                if (results.length > 0) {
                    const mediaInfo = results[0];
                    saveMediaInfo({
                        name: mainTitle,
                        filePath: '', // Insert the correct filePath if available
                        size: '', // Insert the correct size if available
                        type: 'movie', // Insert the correct type if available
                        tmdbInfo: mediaInfo
                    });
                }
                resolve(results);
            } catch (error) {
                console.error('Errore durante la ricerca online:', error.message);
                reject(error);
            }
        });
    });
}

async function handleFile(filePath, stats, mediaData) {
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();

    if (stats.isFile()) {
        if (['.mp4', '.mkv', '.avi'].includes(fileExtension)) {
            const movieData = {
                name: fileName,
                size: formatFileSize(stats.size),
                filePath,
                type: 'movie'
            };
            mediaData.movies.push(movieData);

            const results = await searchMediaInfo(fileName);
            if (results.length > 0) {
                movieData.tmdbInfo = results[0];
            }

            await delay(1000); // Increased delay to 1000ms between requests
        } else if (['.jpg', '.png', '.gif'].includes(fileExtension)) {
            mediaData.photos.push({
                name: fileName,
                size: formatFileSize(stats.size),
                filePath,
                type: 'photo'
            });
        } else if (['.srt', '.sub'].includes(fileExtension)) {
            // Handle subtitle files if needed
        }
    }
}

app.post('/analyze', (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).send('Errore durante l\'analisi delle cartelle.');
        }

        const foldersInput = fields.folders;
        const folders = Array.isArray(foldersInput) ? foldersInput[0].split(',') : foldersInput.split(',');

        if (!folders || folders.length === 0) {
            return res.status(400).send('Il campo "folders" non è valido.');
        }

        const mediaData = {
            movies: [],
            tvShows: [],
            photos: []
        };

        for (const folder of folders) {
            const trimmedFolder = folder.trim();
            await readFilesRecursively(trimmedFolder, async (filePath, stats) => {
                await handleFile(filePath, stats, mediaData);
            });
        }

        res.status(200).json(mediaData);
    });
});

// Endpoint to fetch media info from the database
app.get('/media/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM media WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).send('Errore durante il recupero dei dati.');
        }
        res.status(200).json(row);
    });
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
