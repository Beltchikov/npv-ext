var activeTabId = -1;

async function Investing(message) {
    switch (message.type) {
        case 'dataRows':
            const response = await chrome.tabs.sendMessage(activeTabId,
                { target: 'dialog', type: message.type, context: message.context, data: message.data[0], sender: message.sender });
            console.log(`Response ${response} received`)
            break;
        default:
            console.log(`Not implemented for message.context ${message.context} message.type ${message.type}`);

    }
}

async function SeekingAlpha(message) {
    switch (message.type) {
        case 'dataRow':
            case 'dataRows':
            const response = await chrome.tabs.sendMessage(activeTabId,
                { target: 'dialog', type: message.type, context: message.context, data: message.data[0], sender: message.sender });
            console.log(`Response ${response} received`)
            break;
        default:
            console.log(`Not implemented for message.context ${message.context} message.type ${message.type}`);

    }
}

export async function handleMessage(message) {
    activeTabId = message.data[1];
    console.log(`messageBroker on the tab ${activeTabId}`);

    var data2dArray = message.data[0].map((e)=> e.data);
    console.log(data2dArray);

    // switch (message.context) {
    //     case 'Investing':
    //         Investing(message);
    //         break;
    //     case 'SeekingAlpha':
    //         SeekingAlpha(message);
    //         break;
    //     default:
    //         console.log(`Not implemented for message.context ${message.context}`);
    // }

    const response = await chrome.tabs.sendMessage(activeTabId,
        { target: 'dialog', type: message.type, context: message.context, data: data2dArray, sender: message.sender });
    console.log(`messageBroker: Response ${response} received`)
};