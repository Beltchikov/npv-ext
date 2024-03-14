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