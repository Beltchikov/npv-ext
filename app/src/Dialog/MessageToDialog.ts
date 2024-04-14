import { IMessageToDialog } from "./IMessageToDialog";

export class MessageToDialog implements IMessageToDialog
{
    context: string;
    type: string;
    target: string;
    header: string[];
    dataTable: string[][];
    footer: string;
    sender: string;
    
    constructor(
        context:string, 
        type:string, 
        target:string, 
        header:string[], 
        dataTable:string[][], 
        footer:string, 
        sender:string)
    {
        this.context = context;
        this.type = type;
        this.target = target;
        this.header = header;
        this.dataTable = dataTable;
        this.footer = footer;
        this.sender = sender;
    }
    
}