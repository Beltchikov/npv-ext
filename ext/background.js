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

      console.log(`Sending message to dialog on tab id ${activeTabData.tabId}`);
      var data2dArray = tabsWaitingForData.map((e)=> e.data);
      const response = await chrome.tabs.sendMessage(activeTabData.tabId,
        {
          target: 'dialog',
          type: message.type,
          context: message.context,
          data: data2dArray,
          sender: message.sender
        });
      if (response) console.log(`Message to dialog on tab id ${activeTabData.tabId} successfully sent.`)
      else console.log(`Error sending message to dialog on tab id ${activeTabData.tabId}.`)
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
