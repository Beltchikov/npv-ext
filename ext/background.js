import { loadScripts } from './loader.js';

// service worker
class TabDataAndPayload {
  constructor(tabId, activeTab, dataTable) {
    this.tabId = tabId;
    this.activeTab = activeTab;
    this.dataTable = dataTable;
  }
}
var tabsRequestedForData = [];

// entry point
chrome.action.onClicked.addListener(async (currentTab) => {

  loadScripts(currentTab);

  // query tabs
  chrome.tabs.query({ lastFocusedWindow: true })
    .then(tabs => {
      tabsRequestedForData = [];
      tabs.map((t) => {
        // TODO introduce class
        //tabsRequestedForData.push({ tabId: t.id, activeTab: t.active, dataTable: undefined })
        tabsRequestedForData.push(new TabDataAndPayload(t.id, t.active, undefined));
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
    dataTable: cummulatedDataArray,
    sender: 'background'
  };
  return messageToDialog;
}

const payloadFromMessage = (message) => {

  // if shape.length===3
  // 

  return message.dataTable;
}

function getShape(matrix, dimensions = []) {
  // displays max value in case of jagged array
  if (Array.isArray(matrix)) {
    dimensions.push(matrix.length);
    return getShape(matrix[0], dimensions);
  } else return dimensions;
}

// message listener
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

  if (message.target !== 'background') return;

  if (message.type === 'dataTable') {

    console.log('data table from tab');
    console.log(message.dataTable);

    // tabsRequestedForData = tabsRequestedForData.map((tabDataAndPayload) => tabDataAndPayload.tabId === sender.tab.id
    //   ? { ...tabDataAndPayload, ...{ dataTable: message.dataTable } }
    //   : tabDataAndPayload);
    tabsRequestedForData = tabsRequestedForData.map((tabDataAndPayload) => tabDataAndPayload.tabId === sender.tab.id
      ? { ...tabDataAndPayload, ...{ dataTable: payloadFromMessage(message) } }
      : tabDataAndPayload);

    var tabsStillWaitingForData = tabsRequestedForData.filter((t) => t.dataTable == undefined);
    if (tabsStillWaitingForData.length === 0) {
      var activeTabData = tabsRequestedForData.filter((t) => t.activeTab)[0];

      console.log('tabsRequestedForData');
      console.log(tabsRequestedForData);

      //var cummulatedDataArray = tabsRequestedForData.map((t) => t.dataTable.rows);
      let cummulatedDataRows = tabsRequestedForData.map(dt => dt.dataTable.rows);

      var cummulatedDataArray = [[], []];
      for (var i = 0; i < cummulatedDataRows.length; i++) {
        let row = cummulatedDataRows[i];

        console.log('row');
        console.log(row);

        let cells = [];
        cells = row.map(r=>r.cells);

        console.log('cells');
        console.log(cells);

        for (var ii = 0; ii < cells.length; ii++) {
          let cell = cells[ii];
          cummulatedDataArray[i][ii] = cell;
        }
      }


      console.log(`cummulatedDataArray`);
      console.log(cummulatedDataArray);

      let shape = getShape(cummulatedDataArray)
      console.log('shape cummulatedDataArray');
      console.log(shape);

      console.log(`Sending message to dialog on tab id ${activeTabData.tabId}`);
      const response = await chrome.tabs.sendMessage(
        activeTabData.tabId,
        buildMessageToDialog(message.context, cummulatedDataArray));

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
