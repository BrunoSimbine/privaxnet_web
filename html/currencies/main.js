

    var insertBtn = document.getElementById('insertCurrencyButton');
    const token = localStorage.getItem('token');
    insertBtn.addEventListener('click', async function() {

        await insertCurrency();

    })

    // URL da API
    const url = 'https://api.privaxnet.com/v1/Currency/all';

    // Função para formatar o tempo da última atualização
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

    // Função para preencher a tabela
    async function populateTable() {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'text/plain' }
            });

            if (!response.ok) throw new Error(`Erro: ${response.status}`);

            const data = await response.json();
            const tableBody = document.getElementById('currency-table-body');

            // Limpar o conteúdo atual da tabela
            tableBody.innerHTML = '';

            // Preencher a tabela com os dados da API
            data.forEach(currency => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <th>${currency.label}</th>
            <td>${currency.rate}</td>
            <td class="d-none d-md-table-cell">${currency.symbol}</td>
            <td class="d-none d-md-table-cell">${currency.name}</td>
            <td>${timeAgo(currency.dateUpdated)}</td>
            <td>
              <div>
                <button type="button" class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-pen"> </i> <span class="hidden">${currency.id} </span>
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm">
                  <i class="bi bi-trash"></i> <span class="hidden">${currency.id} </span>
                </button>
              </div>
            </td>
          `;
                tableBody.appendChild(row);
            });

            const listDeleteBtn = document.querySelectorAll('.btn.btn-outline-danger.btn-sm');
            listDeleteBtn.forEach(item => {
                item.addEventListener('click', async function(event) {
                    event.preventDefault(); // Evita o comportamento padrão do link

                    // Obtem informações do item clicado
                    const id = item.querySelector('.hidden').textContent.trim();

                    var response = await fetch(`https://api.privaxnet.com/v1/Currency/delete/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    })

                    var data = await response.json();
                    window.location.reload();

                });
            })


            const listEditBtn = document.querySelectorAll('.btn.btn-outline-primary.btn-sm');
            listEditBtn.forEach(item => {
                item.addEventListener('click', async function(event) {
                    event.preventDefault(); // Evita o comportamento padrão do link
                    // Obtem informações do item clicado
                    const id = item.querySelector('.hidden').textContent.trim();
                    const rate = prompt("Inserir nova taxa");

                    if (rate) {
                        var body = {
                            currencyId: id,
                            rate: (rate * 1)
                        }

                        var response = await fetch(`https://api.privaxnet.com/v1/Currency/update/rate`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'text/plain',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(body)
                        })

                        var data = await response.json();
                        console.log(data);
                        window.location.reload();
                    }


                });
            })

        } catch (error) {
            console.error('Erro ao buscar dados:', error.message);
        }





        try {
            const response = await fetch('https://api.privaxnet.com/v1/Currency/get/deleted', {
                method: 'GET',
                headers: { 'Accept': 'text/plain' }
            });

            if (!response.ok) throw new Error(`Erro: ${response.status}`);

            const data = await response.json();
            const tableBody = document.getElementById('currency-deleted-table-body');

            // Limpar o conteúdo atual da tabela
            tableBody.innerHTML = '';

            // Preencher a tabela com os dados da API
            data.forEach(currency => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <th>${currency.label}</th>
            <td>${currency.rate}</td>
            <td class="d-none d-md-table-cell">${currency.symbol}</td>
            <td class="d-none d-md-table-cell">${currency.name}</td>
            <td>${timeAgo(currency.dateUpdated)}</td>
            <td>
              <div>
                <button type="button" class="a btn btn-outline-primary btn-sm">
                  <i class="bi bi-recycle"></i> <span class="hidden">${currency.id} </span>
                </button>

              </div>
            </td>
          `;
                tableBody.appendChild(row);
            });

            const listRestoreBtn = document.querySelectorAll('.a.btn.btn-outline-primary.btn-sm');
            listRestoreBtn.forEach(item => {
                item.addEventListener('click', async function(event) {
                    event.preventDefault(); // Evita o comportamento padrão do link
                    console.log("clicou")
                    // Obtem informações do item clicado
                    const id = item.querySelector('.hidden').textContent.trim();

     

                        var response = await fetch(`https://api.privaxnet.com/v1/Currency/restore/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'text/plain',
                                'Content-Type': 'application/json',
                            }
                        })

                        var data = await response.json();
                        console.log(data);
                        window.location.reload();
 


                });



            })

        const spinner = document.getElementById('spinner');
        const content = document.getElementById('main-content');
        spinner.classList.add('hidden');
        content.classList.remove('hidden');
        } catch (error) {
            console.error('Erro ao buscar dados:', error.message);
        }



    }


    async function insertCurrency() {
        try {

            // Obter os valores dos campos
            const label = document.getElementById('labelInput').value;
            const rate = document.getElementById('rateInput').value;
            const symbol = document.getElementById('symbolInput').value;
            const currency = document.getElementById('currencyInput').value;

            var argument = {
                label: label,
                labelId: label,
                rate: rate * 1,
                symbol: symbol,
                name: currency
            }

            document.getElementById('labelInput').value = '';
            document.getElementById('rateInput').value = '';
            document.getElementById('symbolInput').value = '';
            document.getElementById('currencyInput').value = '';

            const response = await fetch('https://api.privaxnet.com/v1/Currency/create', {
                method: 'POST',
                headers: { 'accept': 'text/plain', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(argument),
            })

            if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }

            // Obter o texto da resposta e convertê-lo em JSON
            const text = await response.text();
            window.location.reload();

        } catch (error) {
            console.log(error)
        }
    }

    // Chamar a função ao carregar a página
    populateTable();