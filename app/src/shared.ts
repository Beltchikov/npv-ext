import * as cheerio from 'cheerio';

export const localHostOrSeekingAlpha = () => {
    return window.location.href.indexOf('localhost') >= 0
        || window.location.href.indexOf('seekingalpha.com') >= 0;
}

export const localHostOrInvesting = () => {
    return window.location.href.indexOf('localhost') >= 0
        || window.location.href.indexOf('investing.com') >= 0;
}

export function dataFromHtmlViaCommonParent(
    innerHTML: string,
    targetElementName: string,
    targetElementText: string,
    commonParentSelector: string,
    relatedElementSelector: string): IValueWithError<string> {

    const $ = cheerio.load(innerHTML);

    const targetElement = $(targetElementName).filter(function () {
        return $(this).text().trim() === targetElementText;
    });
    if (targetElement.length <= 0) return { error: 'target element not found', value: null }

    const commonParent = targetElement.closest(commonParentSelector);
    if (commonParent.length <= 0) return { error: 'common parent not found', value: null }

    const relatedElement = commonParent.find(relatedElementSelector);
    if (relatedElement.length <= 0) return { error: 'related element not found', value: null }
    return { 'value': relatedElement.text(), error: null };
}

export function dataFromHtmlViaParent(
    innerHTML: string,
    parentSelector: string,
    relatedElementSelector: string): IValueWithError<string> {

    const $ = cheerio.load(innerHTML);

    const parent = $(parentSelector);
    if (parent.length <= 0) return { error: 'parent not found', value: null }

    const relatedElement = parent.find(relatedElementSelector);
    if (relatedElement.length <= 0) return { error: 'related element not found', value: null }
    return { 'value': relatedElement.text(), error: null };
}

export function dataFromHtmlByTagAndTextContains(innerHTML: string, tag: string, ...textsToSearch: string[]) {
    const $ = cheerio.load(innerHTML);

    console.log('dataFromHtmlByTagAndTextContains');

    const result = $(tag).filter(function () {
        var containsAllTexts = true;
        textsToSearch.forEach((textToSearch) => {
            containsAllTexts = $(this).text().indexOf(textToSearch) > 0;
            if (!containsAllTexts) return false;
        });
        return containsAllTexts;
    });

    console.log(result.length);
    console.log(result[0]);
}

export interface IValueWithError<T> {
    value: T | null;
    error: string | null;
}

export function getElementByTagAndId(tag: string, id: string): any {
    return Array.from(document.getElementsByTagName(tag)).filter((e) => e.id === id)[0];
}

export function getElementByTagAndIdOrCreate(tag: string, id: string): any {
    var element = getElementByTagAndId(tag, id);
    if (!element) {
        element = document.createElement(tag);
        element.id = id;
    }
    return element;
}

export default {
    localHostOrSeekingAlpha,
    localHostOrInvesting,
    dataFromHtmlViaCommonParent,
    dataFromHtmlViaParent,
    dataFromHtmlByTagAndTextContains,
    getElementByTagAndId,
    getElementByTagAndIdOrCreate
};