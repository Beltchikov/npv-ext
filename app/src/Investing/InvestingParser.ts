import shared from "../shared";

function getTa(targetElementText: string): string {
    var result: string = '';
    const divStringWithError = shared.dataFromHtmlViaParent(
        document.body.innerHTML,
        "div[class*='analyst-price-target_gaugeView']",
        "div:not([class*='analyst-price-target'])");
    if (divStringWithError.error !== null) result = divStringWithError.error
    else if (divStringWithError.value == null) alert('UNEXPECTED: both value and error are null')
    else result = divStringWithError.value;
    return result.replace(',', '').replace('$', '');
}

export function getDataRow(): Array<string> {
    const symbol = 'symbol';
    const taBefore = 'taBefore';
    const ta = getTa('TODO');
    const earnBefore = 'earnBefore';
    const earn = 'earn';

    return ([symbol, taBefore, ta, earnBefore, earn]).toString().split(',');
}

(async function starter() {

    if (location.protocol == 'chrome-extension:') {
        if (console) console.log('chrome-extension ');
    }
    else {
        if (console) console.log('content script ');
    }

    try {
        var dataRow = getDataRow();
        //var dataRow = 'test data row';
        if (console) console.log('dataRow: ' + dataRow);

        const response = await chrome.runtime.sendMessage({ type: 'dataRows', data: dataRow });
    }
    catch (e) { }
})();

