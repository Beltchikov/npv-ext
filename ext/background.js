// service worker

chrome.action.onClicked.addListener(async (currentTab) => {


  function getCurrentTab(callback) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
      if (chrome.runtime.lastError)
        console.error("ERR: " + chrome.runtime.lastError);
      // `tab` will either be a `tabs.Tab` instance or `undefined`.
      callback(tab);
    });
  }

  // function poc() {
  //   alert('tab');
  // };

  // chrome.scripting
  //   .executeScript({
  //     target: { tabId: currentTab.id },
  //     func: poc,
  //   })
  //   .then(() => console.log("injected a function"));


  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['content.js']
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'get-user-data') {
    chrome.tabs.query({ active: false, lastFocusedWindow: true })
      .then((r) => sendResponse({ ok: r }))
      .catch(e => sendResponse({ err: e.message }));
    return true;
  }
});

