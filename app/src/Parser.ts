import shared from "./shared";
import * as investingParser from "./Investing/InvestingParser"
import * as seekingAlphaParser from "./SeekingAlpha/SeekingAlphaParser"

(async function starter() {

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

    if (shared.localHostOrInvesting()) {
        var dataRow = investingParser.getDataRow();
        if (console) console.log('dataRow investingParser : ' + dataRow);
        await chrome.runtime.sendMessage({ target: 'background', context: 'Investing', type: 'dataRow', data: dataRow, sender: 'parser' });
    }
    else if (shared.localHostOrSeekingAlpha()) {
        var dataRow = seekingAlphaParser.getDataRow();
        if (console) console.log('dataRow seekingAlphaParser : ' + dataRow);
        await chrome.runtime.sendMessage({ target: 'background', context: 'SeekingAlpha', type: 'dataRow', data: dataRow, sender: 'parser' });
    }
    else {
        await chrome.runtime.sendMessage({ target: 'background', context: 'Unknown', type: 'dataRow', data: "NOT IMPLEMENTED", sender: 'parser' });
    }
})();
