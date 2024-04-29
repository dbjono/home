
// view Data
function fetchDataFromDatabase() {
    fetch('http://127.0.0.1:3030/ipadresses')
        .then(response => response.json())
        .then(data => {
            displayData(data);
        })
        .catch(error => {
            console.error('Si è verificato un errore:', error);
        });
}

function displayData(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Filtra per tag...';
    searchInput.addEventListener('input', function() {
        const filteredData = data.filter(item => item.tag.toLowerCase().includes(this.value.toLowerCase()));
        displayFilteredData(filteredData);
    });

    resultDiv.appendChild(searchInput);
    
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Creazione delle intestazioni della tabella basate sulle chiavi dell'oggetto
    for (let key in data[0]) {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Aggiunta dei dati alla tabella
    data.forEach(item => {
        const row = document.createElement('tr');
        for (let key in item) {
            const cell = document.createElement('td');
            cell.textContent = item[key];

            if (key === 'tag,name') {
                cell.classList.add('tag-cell');
            }

            row.appendChild(cell);
        }
        table.appendChild(row);
    });

    resultDiv.appendChild(table);
}

function displayFilteredData(filteredData) {


    const resultDiv = document.getElementById('result');
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Creazione delle intestazioni della tabella basate sulle chiavi dell'oggetto filtrato
    for (let key in filteredData[0]) {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Aggiunta dei dati filtrati alla tabella
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        for (let key in item) {
            const cell = document.createElement('td');
            cell.textContent = item[key];

            if (key === 'ip') {
                cell.classList.add('tag-cell');
            }

            row.appendChild(cell);
        }
        table.appendChild(row);
    });

    resultDiv.querySelector('table').replaceWith(table);
}

// view data