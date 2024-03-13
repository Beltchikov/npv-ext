import { ReactNode } from "react";
import { IInvestingParser } from "./IInvestingParser";
import shared from "../shared";

export class InvestingParser implements IInvestingParser
{
    getDataRow(): ReactNode {
        const symbol = 'symbol';
        const taBefore = 'taBefore';
        const ta = this.getTa('TODO');
        const earnBefore = 'earnBefore';
        const earn = 'earn';
        
        return [symbol, taBefore, ta, earnBefore, earn];
    }
    getTa(targetElementText: string): string {
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