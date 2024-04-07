import { parserMap } from "./Parsers/parserMap";

// To update the extension for a nes hostname:
//  1. Write new parser
//  2. Update parserMap.ts

(async function starter() {
    var dataRow = [];
    
    var hostMapEntry = parserMap.filter((e) => e.hostname === window.location.hostname);
    if (hostMapEntry.length !== 1) 
        throw new Error(`hostMapEntry is not proper defined for ${window.location.hostname}`);

    var parser = hostMapEntry[0].parser;
    dataRow = parser.getDataRow();

    await chrome.runtime.sendMessage({
        target: 'background',
        context: window.location.hostname,
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
