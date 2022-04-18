let inputUserName = '';
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
  inputUserName = document.querySelector('#username').value;
  const request = {
    name: inputUserName,
  };
  inputUserName.value = '';
  document.querySelector('.login-field').classList.add('hidden');
  document.querySelector('.loading').classList.remove('hidden');
  axios
    .post('https://mock-api.driven.com.br/api/v6/uol/participants', request)
    .then(() => {
      getMessages();
      updateUserStatus();
      getActiveUsers();
      setTimeout(() => {
        document.querySelector('.login-screen').classList.add('hidden');
        document.querySelector('.chat-screen').classList.remove('hidden');
      }, 3000);
    })
    .catch((err) => {
      if (err.response.status === 400) {
        alert('Nome já está em uso ou é inválido. Por favor, insira outro!');
        window.location.reload();
      }
    });
}

function getMessages() {
  setInterval(() => {
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then((response) => {
      const messages = response.data;
      renderMessages(messages);
    });
  }, 3000);
}

function renderMessages(messages) {
  const chatMessages = document.querySelector('.chat-messages');
  chatMessages.innerHTML = '';

  messages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (message.type === 'private_message' && !(message.to === inputUserName || message.from === inputUserName)) return;

    switch (message.type) {
      case 'status':
        createStatusElement(message, messageElement);
        break;
      case 'message':
        createPublicMessageElement(message, messageElement);
        break;
      case 'private_message':
        createPrivateMessageElement(message, messageElement);
        break;
      default:
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

function createPublicMessageElement(message, messageElement) {
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

function updateUserStatus() {
  setInterval(() => {
    axios
      .post('https://mock-api.driven.com.br/api/v6/uol/status', { name: inputUserName })
      .catch((err) => window.location.reload());
  }, 3000);
}

function getActiveUsers() {
  setInterval(() => {
    axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then((response) => {
      let activeUsers = response.data;
      renderActiveUsers(activeUsers);
    });
  }, 10000);
}

function sendMessage() {
  const inputMessage = document.querySelector('#message-input').value;
  const request = {
    from: inputUserName,
    to: to,
    text: inputMessage,
    type: visibility === 'public' ? 'message' : 'private_message',
  };
  document.querySelector('#message-input').value = '';
  axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', request).catch(() => window.location.reload());
}

function openSidebar() {
  document.querySelector('.sidebar').classList.remove('hidden');
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.add('hidden');
}

function renderActiveUsers(activeUsers) {
  let usersList = document.querySelector('.users ul');
  usersList.innerHTML = '';
  usersList.innerHTML += `
    <li class="item-users" onclick="selectUser(this)">
      <ion-icon name="people" class="user-icon"></ion-icon>
      <span>Todos</span>
      <ion-icon name="checkmark" class="checkmark hidden"></ion-icon>
    </li>
  `;
  activeUsers.forEach((user) => {
    usersList.innerHTML += `
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
  element.querySelector('.checkmark').classList.remove('hidden');
  element.querySelector('.checkmark').classList.add('visible');
  document.querySelector('.message-information').innerText = `Enviando para ${to} (${visibility})`;
}

function selectVisibility(element) {
  visibility = element.querySelector('span').innerText.toLowerCase();
  if (document.querySelector('.item-visibility .visible') !== null) {
    document.querySelector('.item-visibility .visible').classList.add('hidden');
    document.querySelector('.item-visibility .visible').classList.remove('visible');
  }
  element.querySelector('.checkmark').classList.remove('hidden');
  element.querySelector('.checkmark').classList.add('visible');
  document.querySelector('.message-information').innerText = `Enviando para ${to} (${visibility})`;
}

function logOff() {
  window.location.reload();
}

function filterUsers() {
  const searchUsersInput = document.querySelector('#search-users').value.toUpperCase();
  const li = document.querySelectorAll('.item-users');
  li.forEach((item) => {
    const a = item.querySelector('span').innerText;
    if (a.toUpperCase().indexOf(searchUsersInput) > -1) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}
