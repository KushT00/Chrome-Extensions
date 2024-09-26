    document.addEventListener('DOMContentLoaded', function () {
        const sendButton = document.getElementById('send');
        const inputField = document.getElementById('input');
        const chatBox = document.getElementById('chatBox');

        // Load chat history from local storage when the popup is opened
        loadChatHistory();

        sendButton.addEventListener('click', function () {
        const query = inputField.value;
        if (query) {
            // Display and store the user's message
            displayMessage(query, 'user-message');
            saveToLocalStorage('user-message', query);

            // Send the message to the background script
            chrome.runtime.sendMessage({ type: 'chatWithGemini', query }, (response) => {
            if (response && response.message) {
                // Parse the response object to extract the relevant text
                let extractedText = extractTextFromResponse(response.message);
    
                // Display and store the bot's response
                displayMessage(extractedText, 'bot-message');
                saveToLocalStorage('bot-message', extractedText);
            } else if (response && response.error) {
                displayMessage('Error: ' + response.error, 'bot-message');
                saveToLocalStorage('bot-message', 'Error: ' + response.error);
            } else {
                displayMessage('Error: No response received.', 'bot-message');
                saveToLocalStorage('bot-message', 'Error: No response received.');
            }
            });

            // Clear the input field after sending the message
            inputField.value = '';
        }
        });

        function displayMessage(message, messageType) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', messageType);
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);

        // Auto-scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Save chat to local storage
        function saveToLocalStorage(type, message) {
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.push({ type, message });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }

        // Load chat history from local storage
        function loadChatHistory() {
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.forEach(chat => {
            displayMessage(chat.message, chat.type);
        });
        }
        const clearChatButton = document.getElementById('clearChat');
    clearChatButton.addEventListener('click', function () {
        localStorage.removeItem('chatHistory');
        chatBox.innerHTML = ''; // Clear the chatbox visually
    });


        // Function to extract the text from the response object
        function extractTextFromResponse(response) {
        try {
            let responseObject = typeof response === 'string' ? JSON.parse(response) : response;
            if (responseObject.candidates && responseObject.candidates[0].content.parts[0].text) {
            return responseObject.candidates[0].content.parts[0].text;
            } else {
            return "No valid response text found.";
            }
        } catch (error) {
            return "Error parsing response: " + error.message;
        }
        }
    });
