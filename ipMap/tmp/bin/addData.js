
function addNewPasswords() {
    // Recupera i valori dalle sezioni di testo
    
    // Ip Options
    //const ip = document.getElementById('section1').value;
    const ipDropdownBtn = document.getElementById('ipDropdownBtn');
    const selectedIpOption = document.querySelector('#ipDropdown a.selected');
    const ip = selectedIpOption ? selectedIpOption.getAttribute('data-value') : '';
    
    //const subnet = document.getElementById('section2').value;
    //const gateway = document.getElementById('section3').value;
    //const availability = document.getElementById('section4').value;
    const availability = "No"
    // Recupera il valore selezionato dal dropdown
    // Availability options
    //const availabilityDropdownBtn = document.getElementById('availabilityDropdownBtn');
    //const selectedAvailabilityOption = document.querySelector('#availabilityDropdown a.selected');
    //const availability = selectedAvailabilityOption ? selectedAvailabilityOption.getAttribute('data-value') : '';

    // Team options
    // const team = document.getElementById('section5').value;
    const teamDropdownBtn = document.getElementById('teamDropdownBtn');
    const selectedTeamOption = document.querySelector('#teamDropdown a.selected');
    const team = selectedTeamOption ? selectedTeamOption.getAttribute('data-value') : '';

    // Type options
    //const type = document.getElementById('section6').value;
    const typeDropdownBtn = document.getElementById('typeDropdownBtn');
    const selectedTypeOption = document.querySelector('#typeDropdown a.selected');
    const type = selectedTypeOption ? selectedTypeOption.getAttribute('data-value') : '';

    // Environment options
    //const environment = document.getElementById('section7').value;
    const envDropdownBtn = document.getElementById('envDropdownBtn');
    const selectedEnvOption = document.querySelector('#envDropdown a.selected');
    const environment = selectedEnvOption ? selectedEnvOption.getAttribute('data-value') : '';

    const hostname = document.getElementById('section8').value;
    const software = document.getElementById('section9').value;
    const osVersion = document.getElementById('section10').value;
    const owner = document.getElementById('section11').value;

    // Security options
    //const security = document.getElementById('section12').value;
    const secDropdownBtn = document.getElementById('secDropdownBtn');
    const selectedSecOption = document.querySelector('#secDropdown a.selected');
    const security = selectedSecOption ? selectedSecOption.getAttribute('data-value') : '';

    const pswWeakness = "No"
    const note = document.getElementById('section14').value;
  
   

    // Esegui una chiamata al backend per inserire le password nel database
    // Questa parte deve essere implementata lato server con Node.js e PostgreSQL

    // FETCH per chiamare l'API del backend (da implementare)
    fetch('http://127.0.0.1:3030/addIP', {
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


// AVAILABILITY
// Aggiungi un ascoltatore all'evento di clic sulle opzioni del dropdown
//const availabilityDropdown = document.getElementById('availabilityDropdown');
//availabilityDropdown.addEventListener('click', function(event) {
//    const selectedOption = event.target;
//    if (selectedOption.tagName === 'A') {
//        // Rimuovi la classe 'selected' da tutte le opzioni
//        const allOptions = document.querySelectorAll('#availabilityDropdown a');
//        allOptions.forEach(option => option.classList.remove('selected'));
//
        // Aggiungi la classe 'selected' all'opzione selezionata
//        selectedOption.classList.add('selected');
        
        // Aggiorna il testo del pulsante dropdown con l'opzione selezionata
//        availabilityDropdownBtn.innerText = selectedOption.innerText;
//    }
//});

// TEAM
// Aggiungi un ascoltatore all'evento di clic sulle opzioni del dropdown
const teamDropdown = document.getElementById('teamDropdown');
teamDropdown.addEventListener('click', function(event) {
    const selectedOption = event.target;
    if (selectedOption.tagName === 'A') {
        // Rimuovi la classe 'selected' da tutte le opzioni
        const allOptions = document.querySelectorAll('#teamDropdown a');
        allOptions.forEach(option => option.classList.remove('selected'));

        // Aggiungi la classe 'selected' all'opzione selezionata
        selectedOption.classList.add('selected');
        
        // Aggiorna il testo del pulsante dropdown con l'opzione selezionata
        teamDropdownBtn.innerText = selectedOption.innerText;
    }
});

// TYPE
// Aggiungi un ascoltatore all'evento di clic sulle opzioni del dropdown
const typeDropdown = document.getElementById('typeDropdown');
typeDropdown.addEventListener('click', function(event) {
    const selectedOption = event.target;
    if (selectedOption.tagName === 'A') {
        // Rimuovi la classe 'selected' da tutte le opzioni
        const allOptions = document.querySelectorAll('#typeDropdown a');
        allOptions.forEach(option => option.classList.remove('selected'));

        // Aggiungi la classe 'selected' all'opzione selezionata
        selectedOption.classList.add('selected');
        
        // Aggiorna il testo del pulsante dropdown con l'opzione selezionata
        typeDropdownBtn.innerText = selectedOption.innerText;
    }
});

// ENVIRONMENT
// Aggiungi un ascoltatore all'evento di clic sulle opzioni del dropdown
const envDropdown = document.getElementById('envDropdown');
envDropdown.addEventListener('click', function(event) {
    const selectedOption = event.target;
    if (selectedOption.tagName === 'A') {
        // Rimuovi la classe 'selected' da tutte le opzioni
        const allOptions = document.querySelectorAll('#envDropdown a');
        allOptions.forEach(option => option.classList.remove('selected'));

        // Aggiungi la classe 'selected' all'opzione selezionata
        selectedOption.classList.add('selected');
        
        // Aggiorna il testo del pulsante dropdown con l'opzione selezionata
        envDropdownBtn.innerText = selectedOption.innerText;
    }
});

// SECURITY
// Aggiungi un ascoltatore all'evento di clic sulle opzioni del dropdown
const secDropdown = document.getElementById('secDropdown');
secDropdown.addEventListener('click', function(event) {
    const selectedOption = event.target;
    if (selectedOption.tagName === 'A') {
        // Rimuovi la classe 'selected' da tutte le opzioni
        const allOptions = document.querySelectorAll('#secDropdown a');
        allOptions.forEach(option => option.classList.remove('selected'));

        // Aggiungi la classe 'selected' all'opzione selezionata
        selectedOption.classList.add('selected');
        
        // Aggiorna il testo del pulsante dropdown con l'opzione selezionata
        secDropdownBtn.innerText = selectedOption.innerText;
    }
});


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