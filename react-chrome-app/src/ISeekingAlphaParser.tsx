export interface ISeekingAlphaParser
{
    getDataViaCommonParentCardItem(targetElementText: string): string;
    getDataViaCommonParentCompanyProfileIndustry(targetElementText: string): string;
    getDataViaCommonParentCompanyProfileSector(targetElementText: string): string;
    getSymbol(): string;
    getDividends(targetElementText: string): string;
    getRoe(targetElementText: string): string;
    getDataRow(): React.ReactNode;
}