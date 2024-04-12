export default interface IParcer
{
    getDataRowAsync(): Promise<Array<string>>
}
