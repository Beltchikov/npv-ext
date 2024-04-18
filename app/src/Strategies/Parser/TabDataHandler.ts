import shared from "../../shared";
import { TabDataAndPayload } from "./TabDataAndPayload";

export class TabDataHandler {
    async handle(message: any, sender: any, tabsRequested: Array<TabDataAndPayload>): Promise<Array<TabDataAndPayload>> {
        this.#logMessage(message);

        let senderTabId = shared.getAttributeSafe(
            sender,
            s => s.tab?.id,
            'Unexpected" senderTabId is undefined')

        console.log('tabsRequested');
        console.log(tabsRequested);

        // tabsRequested = tabsRequested.map((tabDataAndPayload) => tabDataAndPayload.tabId === senderTabId
        //     ? { ...tabDataAndPayload, ...{ tabData: this.#payloadFromMessage(message) } }
        //     : tabDataAndPayload);

        tabsRequested = tabsRequested.map((tabDataAndPayload) => {
            // return tabDataAndPayload.tabId === senderTabId
            // ? { ...tabDataAndPayload, ...{ tabData: this.#payloadFromMessage(message) } }
            // : tabDataAndPayload
            if (tabDataAndPayload.tabId === senderTabId) {
                let payload = this.#payloadFromMessage(message);
                
                console.log('payload');
                console.log(payload);
                
                tabDataAndPayload = { ...tabDataAndPayload, ...{ tabData: this.#payloadFromMessage(message) } }
            }
            return tabDataAndPayload;
        });

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
                this.#buildMessageToDialog(message, cummulatedDataArray));

            if (response) {
                console.log(`Message to dialog on tab id ${activeTabData.tabId} successfully sent.`);
                return tabsRequested;
            } else {
                console.log(`Error sending message to dialog on tab id ${activeTabData.tabId}.`);
                return tabsRequested;
            }
        };

        return tabsRequested;
    }

    #logMessage(message: any) {
        console.log(`message of type ${message.type} received:`);
        console.log(message);
    }

    #payloadFromMessage = (message: any) => {
        return message.tabData.rows.map((r: { cells: any; }) => r.cells);
    }

    #buildMessageToDialog = (message: any, cummulatedDataArray: Array<Array<string>>) => {
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
}