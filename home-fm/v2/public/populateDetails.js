const fs = require('fs');

// Funzione per leggere i dati dal file system e popolare i dettagli nella pagina HTML
function populateDetails() {
    fs.readFile('media_details.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Errore durante la lettura del file:', err);
            return;
        }

        const mediaDetails = JSON.parse(data);
        const container = document.getElementById('mediaDetailsContainer');

        mediaDetails.forEach(media => {
            const mediaItem = document.createElement('div');
            mediaItem.classList.add('media-item');

            // Aggiunge l'immagine (se disponibile)
            if (media.poster_path) {
                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/original${media.poster_path}`;
                img.alt = media.title || media.name;
                mediaItem.appendChild(img);
            }

            // Aggiunge il titolo
            const title = document.createElement('h3');
            title.textContent = media.title || media.name;
            mediaItem.appendChild(title);

            // Aggiunge l'overview
            if (media.overview) {
                const overview = document.createElement('p');
                overview.textContent = media.overview;
                mediaItem.appendChild(overview);
            }

            container.appendChild(mediaItem);
        });
    });
}

populateDetails();
