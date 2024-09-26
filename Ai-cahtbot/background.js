// Import the Generative AI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Set up the API key
const apiKey = "AIzaSyB-R3b5kJkqABX3_pP-y6qaMIFvy9kyLRk";
const genAI = new GoogleGenerativeAI(apiKey);

// Get the Generative Model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Set the generation configuration
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "chatWithGemini") {
    handleGeminiChat(request.query, sendResponse);
    return true; // Keep the message channel open for async response
  }
});

// Function to handle Gemini chat interaction
async function handleGeminiChat(userInput, sendResponse) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "hello my  name is kush"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Hello Kush, nice to meet you! 👋 What can I do for you today? 😊 \n"},
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(userInput);
    
    // Send the text response back to the content/popup script
    sendResponse({ message: result.response });
  } catch (error) {
    // Handle any errors
    sendResponse({ error: 'Error: ' + error.message });
  }
}
