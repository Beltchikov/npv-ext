export async function messageToBrockerAsync(tabId:number, context:string, type:string, data:any, sender:string)
{
    console.log('messageToBrockerAsync');
    return  await chrome.tabs.sendMessage(tabId, {context: context, type: type, data: data, sender: sender });
}

(function starter() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        console.log('messageBroker');
    });

})();