// service worker

// entry point
chrome.action.onClicked.addListener(async (currentTab) => {

  chrome.tabs.query({ lastFocusedWindow: true })
    .then(tabs => {
      for (var i = 0; i < tabs.length; i++) {
        var tabId = tabs[i].id;

        // Execute parser.js content script
        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            files: ['parser.bundle.js']
          });
      }
    })
    .catch(e => console.log({ err: e.message }));

  // TODO remove later
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['content.bundle.js']
  });
});

// message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // TODO remove later
  if (message === 'get-tabs-info') {
    chrome.tabs.query({ active: false, lastFocusedWindow: true })
      .then((r) => sendResponse({ data: r }))
      .catch(e => sendResponse({ err: e.message }));
    return true;
  }

  // message.type === 'dataRows'
  if (message.type === 'dataRows') {
    if (console) console.log('dataRows: ' + message.data);
    // todo call dialog.js
  }
});

// Example Promise.all 
// if (message === 'get-tabs-info') {
//   chrome.tabs.query({ active: false, lastFocusedWindow: true })
//     .then(tabs => {
//       // TODO get data from each tab (code block below)

//       var promises = [];
//       for (var i = 0; i < tabs.length; i++) {

//         var promise = chrome.scripting.executeScript({
//           target: { tabId: tabs[i].id },
//           func: investingParser_getDataRow
//         });
//         promises.push(promise);
//       }

//       Promise.all(promises)
//         .then((values) => {
//           sendResponse({ type: 'data', data: values });
//         })
//         .catch((reason) => {
//           sendResponse({ type: 'error', data: reason.message });
//         });

//       return true;
//     })
//     .catch(e => sendResponse({ err: e.message }));
//   return true;
// }
