import { loadScripts } from './loader';
import * as shared from "./shared"
import { TabDataAndPayload } from './tabDataAndPayload';

interface IStrategy {
    addMessageListener():void;
}

class StrategyContext {
    private strategy!: IStrategy;
    
    setStrategy(strategy: IStrategy) {
        this.strategy = strategy;
    }
    execute() {
        this.strategy.addMessageListener();
    }
}

class ParserStrategy implements IStrategy
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

class NetBmsStrategy implements IStrategy
{
    addMessageListener(): void {
        throw new Error('Method not implemented.');
    }
}



const strategyMap = [
    { hostname: "www.investing.com", strategy: new ParserStrategy() },
    { hostname: "seekingalpha.com", strategy: new ParserStrategy() },
    { hostname: "twitter.com", strategy: new NetBmsStrategy() },
];

////////////////////
let hostname = "UNKNOWN";
function tempListener(currentTab:chrome.tabs.Tab)
{
    loadScripts(currentTab);
    
    let regExp = new RegExp(/(?:\/{2})(\w+\.{1}\w+)/);
    var url = shared.getAttributeSafe(currentTab, t=>t.url, "Unexpected. currentTab.url is undefined");
    var regExpArr = regExp.exec(url);
    if(regExpArr) hostname = regExpArr[1];
    console.log('hostname')
    console.log(hostname)

    let hasListener =chrome.action.onClicked.hasListener(tempListener);
    if(hasListener) console.log('temporary click listener added.')

    if(hasListener){
        console.log('removing temporary listener')
        chrome.action.onClicked.removeListener(tempListener);

        let hasListener =chrome.action.onClicked.hasListener(tempListener);
        if(!hasListener) console.log('temporary click listener removed.')
        else console.log('error while removing temporary click listener.')

        // TODO send message type strategyEntry
        

        var tabId = shared.getAttributeSafe(currentTab, t=>t.id, "Unexpected. tab.id is undefined");
        console.log(`Sending message to message broker`);
        var messageToBroker = {
            target: 'broker',
            type: 'strategyEntry',
            context: "clickListener",
            sender: 'background'
            };
        chrome.tabs.sendMessage(tabId, messageToBroker)
        .then(r => `send message to broker returned ${r}`)
        .catch(e=> console.log(e.message));

        var strategyMapEntry = strategyMap.filter((e) => e.hostname === hostname);
        if (strategyMapEntry.length !== 1) 
            throw new Error(`strategyMapEntry is not proper defined for ${hostname}`);
        let strategy  = strategyMapEntry[0].strategy;

        let context = new StrategyContext();
        context.setStrategy(strategy);
        context.execute();

    }
}

chrome.action.onClicked.addListener(tempListener);


// chrome.runtime.onMessage.addListener(async (messageFromParser, sender, sendResponse) => {
//     if (messageFromParser.target !== 'background') return;
    
//     if (messageFromParser.type === 'hostname') {
//         console.log(`message of type hostname received:`);
//         console.log(hostname);

//     var strategyMapEntry = strategyMap.filter((e) => e.hostname === hostname);
//     if (strategyMapEntry.length !== 1) 
//         throw new Error(`strategyMapEntry is not proper defined for ${hostname}`);
//     let strategy  = strategyMapEntry[0].strategy;

//     let context = new StrategyContext();
//     context.setStrategy(strategy);
//     context.execute();

//     }
// });

////////////////////////



  
  // Example Promise.all
  // if (message === 'get-tabs-info') {
  //   chrome.tabs.query({ active: false, lastFocusedWindow: true })
  //     .then(tabs => {
  //       // TODO get data from each tab (code block below)
  
  //       var promises = [];
  //       for (var i = 0; i < tabs.length; i++) {
  
  //         var promise = chrome.scripting.executeScript({
  //           target: { tabId: tabs[i].id },
  //           func: investingParser_getDataRow
  //         });
  //         promises.push(promise);
  //       }
  
  //       Promise.all(promises)
  //         .then((values) => {
  //           sendResponse({ type: 'data', data: values });
  //         })
  //         .catch((reason) => {
  //           sendResponse({ type: 'error', data: reason.message });
  //         });
  
  //       return true;
  //     })
  //     .catch(e => sendResponse({ err: e.message }));
  //   return true;
  // }
  
  // Example Shape of multidimensional array
  
  // function getShape(matrix, dimensions = []) {
  //   // displays max value in case of jagged array
  //   if (Array.isArray(matrix)) {
  //     dimensions.push(matrix.length);
  //     return getShape(matrix[0], dimensions);
  //   } else return dimensions;
  // }
  

