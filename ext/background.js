// service worker

chrome.action.onClicked.addListener(async (currentTab) => {
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['content.js']
  });
});

//const fakedData = () => 'faked data';
function getTitle() { return document.title; }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'get-tabs-info') {
    chrome.tabs.query({ active: false, lastFocusedWindow: true })
      .then(tabs => {
        // TODO get data from each tab (code block below)

        var promises = [];
        for (var i = 0; i < tabs.length; i++) {
          
          var promise = chrome.scripting.executeScript({
            target: { tabId: tabs[i].id },
            func: () => 'faked data'
          });
          promises.push(promise);
        }
        
        Promise.all(promises)
        .then((values) => {
          sendResponse(values);
        })
        .catch((e) => sendResponse({err: e}));

        return true;
      })
      .catch(e => sendResponse({ err: e.message }));
    return true;
  }
});

// if (tab.id !== undefined) {
//   chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: parser.getDataRow
//   })
//   .then(r => {
//       console.log(r);
//   })
//   .catch((err)=> console.log(err));
// }
// else throw new Error('Unexpected! tab.id is undefined');