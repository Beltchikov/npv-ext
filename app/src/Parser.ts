import shared from "./shared";
import * as investingParser from "./Investing/InvestingParser"
import * as seekingAlphaParser from "./SeekingAlpha/SeekingAlphaParser"
import { hostname } from "os";

(async function starter() {
    var dataRow = [];
    var context = "Unknown";

    var hostMap = [
        {name: "www.investing.com", parser: investingParser},
        {name: "seekingalpha.com", parser: seekingAlphaParser},
    ];


    if (shared.localHostOrInvesting()) {
        dataRow = investingParser.getDataRow();
        context = "www.investing.com";
        console.log(window.location.hostname);
    }
    else if (shared.localHostOrSeekingAlpha()) {
        dataRow = seekingAlphaParser.getDataRow();
        context = "seekingalpha.com";
        console.log(window.location.hostname);
    }
    else {
        console.log(window.location.hostname);
        dataRow = [`NOT IMPLEMENTED! for ${window.location.hostname}`];
    }

    await chrome.runtime.sendMessage({
        target: 'background',
        context: context,
        type: 'dataRow',
        data: dataRow,
        sender: 'parser'
    });
})();

// Example DOM changes observer

// console.log('collector:');
// const collector = document.getElementById('collector');
// console.log(collector);

// // Observer
// let observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//         let oldValue = mutation.oldValue;
//         let newValue = mutation.target.textContent;
//         if (oldValue !== newValue) {
//             console.log(`oldValue: ${oldValue}  mutation.target: ${mutation.target}`);
//         }
//     });
// });

// if (collector)
//     observer.observe(collector, {
//         characterDataOldValue: true,
//         subtree: true,
//         childList: true,
//         characterData: true
//     });
