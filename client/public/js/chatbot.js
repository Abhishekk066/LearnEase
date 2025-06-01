const micButton = document.getElementById("mic-button");
const chatSection = document.getElementById("chat-section");
const emptyState = document.getElementById("empty-state");
const conversation = document.getElementById("conversation");
const input = document.getElementById("input");
const clearChat = document.querySelector(".clear");
const closeModal = document.querySelector(".close");
const volume = document.querySelector(".speaker");
const chatBotToggle = document.querySelector(".chatbot");
const chatBotContainer = document.querySelector(".chatbot-container");
const appContainer = document.querySelector(".app-container");

function stopScrollBody() {
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  chatBotToggle.style.right = `calc(1rem + ${scrollBarWidth}px)`;
  chatBotContainer.style.left = `calc(50% - ${scrollBarWidth / 2}px)`;
  document.body.style.paddingRight = `${scrollBarWidth}px`;
  document.body.style.overflow = "hidden";
}

function addScrollBody() {
  chatBotContainer.style.left = "";
  chatBotToggle.style.right = "";
  document.body.style.paddingRight = "";
  document.body.style.overflow = "";
}

let isOpen = false;
let once = false;
function toggleChatBotModal() {
  isOpen = !isOpen;
  if (isOpen) {
    chatBotContainer.style.display = "block";
    stopScrollBody();
  } else {
    chatBotContainer.style.display = "none";
    addScrollBody();
  }

  if (!once) {
    initBot();
    once = true;
  }
}

let isMute = sessionStorage.getItem("isMute") === "true";

function updateVolumeUI() {
  if (isMute) {
    volume.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else {
    volume.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }
}

function toggleVolume() {
  isMute = !isMute;
  sessionStorage.setItem("isMute", isMute);
  updateVolumeUI();
}

function clearChatData() {
  conversation.innerHTML = "";
  conversationStarted = false;
  initBot();
}

function closeModalContainer() {
  chatBotContainer.style.display = "none";
  isOpen = false;
  addScrollBody();
}

function listening(message) {
  input.placeholder = message;
  input.style.textAlign = "center";
}

function stopListening() {
  input.placeholder = "Enter message here...";
  input.style.textAlign = "";
}

chatBotToggle.addEventListener("click", toggleChatBotModal);
volume.addEventListener("click", toggleVolume);
clearChat.addEventListener("click", clearChatData);
closeModal.addEventListener("click", closeModalContainer);

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "en-IN";
recognition.maxAlternatives = 1;

let isListening = false;
let finalTranscript = "";
let conversationStarted = false;

function initBot() {
  const speech = "Hey there, I'm Nova. How can I help you today?";
  const iconId = addAIMessage(speech);
  textToSpeech(speech, iconId);
  hideEmptyState();
}

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    finalTranscript = "";
    finalTranscript = input.value.trim();
    if (finalTranscript) {
      if (!conversationStarted) {
        hideEmptyState();
        conversationStarted = true;
      }
      addUserMessage(finalTranscript);
      sendToServer(finalTranscript);
      input.value = "";
    }
  }
});

micButton.onclick = () => {
  if (!isListening) {
    recognition.start();
  } else {
    recognition.stop();
  }
};

recognition.onstart = () => {
  isListening = true;
  micButton.classList.add("listening");
  listening("Listening...");
};

recognition.onresult = (event) => {
  finalTranscript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    finalTranscript += event.results[i][0].transcript;
  }
  listening("Processing...");
};

recognition.onend = () => {
  if (finalTranscript.trim()) {
    if (!conversationStarted) {
      hideEmptyState();
      conversationStarted = true;
    }
    addUserMessage(finalTranscript.trim());
    sendToServer(finalTranscript.trim());
  }
  micButton.classList.remove("listening");
  isListening = false;
  stopListening();
};

recognition.onerror = (event) => {
  stopListening();
  micButton.classList.remove("listening");
  isListening = false;
  finalTranscript = "";
  setTimeout(() => {
    stopListening();
  }, 3000);
};

function hideEmptyState() {
  emptyState.style.display = "none";
}

