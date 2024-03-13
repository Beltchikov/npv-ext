async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log('tab' + tab);
  return tab;
}

chrome.action.onClicked.addListener(async (currentTab) => {
  // TODO iterate tabs  
  // let queryOptions = { active: true, lastFocusedWindow: true };
  //   // `tab` will either be a `tabs.Tab` instance or `undefined`.
  //   let [tab] = await chrome.tabs.query(queryOptions);
  //  console.log("Tab: " + tab);

  // chrome.tabs.query({currentWindow: true}, function (tabs) { 
  //   console.log("Tab: " + tabs.length);

  //  });

  var tab = await getCurrentTab();
  console.log('tab' + tab);

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