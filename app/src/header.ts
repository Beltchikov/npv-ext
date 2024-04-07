(function starter() {
    console.log(`header.ts`);

    chrome.runtime.sendMessage({
        target: 'background',
        context: window.location.hostname,
        type: 'header',
        data: "todo",
        sender: 'parser'
    })
    .then((_r=>"Header message sent succcessfully."))
    .catch(e => `Error sending header message. Reason: ${e}`);

})();

export {}