import shared from "../shared";
import IParser from "./IParser";
import { TabData } from "./TabData";

export class SeekingAlphaParser implements IParser{
    
    
    
    getTabDataAsync(): Promise<TabData> {
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
        var symbol: string = this.getSymbol();
        var sector: string = this.getDataViaCommonParentCompanyProfileSector('Sector');
        var industry: string = this.getDataViaCommonParentCompanyProfileIndustry('Industry');
        var eps: string = this.getDataViaCommonParentCardItem('EPS (FWD)');
        var div: string = this.getDividends('Latest Announced Dividend').toString();
        var roe: string = this.getRoe('Return on Equity');
        var beta: string = this.getDataViaCommonParentCardItem('24M Beta');
        var divFrequency: string = this.divFrequency();
    
        //return [symbol, sector, industry, eps, div, roe, beta];  // TODO evtl. for later
        //return ([eps, div, roe, beta]).toString().split(',');
    
        var resultRow = ([symbol, eps, div, roe, beta, divFrequency]).map((e) => this.formatString(e, 2));
        let header = ["Symbol","EPS","DIV","ROE","Beta", "DivFreq"]
        let footer = ``;
        return new TabData([resultRow], header, footer);
    }

    private getDataViaCommonParentCardItem(targetElementText: string): string {
        var result: string = '';
        const divStringWithError = shared.dataFromHtmlViaCommonParent(
            document.body.innerHTML,
            'div',
            targetElementText,
            'div[data-test-id="card-item"]',
            'div[data-test-id="value-title"]');
        if (divStringWithError.error !== null) result = divStringWithError.error
        else if (divStringWithError.value == null) alert('UNEXPECTED: both value and error are null')
        else result = divStringWithError.value;
        return result.replace(',', '').replace('$', '');
    }
    
    private getDataViaCommonParentCompanyProfileIndustry(targetElementText: string): string {
        var result: string = '';
        const divStringWithError = shared.dataFromHtmlViaCommonParent(
            document.body.innerHTML,
            'div',
            targetElementText,
            'div[data-test-id="company-profile-industry"]',
            'div[data-test-id="value-title"]');
        if (divStringWithError.error !== null) result = divStringWithError.error
        else if (divStringWithError.value == null) alert('UNEXPECTED: both value and error are null')
        else result = divStringWithError.value;
        return result.replace(',', '').replace('$', '');
    }
    
    private getDataViaCommonParentCompanyProfileSector(targetElementText: string): string {
        var result: string = '';
        const divStringWithError = shared.dataFromHtmlViaCommonParent(
            document.body.innerHTML,
            'div',
            targetElementText,
            'div[data-test-id="company-profile-sector"]',
            'div[data-test-id="value-title"]');
        if (divStringWithError.error !== null) result = divStringWithError.error
        else if (divStringWithError.value == null) alert('UNEXPECTED: both value and error are null')
        else result = divStringWithError.value;
        return result.replace(',', '').replace('$', '');
    }
    
    private getSymbol(): string {
        var result: string = '';
        const divStringWithError = shared.dataFromHtmlViaParent(
            document.body.innerHTML,
            'div[data-test-id="symbol-name"]',
            'span:not([data-test-id="symbol-full-name"],[data-test-id="symbol-sub-title"])');
        if (divStringWithError.error !== null) result = divStringWithError.error
        else if (divStringWithError.value == null) alert('UNEXPECTED: both value and error are null')
        else result = divStringWithError.value;
        return result.replace(',', '').replace('$', '');
    }
    
    private getDividendsAsString(targetElementText: string): string {
        var div = this.getDataViaCommonParentCardItem(targetElementText);
        if (div === 'target element not found') {
            return '0';
        }
        return div;
    
    }

    private getDividends(targetElementText: string): number {
        var lastAnnouncedDividendsAsString = this.getDividendsAsString(targetElementText);
        var lastAnnouncedDividends = parseFloat(lastAnnouncedDividendsAsString);
        var dividendFrequency = this.divFrequency();
        var annualDiv: number = this.CalculateAnnualDividends(lastAnnouncedDividends, dividendFrequency);

        return annualDiv;
    }
    CalculateAnnualDividends(lastAnnouncedDividends: number, dividendFrequency: string): number {
        var dividendFrequencyUpper = dividendFrequency.toUpperCase();

        switch(dividendFrequencyUpper)
        {
            case 'MONTHLY': return lastAnnouncedDividends*12;
            case 'QUARTERLY': return lastAnnouncedDividends*4;
            case 'SEMIANNUAL': return lastAnnouncedDividends*2;
            case 'ANNUAL': return lastAnnouncedDividends;
            case 'TARGET ELEMENT NOT FOUND': return 0;
            default: throw new Error(`Not implemented for dividend frequency ${dividendFrequency}`);
        }
    }
    
    private getRoe(targetElementText: string): string {
        var roeInPercent = this.getDataViaCommonParentCardItem(targetElementText);
        var roeInPercentFloat = parseFloat(roeInPercent);
        if (isNaN(roeInPercentFloat)) {
            return 'ROE is NaN';
        }
    
        return (roeInPercentFloat / 100).toFixed(4)
    }

    // TODO to be replaced by getFooter
    private divFrequency(): string {
        return this.getDataViaCommonParentCardItem('Frequency');
    }
    
    private getHeader(): string {
        return "EPS DIV ROE Beta Date";
    }
    
    private formatString(e: string, decimalPlaces: number): string {
        var floatResult = parseFloat(e);
        if (isNaN(floatResult)) {
            return e;
        }
        return floatResult.toLocaleString('de', { minimumFractionDigits: decimalPlaces });
    }
}


