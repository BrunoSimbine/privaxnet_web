const token = localStorage.getItem('token');

document.addEventListener("DOMContentLoaded", async function() {
    const spinner = document.getElementById('spinner');
    const content = document.getElementById('main-content');

    if (token) {
        var getActiveUsers = await fetch('https://api.privaxnet.com/v1/User/get/active', {
            method: 'GET',
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });

        var getAllUsers = await fetch('https://api.privaxnet.com/v1/User/all', {
            method: 'GET',
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!getActiveUsers.ok) {
            throw new Error(`Impossivel obter usuarios activos! Erro: ${getActiveUsers.status}`)
        }

        if (!getAllUsers.ok) {
            throw new Error(`Impossivel obter todos usuarios! Erro: ${getAllUsers.status}`)
        }


        var activeUsers = await getActiveUsers.json();
        var activeUsersTable = document.getElementById('user-active-table');
        activeUsersTable.innerHTML = '';
        activeUsers.forEach(user => {

            var expirationDate = new Date(user.expirationDate);
            var now = new Date();
            var timeLeft = !user.isExpired ?
                `${timeAgo(user.expirationDate)}` :
                'Expired';

            var lastUpdate = `${timeAgo(user.dateUpdated)}`;
            var lastActivity = !user.isOnline ?
                `${timeAgo(user.lastActivity)} ago` :
                'Online';

            // Verifica se está ativo
            var isDeleted = user.isDeleted;

            // Cria uma nova linha para a tabela
            var row = `
            <tr>
              <td><strong>@${user.name}</strong></td>
              <td>$${user.balance.toFixed(2)}</td>
              <td class="d-none d-md-table-cell">${timeLeft}</td>
              <td class="d-none d-md-table-cell">${lastUpdate} ago</td>
              <td>${lastActivity}</td>

              <td class="d-none d-lg-table-cell">${isDeleted ? 'Yes' : 'No'}</td>
              <td>
                <div>

                    <button type="button" onclick="userDetail('${user.id}')" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
              </td>
            </tr>`;

            // Adiciona a nova linha à tabela
            activeUsersTable.insertAdjacentHTML('beforeend', row);
        })

        var allUsers = await getAllUsers.json();
        var allUsersTable = document.getElementById('user-table-body');
        allUsersTable.innerHTML = '';
        allUsers.forEach(user => {



            var expirationDate = new Date(user.expirationDate);
            var now = new Date();
            var timeLeft = !user.isExpired ?
                `${timeAgo(user.expirationDate)}` :
                'Expired';

            var lastUpdate = `${timeAgo(user.dateUpdated)}`;
            var lastActivity = !user.isOnline ?
                `${timeAgo(user.lastActivity)} ago` :
                'Online';


            // Verifica se está ativo
            var isDeleted = user.isDeleted;

            // Cria uma nova linha para a tabela
            var row = `
            <tr>
              <td><strong>@${user.name}</strong></td>
              <td>$${user.balance.toFixed(2)}</td>
              <td class="d-none d-md-table-cell">${timeLeft}</td>
              <td class="d-none d-md-table-cell">${lastUpdate} ago</td>
              <td>${lastActivity}</td>

              <td class="d-none d-lg-table-cell">${isDeleted ? 'Yes' : 'No'}</td>
              <td>
                <div>

                    <button type="button" onclick="userDetail('${user.id}')" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
              </td>
            </tr>`;

            // Adiciona a nova linha à tabela
            allUsersTable.insertAdjacentHTML('beforeend', row);
        })

        spinner.classList.add('hidden');
        content.classList.remove('hidden');

    } else {

    }
})


function userDetail(userId) {
    console.log("clicou")
    window.location.href = `/users/profile/?id=${userId}`
}

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