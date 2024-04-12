import shared from "../shared";
import IParser from "./IParser";

export class SeekingAlphaParser implements IParser{
    getDataRow(): Array<string> {
        var symbol: string = getSymbol();
        var sector: string = getDataViaCommonParentCompanyProfileSector('Sector');
        var industry: string = getDataViaCommonParentCompanyProfileIndustry('Industry');
        var eps: string = getDataViaCommonParentCardItem('EPS (FWD)');
        var div: string = getDividends('Latest Announced Dividend');
        var roe: string = getRoe('Return on Equity');
        var beta: string = getDataViaCommonParentCardItem('24M Beta');
    
        //return [symbol, sector, industry, eps, div, roe, beta];  // TODO evtl. for later
        //return ([eps, div, roe, beta]).toString().split(',');
    
        var resultRow = ([eps, div, roe, beta]).map((e) => formatString(e, 2));
        return resultRow;
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
    
    private getDividends(targetElementText: string): string {
        var div = getDataViaCommonParentCardItem(targetElementText);
        if (div === 'target element not found') {
            return '0';
        }
        return div;
    
    }
    
    private getRoe(targetElementText: string): string {
        var roeInPercent = getDataViaCommonParentCardItem(targetElementText);
        var roeInPercentFloat = parseFloat(roeInPercent);
        if (isNaN(roeInPercentFloat)) {
            return 'ROE is NaN';
        }
    
        return (roeInPercentFloat / 100).toFixed(4)
    }

    private divFrequency(): string {
        return getDataViaCommonParentCardItem('Frequency');
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

export function getDataRow(): Array<string> {
    var symbol: string = getSymbol();
    var sector: string = getDataViaCommonParentCompanyProfileSector('Sector');
    var industry: string = getDataViaCommonParentCompanyProfileIndustry('Industry');
    var eps: string = getDataViaCommonParentCardItem('EPS (FWD)');
    var div: string = getDividends('Latest Announced Dividend');
    var roe: string = getRoe('Return on Equity');
    var beta: string = getDataViaCommonParentCardItem('24M Beta');

    //return [symbol, sector, industry, eps, div, roe, beta];  // TODO evtl. for later
    //return ([eps, div, roe, beta]).toString().split(',');

    var resultRow = ([eps, div, roe, beta]).map((e) => formatString(e, 2));
    return resultRow;
}

export function divFrequency(): string {
    return getDataViaCommonParentCardItem('Frequency');
}

export function getHeader(): string {
    return "EPS DIV ROE Beta Date";
}

function formatString(e: string, decimalPlaces: number): string {
    var floatResult = parseFloat(e);
    if (isNaN(floatResult)) {
        return e;
    }
    return floatResult.toLocaleString('de', { minimumFractionDigits: decimalPlaces });
}

function getDataViaCommonParentCardItem(targetElementText: string): string {
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

function getDataViaCommonParentCompanyProfileIndustry(targetElementText: string): string {
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

function getDataViaCommonParentCompanyProfileSector(targetElementText: string): string {
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

function getSymbol(): string {
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

function getDividends(targetElementText: string): string {
    var div = getDataViaCommonParentCardItem(targetElementText);
    if (div === 'target element not found') {
        return '0';
    }
    return div;

}

function getRoe(targetElementText: string): string {
    var roeInPercent = getDataViaCommonParentCardItem(targetElementText);
    var roeInPercentFloat = parseFloat(roeInPercent);
    if (isNaN(roeInPercentFloat)) {
        return 'ROE is NaN';
    }

    return (roeInPercentFloat / 100).toFixed(4)
}
