// Selecionar o formulário pelo ID
const loginForm = document.getElementById('loginForm');

const token = localStorage.getItem('token');

//verifica se existe um token disponivel
if (token) {
  console.log('Existe Token:', token);

  const url = 'https://api.privaxnet.com/v1/User/get';

  const headers = {
    'accept': 'text/plain',
    'Authorization': `Bearer ${token}` 
  };

  fetch(url, {
  method: 'GET',
  headers: headers
})
  .then(response => {

    if (!response.ok) {
      localStorage.removeItem('token');
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(user => {
    window.location.href = '/';
  })
  .catch(error => {
    localStorage.removeItem('token');
    console.error('Error fetching users:', error);
  });


} else {
  console.log('Token nao encontrado');
  localStorage.removeItem('token');
}

// Adicionar evento de envio ao formulário
loginForm.addEventListener('submit', (event) => {
  // Prevenir o comportamento padrão de recarregar a página
  event.preventDefault();
  const toastLive = document.getElementById('liveToast')

  // Obter os valores dos campos
  const username = document.getElementById('nameInput').value;
  const password = document.getElementById('passwordInput').value;

  // Exemplo de envio para uma API
  const loginData = { name: username, password: password };

  fetch('https://api.privaxnet.com/v1/Auth/login', {
    method: 'POST',
    headers: {
      'Accept': 'text/plain',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  })
    .then(response => {
      if (!response.ok) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive)
        document.getElementById('nameInput').value = '';
        toastBootstrap.show();
        localStorage.removeItem('token');
        throw new Error(`Erro: ${response.status}`);
      }
      return response.json(); // Supondo que a resposta seja texto
    })
    .then(data => {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    })
    .catch(error => {
      localStorage.removeItem('token');
      console.error('Erro ao enviar dados:', error);
    });
});
