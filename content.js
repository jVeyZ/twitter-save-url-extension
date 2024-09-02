// Function to sanitize the filename
function sanitizeFilename(filename) {
    return filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_'); // Replace invalid characters with '_'
}

// Function to modify the image URL to end with "name=large"
function convertToLargeImageUrl(url) {
    return url.replace(/name=[^&]+/, 'name=large'); // Replace the "name=" parameter with "name=large"
}

// Function to add the save button to each tweet
function addSaveButton(tweet) {
    if (tweet.querySelector('.save-url-btn')) {
        console.log("Button already added, skipping...");
        return;
    }

    console.log("Adding button to tweet:", tweet);

    const button = document.createElement('button');
    button.innerText = '';
    button.className = 'save-url-btn';

    const toolbar = tweet.querySelector('div.css-175oi2r.r-1kbdv8c.r-18u37iz.r-1wtj0ep.r-1ye8kvj.r-1s2bzr4');
    if (toolbar) {
        console.log("Toolbar found, appending button...");
        toolbar.appendChild(button);

        button.addEventListener('click', () => {
            const tweetLink = tweet.querySelector('a[href*="/status/"]');
            const tweetContent = tweet.querySelector('div[lang]')?.innerText || 'untitled';
            
            // Extract image URLs for photo/1, photo/2, photo/3, photo/4
            const imageUrls = [];
            for (let i = 1; i <= 4; i++) {
                const imgElement = tweet.querySelector(`a[href$="photo/${i}"] img`);
                if (imgElement) {
                    let imgUrl = imgElement.src;
                    imgUrl = convertToLargeImageUrl(imgUrl);
                    imageUrls.push(imgUrl);
                }
            }

            if (tweetLink) {
                const tweetUrl = tweetLink.href;
                console.log("Button clicked! Saving URL and image URLs:", tweetUrl, imageUrls);

                // Sanitize the tweet content to create a filename
                const filename = sanitizeFilename(tweetContent.substring(0, 50)); // Limit filename length

                // Combine tweet URL and image URLs into one string
                let contentToSave = `${tweetUrl}\n`;
                if (imageUrls.length > 0) {
                    contentToSave += `${imageUrls.join('\n')}`;
                } //else {
                    //contentToSave += `No images found.`;
                //}

                // Create a Blob with the content
                const blob = new Blob([contentToSave], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);

                // Create a link element and trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.download = `${tweetUrl}.txt`; // Use sanitized tweet content as filename
                document.body.appendChild(a); // Append the link to the body
                a.click(); // Trigger the download
                document.body.removeChild(a); // Remove the link after download
                URL.revokeObjectURL(url); // Clean up the URL object
            } else {
                console.log("Tweet URL not found.");
            }
        });
    } else {
        console.log("Toolbar not found for tweet:", tweet);
    }
}

// Observe tweets and add buttons
function observeTweets() {
    console.log("observeTweets function triggered!");
    
    function setupObserver() {
        const timeline = document.querySelector('div[aria-label="Timeline: Your Home Timeline"], div[aria-label="Timeline: Walla’s liked posts"]');
        if (!timeline) {
            console.log("Timeline container not found, retrying...");
            setTimeout(setupObserver, 1000);
            return;
        }

        console.log("Timeline container found, setting up MutationObserver...");

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('article[data-testid="tweet"]')) {
                        addSaveButton(node);
                    } else if (node.nodeType === 1 && node.querySelectorAll('article[data-testid="tweet"]').length > 0) {
                        node.querySelectorAll('article[data-testid="tweet"]').forEach(addSaveButton);
                    }
                });
            });
        });

        observer.observe(timeline, { childList: true, subtree: true });
        document.querySelectorAll('article[data-testid="tweet"]').forEach(addSaveButton);
    }

    setupObserver();
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "startObserving") {
        console.log("Received message to start observing tweets.");
        observeTweets();
    }
});

window.addEventListener('load', () => {
    console.log("Page fully loaded. Starting to observe tweets...");
    observeTweets();
});
