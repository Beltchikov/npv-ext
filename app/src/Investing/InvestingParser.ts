import shared from "../shared";

export function getDataRow(): Array<string> {
    const symbol = getSymbol();
    const taBefore = 'taBefore';
    const ta = getTa('TODO');
    const earnBefore = 'earnBefore';
    const earn = 'earn';

    return ([symbol, taBefore, ta, earnBefore, earn]).toString().split(',');
}

function getSymbol(): string {
    var result: string = 'SYMBOL';

    // <h1 class="mb-2.5 text-left text-xl font-bold leading-7 text-[#232526] md:mb-2 md:text-3xl md:leading-8 rtl:soft-ltr">
    //                                     Amazon.com Inc (AMZN)</h1>


    // const divStringWithError = shared.dataFromHtmlViaCommonParent(
    //     document.body.innerHTML,
    //     'div',
    //     targetElementText,
    //     'div[data-test='main-header']',,
    //     'div[data-test-id="value-title"]');

    const h1StringWithError = shared.dataFromHtmlByTagAndTextContains(
        document.body.innerHTML,
        "h1");

    if (h1StringWithError.error !== null) result = h1StringWithError.error
    else if (h1StringWithError.value == null) alert('UNEXPECTED: both value and error are null')
    else result = h1StringWithError.value;
    //return result.replace(',', '').replace('$', '');
    return result.substring(0,20);
}

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


// Example execution context
// if (location.protocol == 'chrome-extension:') {
//     if (console) console.log('chrome-extension ');
// }
// else {
//     if (console) console.log('content script ');
// }

