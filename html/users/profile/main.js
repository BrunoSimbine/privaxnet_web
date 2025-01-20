// Obtém a URL atual
const currentUrl = window.location.href;

// Cria uma instância do objeto URL
const url = new URL(currentUrl);

// Obtém os parâmetros da query string
const params = url.searchParams;

const spinner = document.getElementById('spinner');
const content = document.getElementById('main-content');

// Acessa valores específicos
const userId = params.get('id');
const token = localStorage.getItem('token');




if (token && userId) {
    const apiUrl = `https://api.privaxnet.com/v1/User/get/${userId}`;

    fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#user-table tbody');

            Object.entries(data).forEach(([key, value]) => {
                const row = document.createElement('tr');
                const keyCell = document.createElement('td');
                const valueCell = document.createElement('td');

                // Converter o nome do atributo para Pascal Case
                keyCell.textContent = toPascalCase(key);

                // Formatar valores específicos
                if (key === 'balance') {
                    valueCell.textContent = `$${value}`;
                } else if (value && key === 'expirationDate') {
                    keyCell.textContent = 'Time Left'
                    var daysDifference = timeAgo(value);
                    if (daysDifference < 0) {
                        valueCell.textContent = 'Expired';
                    } else {
                        valueCell.textContent = `${daysDifference}`;
                    }
                } else if (key === 'dateCreated') {
                    keyCell.textContent = 'Created'
                    var daysDifference = timeAgo(value);
                    valueCell.textContent = `${daysDifference} ago`;

                } else if (value && key === 'dateUpdated') {
                    keyCell.textContent = 'Last Update'
                    var daysDifference = timeAgo(value);
                    valueCell.textContent = `${daysDifference} ago`;

                } else if (value && key === 'lastActivity') {
                    keyCell.textContent = 'Last Activity'
                    var daysDifference = timeAgo(value);
                    valueCell.textContent = `${daysDifference} ago`;

                } else {
                    valueCell.textContent = value === null ? 'null' : value;
                }

                row.appendChild(keyCell);
                row.appendChild(valueCell);
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });


    fetch(`https://api.privaxnet.com/v1/Payment/get/by/user/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,
        },
    }).then(reponse => {
        return reponse.json();
    }).then(data => {

        spinner.classList.add('hidden');
        content.classList.remove('hidden');

        const payments = data;

        const listGroup = document.querySelector('.list-group');
        listGroup.innerHTML = ''; // Limpa o conteúdo existente

        payments.forEach(payment => {
            const paymentItem = document.createElement('a');
            paymentItem.href = '#';
            paymentItem.className = 'list-group-item list-group-item-action';
            paymentItem.setAttribute('aria-current', 'true');

            paymentItem.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <span class="inline"><h5 class="mb-1">${payment.agentName} </h5> <span class="badge text-bg-secondary">${payment.paymentMethod}</span>
        </span>
        <small>${timeAgo(payment.dateUpdated)} ago</small>
      </div>

      <div class="d-flex w-100 justify-content-between">
        <span class="mb-1"><strong>${payment.userName}</strong></span>
        <span class="mb-1">${payment.userAccount}</span>
      </div>

      <p class="mb-1">${payment.amount} ${payment.currencySymbol}</p>
      <small>
        <span class="badge status text-bg-${payment.isAproved ? 'success' : 'warning'}">
          ${payment.isAproved ? 'Approved' : 'Pending'}
        </span>
        <span class="hidden paymentId">
          ${payment.id}
        </span>
      </small>
    `;

            listGroup.appendChild(paymentItem);


            // Seleciona todos os itens da lista que possuem a classe 'list-group-item'
            const listItems = document.querySelectorAll('.list-group-item');

            // Adiciona um evento de clique a cada item
            listItems.forEach(item => {
                item.addEventListener('click', event => {
                    event.preventDefault(); // Evita o comportamento padrão do link

                    // Obtem informações do item clicado
                    const name = item.querySelector('h5').textContent.trim();
                    const amount = item.querySelector('p').textContent.trim();
                    const status = item.querySelector('.badge.status').textContent.trim();
                    const paymentId = item.querySelector('.hidden.paymentId').textContent.trim();

                    // Faz algo com as informações, como exibir no console
                    console.log(`Status: ${status}`);
                    console.log(`Nome: ${name}`);
                    console.log(`Quantia: ${amount}`);
                    if(status == 'Pending')
                    {
                        approvePayment(paymentId);
                    }else{
                        console.log("Ja foi aprovado!")
                    }
                });
            });



        });
    });

} else {

}


// Converte uma string para Pascal Case
function toPascalCase(str) {
    return str.replace(/(^|_|\b)([a-z])/g, (_, __, letter) => letter.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, '');
}

// Calcula a diferença em dias entre duas datas
function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);

    const gmtPlus2Offset = 2 * 60; // Deslocamento em minutos para GMT+2
    date.setMinutes(date.getMinutes() + gmtPlus2Offset);

    const diff = Math.abs(now - date) / 1000;

    if (diff < 60) return `${Math.floor(diff)} seconds `;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes `;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours `;
    return `${Math.floor(diff / 86400)} days `;
}

function approvePayment(paymentId) {
    const url = `https://api.privaxnet.com/v1/Payment/aprove/${paymentId}`;

    fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'text/plain',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            window.location.reload();
            console.log('Resposta do servidor:', data);
        })
        .catch(error => {
            console.error('Erro na solicitação:', error);
        });
}