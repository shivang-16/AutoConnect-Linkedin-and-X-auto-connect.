chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      if (tab.url.includes("linkedin.com")) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["linkedin.js"]
        });
      } else if (tab.url.includes("x.com")) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["twitter.js"]
        });
      }
    }
  });

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background script received message:', message);

    if (message.type === 'injectScript') {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: [message.script]
        }).then(() => {
            console.log('Script injected successfully:', message.script);
            sendResponse({ success: true });
        }).catch(error => {
            console.error('Error injecting script:', error);
            sendResponse({ success: false, error: error.message });
        });
        return true; // Will respond asynchronously
    }
});