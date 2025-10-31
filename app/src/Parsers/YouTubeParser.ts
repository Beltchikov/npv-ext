import IParser from "./IParser";
import { TabData } from "./TabData";

export class YouTubeParser implements IParser {
    async getTabDataAsync(): Promise<TabData> {
        const header = ["WTA"];
        const rows: string[][] = []; // keine Rows
        const footer = "";

        return new TabData(rows, header, footer);
    }
}



