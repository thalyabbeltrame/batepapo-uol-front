let inputName = '';
let onlineUsers = [];

function joinTheChat() {
  inputName = document.querySelector('#username').value;
  const request = {
    name: inputName,
  };
  inputName.value = '';
  axios
    .post('https://mock-api.driven.com.br/api/v6/uol/participants', request)
    .then(() => {
      updateStatus();
      document.querySelector('.login-screen').style.display = 'none';
      document.querySelector('.chat-screen').style.display = 'block';
      getMessages();
      getOnlineUsers();
    })
    .catch((error) => {
      if (error.response.status === 400) {
        alert('Nome já está em uso ou inválido');
      }
    });
}

function getMessages() {
  setInterval(() => {
    axios
      .get('https://mock-api.driven.com.br/api/v6/uol/messages')
      .then((response) => {
        const messages = response.data;
        renderMessages(messages);
      })
      .catch((error) => console.log(error));
  }, 5000);
}

function updateStatus() {
  setInterval(() => {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: inputName });
  }, 3000);
}

function renderMessages(messages) {
  const chatMessages = document.querySelector('.chat-messages');
  chatMessages.innerHTML = '';

  messages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    switch (message.type) {
      case 'status':
        createStatusElement(message, messageElement);
        break;
      case 'message':
        createMessageElement(message, messageElement);
        break;
      case 'private_message':
        createPrivateMessageElement(message, messageElement);
        break;
    }

    chatMessages.appendChild(messageElement);
  });
  chatMessages.lastChild.scrollIntoView();
}

function createStatusElement(message, messageElement) {
  messageElement.classList.add('status');
  messageElement.innerHTML = `
    <p>
    <grey>(${message.time})</grey>
    <strong>${message.from}</strong> ${message.text}
    </p>
  `;
}

function createMessageElement(message, messageElement) {
  messageElement.classList.add('public');
  messageElement.innerHTML = `
  <p>
  <grey>(${message.time})</grey>
  <strong>${message.from}</strong> para <strong>${message.to}</strong>: ${message.text}
  </p>
  `;
}

function createPrivateMessageElement(message, messageElement) {
  messageElement.classList.add('private');
  messageElement.innerHTML = `
  <p>
  <grey>(${message.time})</grey>
  <strong>${message.from}</strong> reservadamente para <strong>${message.to}</strong>: ${message.text}
  </p>
  `;
}

function sendMessage() {
  let inputMessage = document.querySelector('#message-input').value;
  const request = {
    from: inputName,
    to: 'Todos',
    text: inputMessage,
    type: 'message',
  };
  document.querySelector('#message-input').value = '';
  axios
    .post('https://mock-api.driven.com.br/api/v6/uol/messages', request)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log(error));
}

function openSidebar() {
  renderOnlineUsers();
  document.querySelector('.sidebar').classList.remove('hidden');
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.add('hidden');
}

function getOnlineUsers() {
  axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then((response) => {
    onlineUsers = response.data;
  });
}

function renderOnlineUsers() {
  const listUsers = document.querySelector('.users ul');
  onlineUsers.forEach((user) => {
    const userElement = document.createElement('li');
    userElement.innerHTML = `
      <ion-icon name="person-circle" class="user-icon"></ion-icon>
      <span>${user.name}</span>
      <ion-icon name="checkmark" class="checkmark hidden"></ion-icon>
    `;
    listUsers.appendChild(userElement);
  });
}
