export interface IMessageToDialog
{
    context: string,
    type: string,
    target: string,
    header: Array<string>,
    dataTable: Array<Array<string>>,
    footer:string,
    sender: string
}