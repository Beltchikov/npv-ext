
export class DataRow {
    cells: Array<string> = [] ;

    constructor(array2D: Array<string>) {
        array2D.forEach((cell) => {
            this.cells.push(cell);
        })
    }
}