document.addEventListener('DOMContentLoaded', async function() {


    const token = localStorage.getItem('token');
    const spinner = document.getElementById('spinner');
    const content = document.getElementById('main-content');

    //verifica se existe um token disponivel
    if (token) {
        console.log('Existe Token:', token);

        const url = 'https://api.privaxnet.com/v1/User/get';

        const headers = {
            'accept': 'text/plain',
            'Authorization': `Bearer ${token}`
        };

        var getUserStatus = await fetch('https://api.privaxnet.com/v1/User/status', {
            headers: headers,
            method: 'GET'
        })

        var getPaymentStatus = await fetch('https://api.privaxnet.com/v1/Payment/status', {
            headers: headers,
            method: 'GET'
        })

        var userStatus = await getUserStatus.json();
        var paymentStatus = await getPaymentStatus.json();

        document.getElementById('activeUsers').innerHTML = userStatus.active;
        document.getElementById('allUsers').innerHTML = userStatus.all;
        document.getElementById('onlineUsers').innerHTML = userStatus.onlineNow;
        document.getElementById('onlineTodayUsers').innerHTML = userStatus.onlineToday;

        document.getElementById('earnsToday').innerHTML = '$' + paymentStatus.earnsToday;
        document.getElementById('earns').innerHTML = '$' + paymentStatus.earns;
        document.getElementById('invoices').innerHTML = paymentStatus.invoices;
        document.getElementById('paid').innerHTML = paymentStatus.paid;

        fetch(url, {
                method: 'GET',
                headers: headers
            })
            .then(response => {

                if (!response.ok) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(user => {
                console.log(user.name)

                spinner.classList.add('hidden');
                content.classList.remove('hidden');
            })
            .catch(error => {
                localStorage.removeItem('token');
                console.error('Error fetching users:', error);
            });

    } else {
        window.location.href = '/login';
        console.log('Token nao encontrado');
    }
});