function addUserMessage(text) {
  const userBox = document.createElement("div");
  userBox.className = "chat-box user";
  userBox.innerHTML = `
    <div class="profile">
      <div class="profile-icon"><i class="fas fa-user"></i></div>
      <div class="profile-name">You</div>
    </div>
    <div class="chat-bubble">${text}</div>
  `;
  conversation.appendChild(userBox);
  scrollToBottom();
}

function addAIMessage(htmlText) {
  const aiBox = document.createElement("div");
  aiBox.className = "chat-box ai";

  aiBox.innerHTML = `
    <div class="profile">
      <div class="profile-icon" id="ai-icon-${Date.now()}"><img src='/img/co.avif' alt='ai-avatar'/></div>
      <div class="profile-name">Nova</div>
    </div>
    <div class="chat-bubble markdown-output"></div>
  `;

  conversation.appendChild(aiBox);

  const bubble = aiBox.querySelector(".chat-bubble");
  bubble.innerHTML = "";

  const temp = document.createElement("div");
  temp.innerHTML = htmlText;

  const textNodes = [];

  for (const node of temp.childNodes) {
    const blank = cloneWithEmptyText(node);
    bubble.appendChild(blank);
    collectTextNodes(node, blank);
  }

  let nodeIndex = 0;
  let charIndex = 0;

  function typeNext() {
    if (nodeIndex >= textNodes.length) {
      hljs.highlightAll();
      return;
    }

    const { original, clone } = textNodes[nodeIndex];
    const text = original.textContent;

    if (charIndex < text.length) {
      clone.textContent += text[charIndex];
      charIndex++;
      setTimeout(typeNext, 15);
    } else {
      nodeIndex++;
      charIndex = 0;
      setTimeout(typeNext, 0);
    }
    scrollToBottom();
  }

  typeNext();

  return aiBox.querySelector(".profile-icon").id;

  function cloneWithEmptyText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode("");
    }

    const clone = node.cloneNode(false);
    for (const child of node.childNodes) {
      clone.appendChild(cloneWithEmptyText(child));
    }
    return clone;
  }

  function collectTextNodes(origNode, cloneNode) {
    if (origNode.nodeType === Node.TEXT_NODE && origNode.textContent.trim()) {
      textNodes.push({ original: origNode, clone: cloneNode });
    } else {
      for (let i = 0; i < origNode.childNodes.length; i++) {
        collectTextNodes(origNode.childNodes[i], cloneNode.childNodes[i]);
      }
    }
  }
}

function scrollToBottom() {
  setTimeout(() => {
    chatSection.scrollTop = chatSection.scrollHeight;
  }, 100);
}

async function sendToServer(prompt) {
  listening("Getting response...");

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    const message = result.html;
    const speech = result.speech;

    const iconId = addAIMessage(message);
    textToSpeech(speech, iconId);
    finalTranscript = "";
    stopListening();
  } catch (error) {
    finalTranscript = "";
    addAIMessage(
      "I'm sorry, I couldn't process your message. Please try again."
    );
    stopListening();
  }
}

let selectedVoice = null;

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  selectedVoice =
    voices.find(
      (v) =>
        v.name.includes("Google") && v.name.toLowerCase().includes("female")
    ) ||
    voices.find(
      (v) => v.lang === "en-IN" && v.name.toLowerCase().includes("female")
    ) ||
    voices.find((v) => v.lang === "en-IN") ||
    voices.find(
      (v) => v.lang.includes("en") && v.name.toLowerCase().includes("female")
    );
}

// Initial voice loading
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

// Apply initial volume UI state
updateVolumeUI();

function textToSpeech(text, iconId) {
  if (isMute) return;
  const utterance = new SpeechSynthesisUtterance(text);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  utterance.lang = "en-IN";
  utterance.rate = 1.1;
  utterance.pitch = 1;

  const icon = document.getElementById(iconId);
  if (icon) {
    icon.classList.add("speaking");

    utterance.onend = () => {
      icon.classList.remove("speaking");
    };
  }

  speechSynthesis.speak(utterance);
}
