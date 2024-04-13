import { DataRow } from "./DataRow"

export class TabData {
    rows: Array<DataRow> = [];

    constructor(array2D: Array<Array<string>>) {
        array2D.forEach((row) => {
            this.rows.push(new DataRow(row))
        })
    }
}