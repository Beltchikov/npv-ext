// service worker

chrome.action.onClicked.addListener(async (currentTab) => {
  
  function poc() { alert('tab')};

  chrome.scripting
    .executeScript({
      target: { tabId: currentTab.id },
      func: poc,
    })
    .then(() => console.log("injected a function"));


  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['content.js']
  });
});

// Example of a simple user data object
const user = {
  username: 'demo-user'
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  if (message === 'get-user-data') {
    sendResponse(user);
  }
});