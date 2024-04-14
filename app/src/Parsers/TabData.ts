import { DataRow } from "./DataRow"

export class TabData {
    rows: Array<DataRow> = [];
    header: Array<string> = [];
    footer: string = "";

    constructor(array2D: Array<Array<string>>, header: Array<string>, footer: string) {
        array2D.forEach((row) => {
            this.rows.push(new DataRow(row))
        });
        this.header = header;
        this.footer = footer;
    }
}