// service worker

import * as investingParser from './investingParser.bundle.js'
import * as seekingAlphaParser from './seekingAlphaParser.bundle.js'
import * as shared from './shared.bundle.js'

chrome.action.onClicked.addListener(async (currentTab) => {

  chrome.tabs.query({ lastFocusedWindow: true })
    .then(tabs => {
      for (var i = 0; i < tabs.length; i++) {
        var tabId = tabs[i].id;
        debugger;

        // Execute parser.js content script
        chrome.scripting
          .executeScript({
            target: { tabId: tabId},
            files: ['investingParser.bundle.js']
          })
          .then(injectionResults => {
            debugger;
          })
          .catch((err)=>{
            debugger;
          });

      }
    })
    .catch(e => sendResponse({ err: e.message }));

  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['content.bundle.js']
  });
});

function investingParser_getDataRow() {
  return investingParser.getDataRow;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

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

  if (message === 'get-tabs-info') {
    chrome.tabs.query({ active: false, lastFocusedWindow: true })
      .then((r) => sendResponse({ data: r }))
      .catch(e => sendResponse({ err: e.message }));
    return true;
  }

});
