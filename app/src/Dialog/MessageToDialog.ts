import { IMessageToDialog } from "./IMessageToDialog";

export class MessageToDialog implements IMessageToDialog
{
    context: string;
    type: string;
    target: string;
    dataTable: string[][];
    sender: string;
    
    constructor(context:string, type:string, target:string, dataTable:string[][], sender:string)
    {
        this.context = context;
        this.type = type;
        this.target = target;
        this.dataTable = dataTable;
        this.sender = sender;
    }
}