import shared from "../shared";
import IParser from "./IParser";
import { TabData } from "./TabData";

export class InvestingParser implements IParser{
    
    getDataRowAsync(): Promise<TabData> {
       return new Promise((resolve, reject)=>{
        try{
        resolve(this.getDataRow());
        }
        catch(e)
        {
            reject(e);
        }
       });
    }

    private getDataRow(): TabData {
        const symbol = this.getSymbol();
        const taBefore = 'taBefore';
        const ta = this.getTa('TODO');
        const earnBefore = 'earnBefore';
        const earn = 'earn';
    
        //return ([symbol, taBefore, ta, earnBefore, earn]).toString().split(',');
        //return ([symbol, ta]).toString().split(',');
        return new TabData([[symbol, ta]]);
    }

    private getSymbol(): string {
        var result: string = 'SYMBOL';
    
        const h1StringWithError = shared.dataFromHtmlByTagAndTextContains(
            document.body.innerHTML,
            "h1");
    
        if (h1StringWithError.error !== null) result = h1StringWithError.error
        else if (h1StringWithError.value == null) alert('UNEXPECTED: both value and error are null')
        else result = h1StringWithError.value;
    
        const re = new RegExp("(?:\\()(\\w+)");
        var resultRegEx = re.exec(result);
        if (resultRegEx === null) return "getSymbol: RegExpMatchArray is null"
        else return resultRegEx[1];
    }
    
    private getTa(targetElementText: string): string {
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

}

// Example execution context
// if (location.protocol == 'chrome-extension:') {
//     if (console) console.log('chrome-extension ');
// }
// else {
//     if (console) console.log('content script ');
// }

