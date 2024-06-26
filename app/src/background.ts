import { loadScripts } from './loader';
import * as shared from "./shared"
import { TabDataAndPayload } from './Parsers/TabDataAndPayload';

var tabsRequested: Array<TabDataAndPayload> = [];

// add listeners
if (!chrome.action.onClicked.hasListener(onClickedListener))
    chrome.action.onClicked.addListener(onClickedListener);

if (!chrome.runtime.onMessage.hasListener(onMessageListener))
    chrome.runtime.onMessage.addListener(onMessageListener);

function onClickedListener(currentTab: chrome.tabs.Tab) {
    loadScripts(currentTab);

    chrome.tabs.query({ lastFocusedWindow: true })
        .then(tabs => {
            tabsRequested = new Array<TabDataAndPayload>();
            tabs.map(t => {
                let tId = shared.getAttributeSafe(t, (t) => t.id, 'Unexpected" tabId is undefined');
                return tabsRequested.push(new TabDataAndPayload(tId, t.active, undefined))
            });

            // execute parser.js for every tab
            for (var i = 0; i < tabs.length; i++) {
                let tabId = shared.getAttributeSafe(tabs[i], (t) => t.id, 'Unexpected" tabId is undefined')

                chrome.scripting
                    .executeScript({
                        target: { tabId: tabId },
                        files: ['parser.bundle.js']
                    });
            }
        })
        .catch(e => console.log({ err: e.message }));
}

async function onMessageListener(messageFromParser: any, sender: chrome.runtime.MessageSender, sendResponse: (r?: any) => void) {
    if (messageFromParser.target !== 'background') return;

    if (messageFromParser.type === 'tabData') {
        console.log(`message of type tabData received:`);
        console.log(messageFromParser);
        let senderTabId = shared.getAttributeSafe(
            sender,
            s => s.tab?.id,
            'Unexpected" senderTabId is undefined')

        tabsRequested = tabsRequested.map((tabDataAndPayload) => tabDataAndPayload.tabId === senderTabId
            ? { ...tabDataAndPayload, ...{ tabData: payloadFromMessage(messageFromParser) } }
            : tabDataAndPayload);
        var tabsStillWaitingForData = tabsRequested.filter((t) => t.tabData === undefined);

        if (tabsStillWaitingForData.length === 0) {
            var activeTabData = tabsRequested.filter((t) => t.activeTab)[0];

            console.log('tabsRequested');
            console.log(tabsRequested);

            let cummulatedDataArray: Array<Array<string>> = tabsRequested
                .map(dt => {
                    if (!dt) throw Error("Unexpected. dt is undefined");
                    else return dt?.tabData as Array<Array<string>>
                })
                .reduce((r, n) => {
                    if (!r) throw Error("Unexpected. r is undefined");
                    if (!n) throw Error("Unexpected. n is undefined");
                    return r.concat(n)
                });

            console.log('cummulatedDataArray');
            console.log(cummulatedDataArray);

            console.log(`Sending message to dialog on tab id ${activeTabData.tabId}`);
            const response = await chrome.tabs.sendMessage(
                activeTabData.tabId,
                buildMessageToDialog(messageFromParser, cummulatedDataArray));

            if (response) console.log(`Message to dialog on tab id ${activeTabData.tabId} successfully sent.`)
            else console.log(`Error sending message to dialog on tab id ${activeTabData.tabId}.`)
        };
    }
    else {
        throw new Error(`Not implemented for message type ${messageFromParser.type}`);
    }
    sendResponse(true);
}

const buildMessageToDialog = (message: any, cummulatedDataArray: Array<Array<string>>) => {
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

const payloadFromMessage = (message: any) => {
    return message.tabData.rows.map((r: { cells: any; }) => r.cells);
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


