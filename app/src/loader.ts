export function loadScripts(currentTab:chrome.tabs.Tab) {
    let currentTabId = currentTab?.id;
    if(!currentTabId) throw Error('Unexpected" currentTabId is undefined');

    // start react app
    chrome.scripting.executeScript({
        target: { tabId: currentTabId },
        files: ['content.bundle.js']
    }).then(_r => console.log('React app npv-ext-app in file content.bundle.js started successfullly.'))
    .catch(e => `Error starting react app npv-ext-app in file content.bundle.js. Reason: ${e}`);

    // execute dialog.bundle.js
    chrome.scripting.executeScript({
        target: { tabId: currentTabId },
        files: ['dialog.bundle.js']
    }).then(_r => console.log('Script dialog.bundle.js executed'))
        .catch(e => `Error executing script dialog.bundle.js. Reason: ${e}`);
}