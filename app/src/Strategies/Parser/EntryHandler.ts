import shared from "../../shared";
import { TabDataAndPayload } from "./TabDataAndPayload";

export class EntryHandler {
    async handle(message: any, sender: any, tabsRequested: Array<TabDataAndPayload>): Promise<Array<TabDataAndPayload>> {
        this.#logMessage(message);

        return new Promise((resolve, reject) => {
            chrome.tabs.query({ lastFocusedWindow: true })
                .then(tabs => {
                    //tabsRequested = new Array<TabDataAndPayload>();

                    tabs.map(t => {
                        let tId = shared.getAttributeSafe(t, (t) => t.id, 'Unexpected" tabId is undefined');
                        return tabsRequested.push(new TabDataAndPayload(tId, t.active, undefined))
                    });

                    console.log(`tabsRequested`);
                    console.log(tabsRequested);

                    // execute parser.js for every tab
                    for (var i = 0; i < tabs.length; i++) {
                        let tabId = shared.getAttributeSafe(tabs[i], (t) => t.id, 'Unexpected" tabId is undefined')

                        chrome.scripting
                            .executeScript({
                                target: { tabId: tabId },
                                files: ['parser.bundle.js']
                            });
                    }
                    resolve(tabsRequested)
                })
                .catch(e => reject(e));

                resolve(tabsRequested)
        })


    }

    #logMessage(message: any) {
        console.log(`message of type ${message.type} received:`);
        console.log(message);
    }

}