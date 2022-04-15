// cria uma função que retorna mensagens de um servidor

joinTheChat();
updateStatus();
getMessages();

function joinTheChat() {
  axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', { name: 'bbt_user' }).then((response) => {
    console.log(response);
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
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: 'bbt_user' }).then((response) => {
      console.log(response);
    });
  }, 3000);
}

function sendMessage() {
  const inputMessage = document.querySelector('#message-input').value;
  const request = {
    from: 'bbt_user',
    to: 'Todos',
    text: inputMessage,
    type: 'message',
  };
  inputMessage.value = '';
  axios
    .post('https://mock-api.driven.com.br/api/v6/uol/messages', request)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log(error));
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
