import { handleMessage } from './messageBroker.js'

// service worker
var tabsWaitingForData = [];

// entry point
chrome.action.onClicked.addListener(async (currentTab) => {

  // start react app
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['content.bundle.js']
  });

  // load dialog content script
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['dialog.bundle.js']
  });

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

  // if (message.context === 'Investing') {
  //   if (message.type === 'dataRow') {
  //     tabsWaitingForData = tabsWaitingForData.map((t) => t.tabId === sender.tab.id ? { ...t, ...{ data: message.data } } : t);
  //     var noDataObjects = tabsWaitingForData.filter((t) => t.data == undefined);

  //     if (noDataObjects.length === 0) {
  //       var activeTabData = tabsWaitingForData.filter((t) => t.activeTab)[0];
  //       if (console) console.log(`calling dialog on tab id ${activeTabData.tabId}`);

  //       const response = await chrome.tabs.sendMessage(
  //        activeTabData.tabId, { target:'messageBroker', context:'Investing', type: 'dataRows', data: tabsWaitingForData, sender: 'background' });

  //       if (response) if (console) console.log('Response true received')
  //         else if (console) console.log('Response false received')
  //     }
  //   }
  //   else {
  //     console.log(`Not implemented for message.type ${message.type}`);
  //   }
  // }
  // else if (message.context === 'SeekingAlpha') {
  //   console.log(`Not implemented for context ${message.context}`);
  // }
  // else {
  //   console.log(`Not implemented for context ${message.context}`);
  // }

  if (message.target !== 'background') return;

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
    
    // const response = await chrome.tabs.sendMessage(
    //   activeTabData.tabId,
    //   {
    //     target: 'messageBroker',
    //     context: 'Investing',
    //     type: 'dataRows',
    //     data: [tabsWaitingForData, activeTabData.tabId],
    //     sender: 'background'
    //   });

    // if (response) if (console) console.log('Response true received')
    // else if (console) console.log('Response false received')
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
