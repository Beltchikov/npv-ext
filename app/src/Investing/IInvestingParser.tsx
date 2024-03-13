export interface IInvestingParser
{
    getTa(targetElementText: string): string;
    getDataRow(): React.ReactNode;
}