import shared from "./shared";
import * as investingParser from "./Investing/InvestingParser"

(async function starter() {
    if (shared.localHostOrInvesting()) {
        var dataRow = investingParser.getDataRow();
        if (console) console.log('dataRow parser : ' + dataRow);
        await chrome.runtime.sendMessage({ type: 'dataRow', data: dataRow, sender: 'parser' });
    }
    else {
        await chrome.runtime.sendMessage({ type: 'dataRow', data: "NOT IMPLEMENTED", sender: 'parser' });
    }
})();
