import shared from "./shared";

export async function loadScripts(currentTab: chrome.tabs.Tab): Promise<boolean> {
    let currentTabId = currentTab?.id;
    if (!currentTabId) throw Error('Unexpected" currentTabId is undefined');

    let resultBroker = chrome.scripting.executeScript({
        target: { tabId: currentTabId },
        files: ['messageBroker.bundle.js']
    });

    let resultDialog = chrome.scripting.executeScript({
        target: { tabId: currentTabId },
        files: ['dialog.bundle.js']
    });

    var promises = [ resultBroker, resultDialog];
    return await Promise.all(promises)
        .then(_values => true)
        .catch(e => {
            shared.logMessageAndObject(`loader.ts: error while loading scripts:`, e);
            return false;
        });
}