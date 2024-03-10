import shared from "./shared";
import { ISeekingAlphaParser } from './ISeekingAlphaParser';
import { ReactNode } from "react";

export class SeekingAlphaParser implements ISeekingAlphaParser {
    getDataViaCommonParentCardItem(targetElementText: string): string {
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

    getDataViaCommonParentCompanyProfileIndustry(targetElementText: string): string {
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

    getDataViaCommonParentCompanyProfileSector(targetElementText: string): string {
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

    getSymbol(): string {
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

    getDividends(targetElementText: string): string {
        var div = this.getDataViaCommonParentCardItem(targetElementText);
        if (div === 'target element not found') {
            return '0';
        }
        return div;

    }

    getRoe(targetElementText: string): string {
        var roeInPercent = this.getDataViaCommonParentCardItem(targetElementText);
        var roeInPercentFloat = parseFloat(roeInPercent);
        if (isNaN(roeInPercentFloat)) {
            return 'ROE is NaN';
        }

        return (roeInPercentFloat / 100).toFixed(4)
    }

    getDataRow(): React.ReactNode {
        var symbol: string = this.getSymbol();
        var sector: string = this.getDataViaCommonParentCompanyProfileSector('Sector');
        var industry: string = this.getDataViaCommonParentCompanyProfileIndustry('Industry');
        var eps: string = this.getDataViaCommonParentCardItem('EPS (FWD)');
        var div: string = this.getDividends('Latest Announced Dividend');
        var roe: string = this.getRoe('Return on Equity');
        var beta: string = this.getDataViaCommonParentCardItem('24M Beta');

        //return [symbol, sector, industry, eps, div, roe, beta];  // TODO evtl. for later
        return [eps, div, roe, beta];
    }

    divFrequency(): ReactNode {
        return this.getDataViaCommonParentCardItem('Frequency');
    }

}