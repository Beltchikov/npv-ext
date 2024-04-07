import shared from "./shared";
import * as investingParser from "./Investing/InvestingParser"
import * as seekingAlphaParser from "./SeekingAlpha/SeekingAlphaParser"
import { hostname } from "os";

(async function starter() {
    var dataRow = [];
    var context = "Unknown";

    var hostMap = [
        { name: "www.investing.com", parser: investingParser },
        { name: "seekingalpha.com", parser: seekingAlphaParser },
    ];

    var hostMapEntry = hostMap.filter((e) => e.name === window.location.hostname);
    if (hostMapEntry.length !== 1) throw new Error(`hostMapEntry is not proper defined for ${window.location.hostname}`);

    var parser = hostMapEntry[0].parser;
    dataRow = parser.getDataRow();

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
