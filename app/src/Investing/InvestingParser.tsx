import { ReactNode } from "react";
import { IInvestingParser } from "./IInvestingParser";

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
        return 'TA TODO';
    }
}