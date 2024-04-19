import shared from "../../shared";
import { TabDataAndPayload } from "./TabDataAndPayload";

export class EntryHandler {
    async handle(message: any, sender: any, tabsRequested: Array<TabDataAndPayload>): Promise<Array<TabDataAndPayload>> {
        return new Promise((resolve, reject) => {
            shared.logMessageAndObject(`EntryHandler: message received:`, message);
            tabsRequested = tabsRequested ?? new Array<TabDataAndPayload>();

            chrome.tabs.query({ lastFocusedWindow: true })
                .then(tabs => {
                    //tabsRequested = new Array<TabDataAndPayload>();

                    // tabs.map(t => {
                    //     let tId = shared.getAttributeSafe(t, (t) => t.id, 'Unexpected" tabId is undefined');
                    //     return tabsRequested.push(new TabDataAndPayload(tId, t.active, undefined))
                    // });
                    tabs.forEach(t => {
                        let tId = shared.getAttributeSafe(t, t => t.id, 'Unexpected" tabId is undefined');
                        let tabDataAndPayload = new TabDataAndPayload(tId, t.active, undefined)
                        tabsRequested.push(tabDataAndPayload)
                    });

                    // execute parser.js for every tab
                    for (var i = 0; i < tabs.length; i++) {
                        let tabId = shared.getAttributeSafe(tabs[i], (t) => t.id, 'Unexpected" tabId is undefined')

                        chrome.scripting
                            .executeScript({
                                target: { tabId: tabId },
                                files: ['parser.bundle.js']
                            })
                            .then(r => {
                                shared.logMessageAndObject(`EntryHandler: parser for tab ${tabId} executed. Result:`, r);
                            })
                            .catch(e => {
                                let msg = 'EntryHandler: error executing parser'
                                shared.logMessageAndObject(`${msg} for tab ${tabId}. Error:`, e);
                                throw new Error(msg);
                            });
                    }
                    resolve(tabsRequested)
                })
                .catch(e => reject(e));

            resolve(tabsRequested)
        })


    }
}