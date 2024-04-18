import shared from "../../shared";
import { IStrategy } from "../IStrategy";
import { TabDataAndPayload } from "./tabDataAndPayload";


export class ParserStrategy implements IStrategy
{
    tabsRequested:Array<TabDataAndPayload> = [];
    
    addMessageListener(): void {
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

        if (message.target !== 'background') return;
    
        if (message.type === 'tabData') {
            this.logMessage(message);
   
            let senderTabId = shared.getAttributeSafe(
                sender, 
                s=>s.tab?.id, 
                'Unexpected" senderTabId is undefined')

                this.tabsRequested = this.tabsRequested.map((tabDataAndPayload) => tabDataAndPayload.tabId === senderTabId
            ? { ...tabDataAndPayload, ...{ tabData: this.payloadFromMessage(message) } }
            : tabDataAndPayload);
        var tabsStillWaitingForData = this.tabsRequested.filter((t) => t.tabData === undefined);
    
        if (tabsStillWaitingForData.length === 0) {
            var activeTabData = this.tabsRequested.filter((t) => t.activeTab)[0];
    
            console.log('tabsRequested');
            console.log(this.tabsRequested);
    
            let cummulatedDataArray: Array<Array<string>> = this.tabsRequested
            .map(dt => {
                if (!dt) throw Error("Unexpected. dt is undefined");
                else return dt?.tabData as Array<Array<string>>})
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
            this.buildMessageToDialog(message, cummulatedDataArray));
    
            if (response) console.log(`Message to dialog on tab id ${activeTabData.tabId} successfully sent.`)
            else console.log(`Error sending message to dialog on tab id ${activeTabData.tabId}.`)
        };
        }
        else if (message.type === 'strategyEntry') {
            this.logMessage(message);
            chrome.tabs.query({ lastFocusedWindow: true })
              .then(tabs => {
                this.tabsRequested = new Array<TabDataAndPayload>();
                tabs.map(t => {
                    let tId = shared.getAttributeSafe(t, (t)=>t.id, 'Unexpected" tabId is undefined');
                    return this.tabsRequested.push(new TabDataAndPayload(tId, t.active, undefined))});
            
                // execute parser.js for every tab
                for (var i = 0; i < tabs.length; i++) {
                    let tabId = shared.getAttributeSafe(tabs[i], (t)=>t.id, 'Unexpected" tabId is undefined')
                  
                  chrome.scripting
                    .executeScript({
                      target: { tabId: tabId },
                      files: ['parser.bundle.js']});
                }
              })
              .catch(e => console.log({ err: e.message }));
        }
        else {
        throw new Error(`Not implemented for message type ${message.type}`);
        }
    
        sendResponse(true);
        });
    }

    private buildMessageToDialog = (message: any, cummulatedDataArray:Array<Array<string>>) => {
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
      
      private payloadFromMessage = (message:any) => {
        return message.tabData.rows.map((r: { cells: any; }) => r.cells);
      }

      private logMessage(message: any) {
        console.log(`message of type ${message.type} received:`);
        console.log(message);
    }
}