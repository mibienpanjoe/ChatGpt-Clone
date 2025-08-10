
// apiKey and Url
const API_KEY = 'YOUR_API_KEY_HERE';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message) return;

    // Display user's message
    addMessage('You', message, 'user');
    userInput.value = '';

    try {
        // Show loading message
        const loadingId = addMessage('Gemini', 'Thinking...', 'bot', true);
        
        // Call Gemini API
        const response = await callGeminiAPI(message);
        
        // Remove loading message and show response
        document.getElementById(loadingId).remove();
        addMessage('Gemini ', response, 'bot');
    } catch (error) {
        addMessage('System', `Error: ${error.message}`, 'error');
    }
        }

        // Add message to chat display
function addMessage(sender, text, type, isLoading = false) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    const messageId = 'msg-' + Date.now();
    
    messageDiv.id = messageId;
    if (type === "user"){
        messageDiv.className = 'chat outgoing';
    }
    else{
        messageDiv.className = 'chat incoming';
    }
    messageDiv.innerHTML = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="images/${type}.jpg">
            <p id="content-box">${isLoading ? '<span class="loading"></span>' : text}</p>
        </div>
        <span class="material-symbols-outlined" id="copy-btn" onclick="copy()">content_copy</span>
    </div>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    return messageId;
}

// Make API call to Gemini
async function callGeminiAPI(prompt) {
    const requestBody = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Enable sending message with Enter key
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// theme toggle button 

const btn = document.querySelector('#theme-btn');

btn.addEventListener("click", ()=>{
    document.querySelector('body').classList.toggle('light-mode');
})

// delete button 
const clearScreen = document.querySelector('#delete-btn');

clearScreen.addEventListener("click", ()=>{
    document.querySelector('.chat-container').removeChild(document.querySelector('#messages'))
})

// copy button 
const contentBox = document.querySelector('#messages');

async function copy() {
    
    // Get the text content
    const textToCopy = contentBox.textContent || contentBox.innerText;
    
    // Copy to clipboard using modern API
    await navigator.clipboard.writeText(textToCopy);
    
    alert("content copied");
}