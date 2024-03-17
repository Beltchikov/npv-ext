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

        for (var i = 0; i < tabs.length; i++) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[i].id },
            func: () => 'faked data'
          })
            .then(r => {
              sendResponse(r);
            })
            .catch((err) => response.push(err));
        }

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