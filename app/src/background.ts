import { loadScripts } from './loader';
import * as shared from "./shared"
import { NetBmsStrategy } from './Strategies/NetBms/NetBmsStrategy';
import { ParserStrategy } from './Strategies/Parser/ParserStrategy';
import { StrategyContext } from './Strategies/StrategyContext';

const strategyMap = [
    { hostname: "www.investing.com", strategy: new ParserStrategy() },
    { hostname: "seekingalpha.com", strategy: new ParserStrategy() },
    { hostname: "twitter.com", strategy: new ParserStrategy() },
    { hostname: "openai.com", strategy: new NetBmsStrategy() },    
];

let hostname = "TO BE RETRIEVED";

chrome.action.onClicked.addListener(tempListener);

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
        // console.log('removing temporary listener')
        // chrome.action.onClicked.removeListener(tempListener);

        // let hasListener =chrome.action.onClicked.hasListener(tempListener);
        // if(!hasListener) console.log('temporary click listener removed.')
        // else console.log('error while removing temporary click listener.')

        // send message type strategyEntry
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

        //
        //chrome.action.onClicked.addListener(tempListener);

    }
}



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
  

