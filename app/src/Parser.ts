import shared from "./shared";
import * as investingParser from "./Investing/InvestingParser"
import * as seekingAlphaParser from "./SeekingAlpha/SeekingAlphaParser"

(async function starter() {
    if (shared.localHostOrInvesting()) {
        var dataRow = investingParser.getDataRow();
        if (console) console.log('dataRow investingParser : ' + dataRow);
        await chrome.runtime.sendMessage({ context:'Investing' ,type: 'dataRow', data: dataRow, sender: 'parser' });
    }
    else if (shared.localHostOrSeekingAlpha()) {
        var dataRow = seekingAlphaParser.getDataRow();
        if (console) console.log('dataRow seekingAlphaParser : ' + dataRow);
        await chrome.runtime.sendMessage({ context:'SeekingAlpha' ,type: 'dataRow', data: dataRow, sender: 'parser' });
    }
    else {
        await chrome.runtime.sendMessage({ context:'Unknown', type: 'dataRow', data: "NOT IMPLEMENTED", sender: 'parser' });
    }
})();
