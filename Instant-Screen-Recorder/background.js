// background.js

chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup", // Specify the window type as a popup
        width: 650,    // Set the desired width
        height: 450    // Set the desired height
    });
});


