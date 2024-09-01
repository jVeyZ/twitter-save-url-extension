chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed and background script initialized.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'download_urls') {
        chrome.storage.local.get({ urls: [] }, function (result) {
            const urls = result.urls;
            if (urls.length > 0) {
                const blob = new Blob([JSON.stringify(urls, null, 2)], { type: 'application/json' });
                const urlObject = URL.createObjectURL(blob);

                chrome.downloads.download({
                    url: urlObject,
                    filename: 'posts.json',
                    conflictAction: 'overwrite'
                }, (downloadId) => {
                    console.log("Download started with ID:", downloadId);
                    URL.revokeObjectURL(urlObject); // Clean up URL object
                });
            } else {
                console.log("No URLs to download.");
            }
        });
    }
});
