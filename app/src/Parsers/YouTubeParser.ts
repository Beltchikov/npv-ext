import IParser from "./IParser";
import { TabData } from "./TabData";

export class YouTubeParser implements IParser {

    maxScrollCount = 1000;
    timeout = 500;

    async getTabDataAsync(): Promise<TabData> {
        const header = ["WTA"];
        const rows: string[][] = [];
        const footer = "Press Q to stop scrolling";

        let stop = false;
        let scrollCount = 0;

        // Tastendruck-Handler registrieren
        const keyHandler = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "q") {
                stop = true;
                console.log("Scroll stopped by user (Q pressed).");
            }
        };
        window.addEventListener("keydown", keyHandler);

        console.log("Starting auto-scroll... (press Q to stop)");

        // Scrollschleife
        while (!stop && scrollCount < this.maxScrollCount) {
            window.scrollBy(0, window.innerHeight);
            scrollCount++;

            console.log(`Scrolled ${scrollCount}/${this.maxScrollCount}`);

            // Timeout pausieren
            await new Promise(resolve => setTimeout(resolve, this.timeout));
        }

        window.removeEventListener("keydown", keyHandler);
        console.log("Scrolling finished or stopped.");

        return new TabData(rows, header, footer);
    }
}
