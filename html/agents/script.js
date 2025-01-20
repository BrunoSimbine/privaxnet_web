// URL do endpoint
const url = 'https://api.privaxnet.com/v1/PayAgent/get/active';
const token = localStorage.getItem('token');
const select = document.getElementById('methodSelect');
const button = document.getElementById('insertAgentButton');

const spinner = document.getElementById('spinner');
const content = document.getElementById('main-content');


// Cabeçalhos da requisição
var headers = {
    'Accept': 'text/plain',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
}

function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);

    const gmtPlus2Offset = 2 * 60; // Deslocamento em minutos para GMT+2
    date.setMinutes(date.getMinutes() + gmtPlus2Offset);

    const diff = Math.abs(now - date) / 1000;

    if (diff < 60) return `${Math.floor(diff)} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

// Função para buscar e preencher a tabela
async function fetchAndFillTable() {
    try {

        const getSelectOptions = await fetch('https://api.privaxnet.com/v1/Currency/all', { method: 'GET', headers });
        if (!getSelectOptions.ok) {
            throw new Error(`Erro: ${getSelectOptions.status} - ${getSelectOptions.statusText}`);
        }

        var selectOptions = await getSelectOptions.json();
        selectOptions.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.id;
            option.textContent = optionData.label;
            select.appendChild(option);
        });

        button.addEventListener('click', async () => {
            const id = Array.from(select.selectedOptions).map(option => option.value);

            const name = document.getElementById('nameInput').value;
            const account = document.getElementById('accountInput').value;

            var body = {
                currencyId: id[0],
                fullname: name,
                account: account
            }

            const getCreateAgent = await fetch('https://api.privaxnet.com/v1/PayAgent/create', {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!getCreateAgent.ok) {
                throw new Error(`Erro: ${getCreateAgent.status} - ${getCreateAgent.statusText}`);
            }

            
            document.getElementById('nameInput').value = '';
            document.getElementById('accountInput').value = '';
            window.location.reload();
        });



        const response = await fetch(url, { method: 'GET', headers });

        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        // Obter o texto da resposta e convertê-lo em JSON
        const text = await response.text();
        const data = JSON.parse(text);

        // Referência ao corpo da tabela
        const tableBody = document.getElementById('payAgentsTable');

        // Limpar qualquer conteúdo existente na tabela
        tableBody.innerHTML = '';

        // Preencher a tabela com os dados
        data.forEach((agent, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <th scope="row" class="d-none d-md-table-cell">${index + 1}</th>
        <td>${agent.fullname}</td>
        <td>${agent.account}</td>
        <td>${agent.method}</td>
        <td class="d-none d-md-table-cell">${timeAgo(agent.dateCreated)}</td>
        <td class="d-none d-md-table-cell">${timeAgo(agent.dateUpdated)}</td>
        <td>
          <div>
            <button type="button" class="a btn btn-outline-success btn-sm d-none d-md-table-cell">
              <i class="bi bi-person"></i> <span class="hidden"> ${agent.id} </span>
            </button>
            <button type="button" class="b btn btn-outline-success btn-sm d-none d-md-table-cell">
              <i class="bi bi-wallet"></i> <span class="hidden"> ${agent.id} </span>
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm">
              <i class="bi bi-trash"></i> <span class="hidden"> ${agent.id} </span>
            </button>
          </div>
        </td>

      `;
            tableBody.appendChild(row);
        });



        const responseDeleted = await fetch('https://api.privaxnet.com/v1/PayAgent/get/deleted', { method: 'GET', headers });

        // Verificar se a resposta foi bem-sucedida
        if (!responseDeleted.ok) {
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        // Obter o texto da resposta e convertê-lo em JSON
        const dataDeleted = await responseDeleted.json();

        // Referência ao corpo da tabela
        const tableDeleted = document.getElementById('payAgentsDeletedTable');

        // Limpar qualquer conteúdo existente na tabela
        tableDeleted.innerHTML = '';

        // Preencher a tabela com os dados
        dataDeleted.forEach((agent, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <th scope="row" class="d-none d-md-table-cell">${index + 1}</th>
        <td>${agent.fullname}</td>
        <td>${agent.account}</td>
        <td>${agent.method}</td>
        <td class="d-none d-md-table-cell">${timeAgo(agent.dateCreated)}</td>
        <td class="d-none d-md-table-cell">${timeAgo(agent.dateUpdated)}</td>
        <td>
          <div>
            <button type="button" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-recycle"></i> <span class="hidden"> ${agent.id} </span>
            </button>
          </div>
        </td>

      `;
            tableDeleted.appendChild(row);
        });



        spinner.classList.add('hidden');
        content.classList.remove('hidden');


        const editNameBtn = document.querySelectorAll('.a.btn.btn-outline-success.btn-sm');
        editNameBtn.forEach(item => {
            item.addEventListener('click', async function(event) {
                event.preventDefault(); // Evita o comportamento padrão do link

                // Obtem informações do item clicado
                const id = item.querySelector('.hidden').textContent.trim();
                const name = prompt("Insert new Name")

                var body = {
                    agentId: id,
                    name: name
                }

                var updateName = await fetch('https://api.privaxnet.com/v1/PayAgent/update/name', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'text/plain',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                })

                if (!updateName.ok) {
                    throw new Error(`Erro: ${updateName.status}`)
                }

                var nameUpdated = await updateName.json();
                window.location.reload()
            });
        })





        const recoverBtn = document.querySelectorAll('.btn.btn-outline-primary.btn-sm');
        recoverBtn.forEach(item => {
            item.addEventListener('click', async function(event) {
                event.preventDefault(); // Evita o comportamento padrão do link

                // Obtem informações do item clicado
                const id = item.querySelector('.hidden').textContent.trim();



                var recover = await fetch(`https://api.privaxnet.com/v1/PayAgent/recover/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'text/plain',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!recover.ok) {
                    throw new Error(`Erro: ${recover.status}`)
                }

                window.location.reload()
            });
        })






        const editAccountBtn = document.querySelectorAll('.b.btn.btn-outline-success.btn-sm');
        editAccountBtn.forEach(item => {
            item.addEventListener('click', async function(event) {
                event.preventDefault(); // Evita o comportamento padrão do link

                // Obtem informações do item clicado
                const id = item.querySelector('.hidden').textContent.trim();
                const account = prompt("Insert new Account")

                var body = {
                    agentId: id,
                    account: account
                }

                var updateAccount = await fetch('https://api.privaxnet.com/v1/PayAgent/update/account', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'text/plain',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                })

                if (!updateAccount.ok) {
                    throw new Error(`Erro: ${updateAccount.status}`)
                }

                var accountUpdated = await updateAccount.json();
                window.location.reload()
            });
        })




        const deleteBtn = document.querySelectorAll('.btn.btn-outline-danger.btn-sm');
        deleteBtn.forEach(item => {
            item.addEventListener('click', async function(event) {
                event.preventDefault(); // Evita o comportamento padrão do link

                // Obtem informações do item clicado
                const id = item.querySelector('.hidden').textContent.trim();


                var deleteAgent = await fetch(`https://api.privaxnet.com/v1/PayAgent/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'text/plain',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!deleteAgent.ok) {
                    throw new Error(`Erro: ${deleteAgent.status}`)
                }

                var agentDeleted = await deleteAgent.json();
                window.location.reload()
            });
        })
    } catch (error) {
        console.error('Erro ao carregar PayAgents:', error);
    }
}

// Chamar a função ao carregar a página
fetchAndFillTable();