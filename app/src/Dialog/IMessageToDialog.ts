export interface IMessageToDialog
{
    context: string,
    type: string,
    target: string,
    dataTable: Array<Array<string>>,
    sender: string
}