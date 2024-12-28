let dropArea = document.getElementById('drop-area');
let preview = document.getElementById('preview');

// Previeni comportamenti di default del browser
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Evidenzia l'area di drop
function highlight(e) {
    dropArea.classList.add('highlight');
    console.log('highlight called'); // Debug
}

// Rimuovi l'evidenziazione
function unhighlight(e) {
    dropArea.classList.remove('highlight');
    console.log('unhighlight called'); // Debug
}

// Gestisci l'evento di drop
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    console.log('handleDrop called'); // Debug
    let dt = e.dataTransfer;
    console.log('dataTransfer:', dt); // Debug
    let files = dt.files;
    console.log('files:', files); // Debug

    handleFiles(files);
}

function handleFiles(files) {
    console.log('handleFiles called', files); // Debug
    files = [...files];
    files.forEach(uploadFile);
}

function uploadFile(file) {
    console.log('uploadFile called', file); // Debug

    let formData = new FormData();
    formData.append('files', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("Upload successful:", data);
            data.files.forEach(fileData => {
                previewFileFromServer(fileData);
            });
        })
        .catch(error => {
            console.error("Errore durante l'upload:", error);
        });
}

function previewFileFromServer(fileData) {
    let thumb = document.createElement('div');
    thumb.classList.add('thumb', 'w-48', 'h-48', 'm-2', 'bg-gray-800', 'relative', 'overflow-hidden', 'rounded-lg');

    const fileUrl = `uploads/${fileData.filename}`;

    // Visualizza anteprima in base al tipo di file
    if (fileData.mimetype.startsWith('image/')) {
        let img = document.createElement('img');
        img.src = fileUrl;
        img.classList.add('w-full', 'h-full', 'object-contain');
        thumb.appendChild(img);
    } else if (fileData.mimetype === 'application/pdf') {
        let iframe = document.createElement('iframe');
        iframe.src = fileUrl;
        iframe.classList.add('w-full', 'h-full', 'object-contain');
        thumb.appendChild(iframe);
    } else {
        let icon = document.createElement('div');
        icon.classList.add('icon', 'text-4xl', 'absolute', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2', 'text-gray-500');
        icon.textContent = getIconForFileType(fileData.mimetype);
        thumb.appendChild(icon);
    }

    // Aggiungi nome file
    let filenameDiv = document.createElement('div');
    filenameDiv.classList.add('filename', 'absolute', 'bottom-0', 'left-0', 'w-full', 'px-2', 'py-1', 'bg-black', 'bg-opacity-60', 'text-white', 'text-xs', 'text-center', 'whitespace-nowrap', 'overflow-hidden', 'text-ellipsis');
    filenameDiv.textContent = fileData.originalname;
    thumb.appendChild(filenameDiv);

    // Aggiungi link per il download
    let downloadLink = document.createElement('a');
    downloadLink.classList.add('download-link', 'absolute', 'text-white', 'px-2', 'py-1', 'rounded-md', 'text-xs', 'no-underline', 'top-2', 'right-2', 'bg-green-500', 'bg-opacity-70');
    downloadLink.href = fileUrl;
    downloadLink.download = fileData.originalname;
    downloadLink.textContent = 'Download';
    thumb.appendChild(downloadLink);

    // Aggiungi link per aprire il file (se possibile)
    if (fileData.mimetype.startsWith('image/') || fileData.mimetype === 'application/pdf') {
        let openLink = document.createElement('a');
        openLink.classList.add('open-link', 'absolute', 'text-white', 'px-2', 'py-1', 'rounded-md', 'text-xs', 'no-underline', 'top-10', 'right-2', 'bg-blue-500', 'bg-opacity-70');
        openLink.href = fileUrl;
        openLink.target = '_blank';
        openLink.textContent = 'Apri';
        thumb.appendChild(openLink);
    }

    // Aggiungi un pulsante "Elimina"
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button', 'absolute', 'text-white', 'px-2', 'py-1', 'rounded-md', 'text-xs', 'top-20', 'right-2', 'bg-red-500', 'bg-opacity-70');
    deleteButton.textContent = 'Elimina';
    thumb.appendChild(deleteButton);

    // Gestisci il click sul pulsante "Elimina"
    deleteButton.addEventListener('click', () => {
        deleteFile(fileData.filename); // Chiamiamo la funzione per eliminare il file
        thumb.remove(); // Rimuoviamo la miniatura dalla pagina
    });

    preview.appendChild(thumb);
}

function getIconForFileType(fileType) {
    if (fileType.startsWith('text/')) {
        return '📄';
    } else if (fileType === 'application/zip' || fileType === 'application/x-rar-compressed') {
        return '🗜️';
    } else if (fileType.startsWith('audio/')) {
        return '🎵';
    } else if (fileType.startsWith('video/')) {
        return '🎥';
    } else {
        return '📁';
    }
}

// Carica le anteprime dei file esistenti all'avvio
function loadExistingFiles() {
    fetch('/files')
        .then(response => response.json())
        .then(files => {
            files.forEach(previewFileFromServer);
        })
        .catch(error => {
            console.error("Errore durante il caricamento dei file:", error);
        });
}

// Chiamala all'avvio della pagina
loadExistingFiles();

// Funzione per inviare la richiesta di eliminazione al backend
function deleteFile(filename) {
    fetch(`/delete/${filename}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore durante l\'eliminazione del file');
        }
        console.log('File eliminato con successo:', filename);
    })
    .catch(error => {
        console.error(error);
    });
}