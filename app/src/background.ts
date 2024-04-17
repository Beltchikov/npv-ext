import { loadScripts } from './loader';
import * as shared from "./shared"
import { TabDataAndPayload } from './tabDataAndPayload';

interface IStrategy
{
    addClickListener():void;
    addMessageListener():void;
}

class StrategyContext
{
    private strategy!: IStrategy;
    
    setStrategy(strategy: IStrategy) {
        this.strategy = strategy;
    }
    execute() {
        this.strategy.addClickListener();
        this.strategy.addMessageListener();
    }

}


class ParserStrategy implements IStrategy
{
    tabsRequested:Array<TabDataAndPayload> = [];
    
    addClickListener() {
        chrome.action.onClicked.addListener(async (currentTab) => {
            loadScripts(currentTab);
        
            // query tabs
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
        
        });
    }
    addMessageListener(): void {
        // message listener
    chrome.runtime.onMessage.addListener(async (messageFromParser, sender, sendResponse) => {

        if (messageFromParser.target !== 'background') return;
    
        if (messageFromParser.type === 'tabData') {
        console.log(`message of type tabData received:`);
        console.log(messageFromParser);
            let senderTabId = shared.getAttributeSafe(
                sender, 
                s=>s.tab?.id, 
                'Unexpected" senderTabId is undefined')

                this.tabsRequested = this.tabsRequested.map((tabDataAndPayload) => tabDataAndPayload.tabId === senderTabId
            ? { ...tabDataAndPayload, ...{ tabData: this.payloadFromMessage(messageFromParser) } }
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
            this.buildMessageToDialog(messageFromParser, cummulatedDataArray));
    
            if (response) console.log(`Message to dialog on tab id ${activeTabData.tabId} successfully sent.`)
            else console.log(`Error sending message to dialog on tab id ${activeTabData.tabId}.`)
        };
        }
        else {
        throw new Error(`Not implemented for message type ${messageFromParser.type}`);
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
}

class NetBmsStrategy implements IStrategy
{
    addClickListener() {
        throw new Error('Method not implemented.');
    }
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
// 
let hostname = "UNKNOWN";
function tempListener(currentTab:chrome.tabs.Tab)
    {
        let regExp = new RegExp(/(?:\/{2})(\w+\.{1}\w+)/);
        let url = currentTab.url;
        
        if(url){
            var regExpArr = regExp.exec(url);
            if(regExpArr) hostname = regExpArr[1];}
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
  

