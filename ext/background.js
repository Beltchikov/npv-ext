import { handleMessage } from './messageBroker.js'
import { loadScripts } from './loader.js';

// service worker
var tabsWaitingForData = [];

// entry point
chrome.action.onClicked.addListener(async (currentTab) => {
  
  loadScripts(currentTab);

  // query tabs
  chrome.tabs.query({ lastFocusedWindow: true })
    .then(tabs => {
      tabsWaitingForData = [];
      tabs.map((t) => {
        tabsWaitingForData.push({ tabId: t.id, activeTab: t.active, data: undefined })
      });

      // execute parser.js for every tab
      for (var i = 0; i < tabs.length; i++) {
        var tabId = tabs[i].id;
        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            files: ['parser.bundle.js']
          });
      }
    })
    .catch(e => console.log({ err: e.message }));
});

// message listener
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

  if (message.target !== 'background') return;

  if (message.type === 'dataRow') {
    tabsWaitingForData = tabsWaitingForData.map((t) => t.tabId === sender.tab.id ? { ...t, ...{ data: message.data } } : t);
    var noDataObjects = tabsWaitingForData.filter((t) => t.data == undefined);

    if (noDataObjects.length === 0) {
      var activeTabData = tabsWaitingForData.filter((t) => t.activeTab)[0];
      if (console) console.log(`calling dialog on tab id ${activeTabData.tabId}`);

      handleMessage({
        target: 'dialog',
        context: 'Investing',
        type: 'dataRows',
        data: [tabsWaitingForData, activeTabData.tabId],
        sender: 'background'
      });
    }
  }
  else {
    console.log(`Not implemented for message type ${message.type}`);
  }

  sendResponse(true);
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
