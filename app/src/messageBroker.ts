(function starter() {
    chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
        if (message.target !== 'broker') return;

        console.log(`message with target broker received:`);
        console.log(message);
        console.log(`sender:`);
        console.log(sender);

        var messageToServiceWorker = {...message, ...{target:'background', sender:'broker'}};

        console.log(`sending message of type hostname to service worker:`);
        console.log(messageToServiceWorker);

        await chrome.runtime.sendMessage(messageToServiceWorker);
        sendResponse(true);
    });
})();

export {}