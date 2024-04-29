document.addEventListener('DOMContentLoaded', function () {
    // Fetch dei dati dal server
    fetch('http://127.0.0.1:3030/api/ipaddresses')
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

 