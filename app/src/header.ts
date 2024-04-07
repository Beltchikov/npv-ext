(function starter() {
    console.log(`header.ts`);

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.target !== 'header') return;

        

        sendResponse(true);
    });
})();

export {}