window.onload = function() {
    fetch('172.29.1.x.json')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('data-table');
            const keys = Object.keys(data[0]);
            let headerRow = '<tr>';
            keys.forEach(key => {
                if(key!=='os'){
                headerRow += `<th>${key}</th>`;
                }
            });
            headerRow += '</tr>';
            table.innerHTML = headerRow;

            data.forEach(item => {
                let row = '<tr>';
                keys.forEach(key => {
                    // if the key is services it should create a sub table with headers port, protocol, service and state
                    if (key === 'services' && item[key].length > 0 ) {
                        row += '<td><table>';
                        row += '<tr><th>Port</th><th>Protocol</th><th>Service</th></tr>';
                        item[key].forEach(service => {
                            row += `<tr><td>${service.port}</td><td>${service.protocol}</td><td>${service.service}</td></tr>`;
                        });
                        row += '</table></td>';
                        return;
                    }
                    if(key === 'os'){

                    }else{
                        row += `<td>${item[key]}</td>`;
                    }
                    
                });
                row += '</tr>';
                table.innerHTML += row;
            });
        });
}

function filterTable() {
    const input = document.getElementById('search-input');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('data-table');
    const tr = Array.from(table.children);

    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td');
        let rowContainsFilter = Array.from(td).some(td => {
            let txtValue = td.textContent || td.innerText;
            return txtValue.toUpperCase().indexOf(filter) > -1;
        });

        if (rowContainsFilter) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}