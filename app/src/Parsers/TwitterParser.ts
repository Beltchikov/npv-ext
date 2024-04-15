import shared from "../shared";
import IParser from "./IParser";
import { TabData } from "./TabData";

export class TwitterParser implements IParser {

    async getTabDataAsync(): Promise<TabData> {
        return this.getTimeTagsAsync(24);
    }

    getTimeTagsAsync(hoursAgo: number): Promise<TabData> {

        // TODO try catch and reject

        let promise = new Promise<TabData>((resolve, reject) => {
            var timestampOfEarliestTweet = shared.addHoursToDate(new Date(Date.now()), -1 * hoursAgo)

            var allTimeElements: Array<HTMLTimeElement> = [];
            var timeout = 1000;
            var i = 0;
            var maxTweetCount = 10;

            var intervalId = setInterval(() => {
                const timeElements: Array<HTMLTimeElement> = shared.getElementsByTag('time');
                if (timeElements.length === 0) throw new Error('No time elements found');

                //
                let parentsNo13 = timeElements.map(t => t?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
                    ?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
                    ?.parentElement?.parentElement?.parentElement)

                let tweetTextSpans = parentsNo13
                    .map(p => p?.querySelector("div[data-testid='tweetText"))
                    .map(p => p?.querySelector("span"));
                
                console.log("tweetTextSpans");
                tweetTextSpans.forEach(p => console.log(p?.innerHTML))
                //

                allTimeElements = allTimeElements.concat(timeElements);

                const lastElement: HTMLTimeElement = timeElements[timeElements.length - 1];
                const earliestTimestamp = new Date(lastElement.dateTime);
                console.log(this.buildExtractingDataMessage(hoursAgo, i, maxTweetCount, earliestTimestamp));

                lastElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
                i++;
                if (i === maxTweetCount || earliestTimestamp <= timestampOfEarliestTweet) {
                    clearInterval(intervalId);

                    if (i === maxTweetCount) console.log(`LIMIT of ${maxTweetCount} reached`);
                    if (earliestTimestamp <= timestampOfEarliestTweet)
                        console.log(`24 HOURS PERIOD PROCESSED ${earliestTimestamp}`);

                    var datesOfTweets = allTimeElements.map((e: any) => {
                        let objDate = new Date(e.dateTime);
                        let strDate = objDate.toLocaleDateString('de') + "T" + objDate.toLocaleTimeString('de');
                        return [strDate, "User", "Text"]
                    });
                    console.log('datesOfTweets');
                    console.log(datesOfTweets);

                    let header = ["Time", "User", "Text"]
                    let footer = "";
                    resolve(new TabData(datesOfTweets, header, footer));
                }

            }, timeout);
        });

        return promise;
    }

    private buildExtractingDataMessage = (hoursAgo: number, iterationIdx: number, maxTweetCount: number, earliestTimestamp: Date) => {
        var msg = `Extracting data ${hoursAgo} hours back. `;
        msg += `Scroll ${iterationIdx} of max. ${maxTweetCount}. `;
        msg += `Last: ${earliestTimestamp.toLocaleString('de')}`;
        return msg;
    }

    private getHeader(): string {
        return "Message User Time";
    }

}



