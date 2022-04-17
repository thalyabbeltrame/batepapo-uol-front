let inputName = '';
let onlineUsers = [];
let to = 'Todos';
let visibility = 'público';

document.querySelector('#username').addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector('#login-btn').click();
  }
});

document.querySelector('#message-input').addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector('#send-message-btn').click();
  }
});

function joinTheChat() {
  inputName = document.querySelector('#username').value;
  const request = {
    name: inputName,
  };
  inputName.value = '';
  document.querySelector('.login-field').classList.add('hidden');
  document.querySelector('.loading').classList.remove('hidden');
  axios
    .post('https://mock-api.driven.com.br/api/v6/uol/participants', request)
    .then(() => {
      updateStatus();
      document.querySelector('.login-screen').classList.add('hidden');
      document.querySelector('.chat-screen').classList.remove('hidden');
      getMessages();
      getActiveUsers();
    })
    .catch((error) => {
      if (error.response.status === 400) {
        alert('Nome já está em uso ou é inválido. Por favor, insira outro!');
      }
    });
}

function getMessages() {
  axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then((response) => {
    const messages = response.data;
    renderMessages(messages);
  });
  setInterval(() => {
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then((response) => {
      const messages = response.data;
      renderMessages(messages);
    });
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
    to: to,
    text: inputMessage,
    type: visibility === 'public' ? 'message' : 'private_message',
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
  renderActiveUsers();
  document.querySelector('.sidebar').classList.remove('hidden');
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.add('hidden');
}

function getActiveUsers() {
  axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then((response) => {
    onlineUsers = response.data;
  });
}

function renderActiveUsers() {
  const listUsers = document.querySelector('.users ul');
  onlineUsers.forEach((user) => {
    listUsers.innerHTML += `
      <li class="item-users" onclick="selectUser(this)">
        <ion-icon name="person-circle" class="user-icon"></ion-icon>
        <span>${user.name}</span>
        <ion-icon name="checkmark" class="checkmark hidden"></ion-icon>
      </li>
    `;
  });
}

function selectUser(element) {
  to = element.querySelector('span').innerText;
  if (document.querySelector('.item-users .visible') !== null) {
    document.querySelector('.item-users .visible').classList.add('hidden');
    document.querySelector('.item-users .visible').classList.remove('visible');
  }
  element.querySelector('.users ul li .checkmark').classList.remove('hidden');
  element.querySelector('.users ul li .checkmark').classList.add('visible');
  document.querySelector('.message-information').innerText = `Enviando para ${to} (${visibility})`;
}

function selectVisibility(element) {
  visibility = element.querySelector('span').innerText.toLowerCase();
  if (document.querySelector('.item-visibility .visible') !== null) {
    document.querySelector('.item-visibility .visible').classList.add('hidden');
    document.querySelector('.item-visibility .visible').classList.remove('visible');
  }
  element.querySelector('.visibility ul li .checkmark').classList.remove('hidden');
  element.querySelector('.visibility ul li .checkmark').classList.add('visible');
  document.querySelector('.message-information').innerText = `Enviando para ${to} (${visibility})`;
}
