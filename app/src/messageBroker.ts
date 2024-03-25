import * as shared from './shared'

var activeTabId: number = -1;

async function Investing(message: any) {
    switch (message.type) {
        case 'dataRows':
            const response = await chrome.runtime.sendMessage(
                { target: 'dialog', type: message.type, context: message.context, data: message.data[0], sender: message.sender });
            console.log(`Response ${response} received`)
            break;
        default:
            console.log(`Not implemented for message.context ${message.context} message.type ${message.type}`);

    }
}

async function SeekingAlpha(message: any) {
    switch (message.type) {
        case 'dataRow':
            case 'dataRows':
            const response = await chrome.runtime.sendMessage(
                { target: 'dialog', type: message.type, context: message.context, data: message.data[0], sender: message.sender });
            console.log(`Response ${response} received`)
            break;
        default:
            console.log(`Not implemented for message.context ${message.context} message.type ${message.type}`);

    }
}

(function starter() {
    chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
        if (message.target !== 'messageBroker') return;

        activeTabId = message.data[1];
        console.log(`messageBroker on the tab ${activeTabId}`);

        switch (message.context) {
            case 'Investing':
                Investing(message);
                break;
            case 'SeekingAlpha':
                SeekingAlpha(message);
                break;
            default:
                console.log(`Not implemented for message.context ${message.context}`);
        }



    });

})();




