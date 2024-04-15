import { loadScripts } from './loader.js';

// service worker

class TabDataAndPayload {
  constructor(tabId, activeTab, tabData) {
    this.tabId = tabId;
    this.activeTab = activeTab;
    this.tabData = tabData;
  }
}
var tabsRequested = [];

// entry point
chrome.action.onClicked.addListener(async (currentTab) => {

  loadScripts(currentTab);

  // query tabs
  chrome.tabs.query({ lastFocusedWindow: true })
    .then(tabs => {
      tabsRequested = [];
      tabs.map(t => tabsRequested.push(new TabDataAndPayload(t.id, t.active, undefined)));

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

  if (message.type === 'tabData') {
    console.log(`message of type tabData received:`);
    console.log(message);

    tabsRequested = tabsRequested.map((tabDataAndPayload) => tabDataAndPayload.tabId === sender.tab.id
      ? { ...tabDataAndPayload, ...{ tabData: payloadFromMessage(message) } }
      : tabDataAndPayload);
    var tabsStillWaitingForData = tabsRequested.filter((t) => t.tabData == undefined);

    if (tabsStillWaitingForData.length === 0) {
      var activeTabData = tabsRequested.filter((t) => t.activeTab)[0];

      console.log('tabsRequested');
      console.log(tabsRequested);

      let cummulatedDataArray = tabsRequested
        .map(dt => dt.tabData)
        .reduce((r, n) => r.concat(n));

      console.log('cummulatedDataArray');
      console.log(cummulatedDataArray);

      console.log(`Sending message to dialog on tab id ${activeTabData.tabId}`);
      const response = await chrome.tabs.sendMessage(
        activeTabData.tabId,
        buildMessageToDialog(message, cummulatedDataArray ));

      if (response) console.log(`Message to dialog on tab id ${activeTabData.tabId} successfully sent.`)
      else console.log(`Error sending message to dialog on tab id ${activeTabData.tabId}.`)
    };
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

const buildMessageToDialog = (message, cummulatedDataArray) => {
  var messageToDialog = {
    target: 'dialog',
    type: 'cummulatedDataRows',
    context: message.context,
    header: message.tabData.header,
    dataTable: cummulatedDataArray,
    footer: message.tabData.footer,
    sender: 'background'
  };
  return messageToDialog;
}

const payloadFromMessage = (message) => {
  return message.tabData.rows.map(r => r.cells);
}

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

// Example Shape of multidimensional array

// function getShape(matrix, dimensions = []) {
//   // displays max value in case of jagged array
//   if (Array.isArray(matrix)) {
//     dimensions.push(matrix.length);
//     return getShape(matrix[0], dimensions);
//   } else return dimensions;
// }
