function addElement(messageChunk, output, textResponse, sourcesResponse) {
  if ('chunk' in messageChunk) {
    output += messageChunk['chunk'];
    textResponse.innerHTML = marked.parse(output);
  } else if ('sources' in messageChunk) {
    const sources = messageChunk['sources'];
    for (let src of sources) {
      const sourceItem = document.createElement('div');
      sourceItem.classList = 'sources-item';
      const sourceLink = document.createElement('a');
      const sourceLinkTextContainer = document.createElement('div');

      let imgLink = document.createElement('img');
      imgLink.src = '/static/images/icons/link-light.svg';
      imgLink.alt = 'LinkImg';
      sourceLinkTextContainer.appendChild(imgLink);

      if ('title' in src) {
        let textNode = document.createTextNode(src['title']);
        sourceLinkTextContainer.appendChild(textNode);
      } else {
        let textNode = document.createTextNode(src['source']);
        sourceLinkTextContainer.appendChild(textNode);
      }
      sourceLink.href = src['source'];
      sourceLink.target = '_blank';

      sourceLink.appendChild(sourceLinkTextContainer);
      sourceItem.appendChild(sourceLink);
      sourcesResponse.appendChild(sourceItem);
    }
  }

  return output;
}

function createUserQuestionBody(question, chatBody) {
  let userMessage = document.createElement('div');
  let userQuestion = document.createElement('div');

  userMessage.className = 'user-message';
  userQuestion.className = 'user-question';

  userQuestion.innerHTML = question;

  userMessage.appendChild(userQuestion);
  chatBody.appendChild(userMessage);
}

function createAssistantAnswerBody(chatBody) {
  let assistantMessage = document.createElement('div');
  let textResponse = document.createElement('div');
  let sourcesResponse = document.createElement('div');

  assistantMessage.className = 'assistant-message';
  textResponse.className = 'text-response';
  sourcesResponse.className = 'sources-response';

  assistantMessage.appendChild(textResponse);
  assistantMessage.appendChild(sourcesResponse);
  chatBody.appendChild(assistantMessage);

  return assistantMessage;
}

function getChatId() {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/chat\/([^\/]+)\/?$/);
  return match ? match[1] : null;
}

function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function checkIfRedirection() {
  const urlParams = new URLSearchParams(window.location.search);
  const isNewChatRedirection = urlParams.get('redirection') === 'true';
  return isNewChatRedirection;
}

function parseAllMessagesToMarkdown() {
  document.querySelectorAll('.text-response').forEach(div => {
    div.innerHTML = marked.parse(div.innerHTML);
  });
}

function removeRedirectionFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete('redirection');
  const newUrl =
    window.location.pathname +
    (urlParams.toString() ? '?' + urlParams.toString() : '');
  history.replaceState(null, '', newUrl);
}

document.addEventListener('DOMContentLoaded', async () => {
  parseAllMessagesToMarkdown();

  const chatId = getChatId();

  const chatBody = document.getElementById('chat-body');
  const submitBtn = document.getElementById('send-btn');
  const input = document.getElementById('input');

  // Wait for first message and than redirect
  if (chatId === null) {
    submitBtn.addEventListener('click', async e => {
      // Extract question from textarea
      const question = input.value.trim();
      if (!question) return;
      input.value = '';

      // Add user question to chat body
      createUserQuestionBody(question, chatBody);

      // Send POST request to backend
      const response = await fetch('/chat/redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const data = await response.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    });
  }
  // Stream agent answers
  else {
    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(
      `${wsScheme}://${window.location.host}/ws/chat/${chatId}`,
    );

    let socketConnected = new Promise((resolve, reject) => {
      socket.onopen = function () {
        resolve('Connected to WebSocket.');
      };

      socket.onerror = function (error) {
        reject('Error connecting to WebSocket.');
      };
    });

    await socketConnected;

    var output = '';
    var textResponse = null;
    var sourcesResponse = null;

    var isCurrentlyGenerating = false;
    const isRedirection = checkIfRedirection();

    // Redirection
    if (isRedirection) {
      removeRedirectionFromURL();

      // Add frame of assistant answer to chat body
      if (!textResponse || !sourcesResponse) {
        const assistantMessage = createAssistantAnswerBody(chatBody);
        textResponse = assistantMessage.children[0];
        sourcesResponse = assistantMessage.children[1];
      }

      // Send a request to send an answer
      socket.send(
        JSON.stringify({
          chat_id: chatId,
          is_redirection: true,
        }),
      );
    }

    // Send question button
    submitBtn.addEventListener('click', async e => {
      if (isCurrentlyGenerating) return;

      // Extract question from textarea
      const question = input.value.trim();
      if (!question) return;
      input.value = '';

      isCurrentlyGenerating = true;

      // Add user question to chat body
      createUserQuestionBody(question, chatBody);

      // Add frame of assistant answer to chat body
      if (!textResponse || !sourcesResponse) {
        const assistantMessage = createAssistantAnswerBody(chatBody);
        textResponse = assistantMessage.children[0];
        sourcesResponse = assistantMessage.children[1];
      }

      // Send question to assistant
      socket.send(
        JSON.stringify({
          question: question,
          chat_id: chatId,
        }),
      );
    });

    // Response from socket
    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);

      if (data.type === 'assistant_answer') {
        const chunk = data.message;
        const isStreaming = data.streaming;

        if (isStreaming) {
          const messageChunk = JSON.parse(chunk);
          output = addElement(
            messageChunk,
            output,
            textResponse,
            sourcesResponse,
          );
        } else {
          output = '';
          textResponse = null;
          sourcesResponse = null;
          isCurrentlyGenerating = false;
        }
      }
    };
  }
});
