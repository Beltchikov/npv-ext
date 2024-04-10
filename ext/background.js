import { loadScripts } from './loader.js';

// service worker
var tabsRequestedForData = [];

// entry point
chrome.action.onClicked.addListener(async (currentTab) => {

  loadScripts(currentTab);

  // query tabs
  chrome.tabs.query({ lastFocusedWindow: true })
    .then(tabs => {
      tabsRequestedForData = [];
      tabs.map((t) => {
        tabsRequestedForData.push({ tabId: t.id, activeTab: t.active, data: undefined })
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

const buildMessageToDialog = (context, cummulatedDataArray) => {
  var messageToDialog = {
    target: 'dialog',
    type: 'cummulatedDataRows',
    context: context,
    data: cummulatedDataArray,
    sender: 'background'
  };
  return messageToDialog;
}

// message listener
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

  if (message.target !== 'background') return;

  if (message.type === 'dataRow') {
    console.log("message.type === 'dataRow'");
    console.log(message);

    tabsRequestedForData = tabsRequestedForData.map((t) => t.tabId === sender.tab.id ? { ...t, ...{ data: message.data } } : t);
    var tabsStillWaitingForData = tabsRequestedForData.filter((t) => t.data == undefined);

    if (tabsStillWaitingForData.length === 0) {
      var activeTabData = tabsRequestedForData.filter((t) => t.activeTab)[0];

      console.log(`Sending message to dialog on tab id ${activeTabData.tabId}`);
      var cummulatedDataArray = tabsRequestedForData.map((e) => e.data);
      var messageToDialog = buildMessageToDialog(message.context, cummulatedDataArray);
      const response = await chrome.tabs.sendMessage(activeTabData.tabId, messageToDialog);

      if (response) console.log(`Message to dialog on tab id ${activeTabData.tabId} successfully sent.`)
      else console.log(`Error sending message to dialog on tab id ${activeTabData.tabId}.`)
    }
  }
  else if (message.type === 'header') {
    console.log(`Header receied:`);
    console.log(message);
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
