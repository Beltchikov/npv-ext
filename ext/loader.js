export function loadScripts(currentTab) {
    // start react app
    chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        files: ['content.bundle.js']
    }).then(_r => console.log('React app npv-ext-app in file content.bundle.js started successfullly.'))
    .catch(e => `Error starting react app npv-ext-app in file content.bundle.js. Reason: ${e}`);

    // execute dialog.bundle.js
    chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        files: ['dialog.bundle.js']
    }).then(_r => console.log('Script dialog.bundle.js executed'))
        .catch(e => `Error executing script dialog.bundle.js. Reason: ${e}`);

    // execute header.bundle.js
    chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        files: ['header.bundle.js']
    })
        .then(_r => console.log('Script header.bundle.js executed'))
        .catch(e => `Error executing script header.bundle.js. Reason: ${e}`);
}