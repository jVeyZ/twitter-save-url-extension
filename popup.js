document.getElementById('start-observe-btn').addEventListener('click', function() {
    console.log("Popup button clicked!"); // Check if this logs
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "startObserving"});
    });
});
