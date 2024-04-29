
///// VIEW

document.addEventListener('DOMContentLoaded', function () {
    // Fetch dei dati dal server
    fetch('http://127.0.0.1:3030/api/UsedIpAddresses')
      .then(response => response.json())
      .then(data => {
        // Filtra i dati in base a "availability" uguale a "Yes"
        const dropdown = document.getElementById('ipDropdown');

        data.forEach(ip => {
          const link = document.createElement('a');
          link.href = '#';
          link.dataset.value = ip; // Imposta l'IP come data-value
          link.textContent = ip;
          dropdown.appendChild(link);
        });
      })
      .catch(error => console.error('Errore durante la richiesta:', error));
  });



///// WRITE


function deletePasswords() {
    // Recupera i valori dalle sezioni di testo
    
    // Ip Options
    //const ip = document.getElementById('section1').value;
    const ipDropdownBtn = document.getElementById('ipDropdownBtn');
    const selectedIpOption = document.querySelector('#ipDropdown a.selected');
    const ip = selectedIpOption ? selectedIpOption.getAttribute('data-value') : '';
    
    const availability = "Yes"
    

    // Team options
    const team = ""

    // Type options
    const type = ""
    
    // Environment options
    const environment = ""
    const hostname = ""
    const software = ""
    const osVersion = ""
    const owner = ""

    // Security options
    const security = ""
    const pswWeakness = ""
    const note = ""
  
   

    // Esegui una chiamata al backend per inserire le password nel database
    // Questa parte deve essere implementata lato server con Node.js e PostgreSQL

    // FETCH per chiamare l'API del backend (da implementare)
    fetch('http://127.0.0.1:3030/delIp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ip, availability, team, type, environment, hostname, software, osVersion, owner, security, pswWeakness, note
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dati inseriti:', data);
        // Qui potresti aggiornare la visualizzazione dei dati nella tua pagina
    })
    .catch(error => {
        console.error('Si è verificato un errore:', error);
    });
}

// IP'S
// Aggiungi un ascoltatore all'evento di clic sulle opzioni del dropdown
const ipDropdown = document.getElementById('ipDropdown');
ipDropdown.addEventListener('click', function(event) {
    const selectedOption = event.target;
    if (selectedOption.tagName === 'A') {
        // Rimuovi la classe 'selected' da tutte le opzioni
        const allOptions = document.querySelectorAll('#ipDropdown a');
        allOptions.forEach(option => option.classList.remove('selected'));

        // Aggiungi la classe 'selected' all'opzione selezionata
        selectedOption.classList.add('selected');
        
        // Aggiorna il testo del pulsante dropdown con l'opzione selezionata
        ipDropdownBtn.innerText = selectedOption.innerText;
    }
});