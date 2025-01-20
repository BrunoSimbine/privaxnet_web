    // URL da API
    const apiUrl = 'https://api.privaxnet.com/v1/Product/all';
    const token = localStorage.getItem('token');
    const spinner = document.getElementById('spinner');
    const content = document.getElementById('main-content');

    var insertBtn = document.getElementById('insertProductButton');
    insertBtn.addEventListener('click', async function() {

        // Obter os valores dos campos
        const name = document.getElementById('nameInput').value;
        const price = document.getElementById('priceInput').value;
        const durationDays = document.getElementById('durationInput').value;

        var argument = {
            name: name,
            price: price * 1,
            durationDays: durationDays * 1,
        }

        document.getElementById('nameInput').value = '';
        document.getElementById('priceInput').value = '';
        document.getElementById('durationInput').value = '';

        const response = await fetch('https://api.privaxnet.com/v1/Product/create', {
            method: 'POST',
            headers: { 'accept': 'text/plain', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(argument),
        })

        window.location.reload();

    })

    // Função para buscar e preencher a tabela
    async function fetchAndFillTable() {
        try {
            // Faz a requisição GET
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }

            // Converte a resposta para JSON
            const products = await response.json();

            // Seleciona o corpo da tabela
            const tbody = document.getElementById('products-body');

            // Limpa o corpo da tabela
            tbody.innerHTML = '';

            // Adiciona os produtos à tabela
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.durationDays} days</td>
            <td class="d-none d-md-table-cell">${timeAgo(product.dateCreated)} ago</td>
            <td class="d-none d-md-table-cell">${timeAgo(product.dateUpdated)} ago</td>
            <td class="d-none d-md-table-cell">${product.isAvaliable ? 'Yes' : 'No'}</td>
            <td>
              <div>
                <button type="button" class="a btn btn-outline-success btn-sm">
                  <i class="bi bi-currency-dollar"></i> <span class="hidden"> ${product.id} </span>
                </button>
                <button type="button" class="b btn btn-outline-success btn-sm">
                  <i class="bi bi-clock"></i> <span class="hidden"> ${product.id} </span>
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm">
                  <i class="bi bi-trash"></i> <span class="hidden"> ${product.id} </span>
                </button>
              </div>
            </td>
          `;
                tbody.appendChild(row);
            });

            const editPriceBtn = document.querySelectorAll('.a.btn.btn-outline-success.btn-sm');
            editPriceBtn.forEach(item => {
                item.addEventListener('click', async function(event) {
                    event.preventDefault(); // Evita o comportamento padrão do link

                    // Obtem informações do item clicado
                    const id = item.querySelector('.hidden').textContent.trim();
                    const price = prompt("Insert new price")
                    var intPrice = price * 1;

                    var body = {
                        productId: id,
                        price: intPrice
                    }

                    var updatePrice = await fetch('https://api.privaxnet.com/v1/Product/update/price', {
                        method: 'PUT',
                        headers: {
                            'Accept': 'text/plain',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(body)
                    })

                    if (!updatePrice.ok) {
                        throw new Error(`Erro: ${updatePrice.status}`)
                    }

                    var priceUpdated = await updatePrice.json();
                    console.log(priceUpdated);
                    window.location.reload()


                });
            })



            const editDurationBtn = document.querySelectorAll('.b.btn.btn-outline-success.btn-sm');
            editDurationBtn.forEach(item => {
                item.addEventListener('click', async function(event) {
                    event.preventDefault(); // Evita o comportamento padrão do link

                    // Obtem informações do item clicado
                    const id = item.querySelector('.hidden').textContent.trim();
                    const duration = prompt("Insert new duration")
                    var intDuration = duration * 1;

                    var body = {
                        productId: id,
                        duration: intDuration
                    }

                    var updatePrice = await fetch('https://api.privaxnet.com/v1/Product/update/duration', {
                        method: 'PUT',
                        headers: {
                            'Accept': 'text/plain',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(body)
                    })

                    if (!updatePrice.ok) {
                        throw new Error(`Erro: ${updatePrice.status}`)
                    }

                    var priceUpdated = await updatePrice.json();
                    console.log(priceUpdated);
                    window.location.reload()

                });
            })

            const deleteBtn = document.querySelectorAll('.btn.btn-outline-danger.btn-sm');
            deleteBtn.forEach(item => {
                item.addEventListener('click', async function(event) {
                    event.preventDefault(); // Evita o comportamento padrão do link

                    // Obtem informações do item clicado
                    const id = item.querySelector('.hidden').textContent.trim();
                    var response = await fetch(`https://api.privaxnet.com/v1/Product/delete/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'text/plain',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    window.location.reload();

                });
            })





            var deletedProducts = await fetch('https://api.privaxnet.com/v1/Product/get/deleted', {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!deletedProducts.ok) {
                throw new Error(`Erro: ${deletedProducts.status}`)
            }

            var productsDeleted = await deletedProducts.json();
            console.log(productsDeleted)

            const productsDeletedtable = document.getElementById('products-deleted-body');

            // Limpa o corpo da tabela
            productsDeletedtable.innerHTML = '';

            // Adiciona os produtos à tabela
            productsDeleted.forEach(product => {

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.durationDays} days</td>
                    <td class="d-none d-md-table-cell">${timeAgo(product.dateCreated)} ago</td>
                    <td class="d-none d-md-table-cell">${timeAgo(product.dateUpdated)} ago</td>
                    <td class="d-none d-md-table-cell">${product.isAvaliable ? 'Yes' : 'No'}</td>
                    <td>
                      <div>
                        <button type="button" class="c btn btn-outline-primary btn-sm">
                          <i class="bi bi-recycle"></i> <span class="hidden"> ${product.id} </span>
                        </button>
                      </div>
                    </td>
                  `;
                productsDeletedtable.appendChild(row);
            });


            const recoverBtn = document.querySelectorAll('.c.btn.btn-outline-primary.btn-sm');
            recoverBtn.forEach(item => {
                item.addEventListener('click', async function(event) {
                    event.preventDefault(); // Evita o comportamento padrão do link

                    // Obtem informações do item clicado
                    const id = item.querySelector('.hidden').textContent.trim();
                    var deletedProducts = await fetch(`https://api.privaxnet.com/v1/Product/update/recover/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'text/plain',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    window.location.reload();

                });
            })

            spinner.classList.add('hidden');
            content.classList.remove('hidden');

        } catch (error) {
            console.error('Erro ao consumir a API:', error.message);
        }
    }

    // Chama a função para buscar e preencher a tabela
    fetchAndFillTable();

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