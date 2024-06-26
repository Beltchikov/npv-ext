import shared from "../shared";
import IParser from "./IParser";
import { TabData } from "./TabData";

export class TwitterParser implements IParser {
    hoursAgo = 24
    maxScrollCount = 1000
    timeout = 1000;

    async getTabDataAsync(): Promise<TabData> {
        return this.getTimeTagsAsync(this.hoursAgo);
    }

    getTimeTagsAsync(hoursAgo: number): Promise<TabData> {
        return new Promise<TabData>((resolve, reject) => {
            var timestampOfEarliestTweet = shared.addHoursToDate(new Date(Date.now()), -1 * hoursAgo)

            var allTimeElements: Array<HTMLTimeElement> = [];
            var i = 0;
            var intervalId = setInterval(() => {
                const timeElements: Array<HTMLTimeElement> = shared.getElementsByTag('time');
                if (timeElements.length === 0) throw new Error('No time elements found');

                allTimeElements = allTimeElements.concat(timeElements);
                const lastElement: HTMLTimeElement = timeElements[timeElements.length - 1];
                const earliestTimestamp = new Date(lastElement.dateTime);
                console.log(this.buildExtractingDataMessage(hoursAgo, i, this.maxScrollCount, earliestTimestamp));

                lastElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
                i++;
                if (i >= this.maxScrollCount || earliestTimestamp <= timestampOfEarliestTweet) {
                    clearInterval(intervalId);

                    if (i === this.maxScrollCount) console.log(`LIMIT of ${this.maxScrollCount} scrolls reached`);
                    if (earliestTimestamp <= timestampOfEarliestTweet)
                        console.log(`${hoursAgo} HOURS PERIOD PROCESSED ${earliestTimestamp}`);

                    var datesOfTweets = allTimeElements.map((t: any) => {
                        let objDate = new Date(t.dateTime);
                        let strDate = objDate.toLocaleDateString('de') + "T" + objDate.toLocaleTimeString('de');

                        let parentsNo13 = t?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
                            ?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
                            ?.parentElement?.parentElement?.parentElement;

                        let spanTweetTextInnerHtml: any
                        try {
                            let divTweetText = parentsNo13.querySelector("div[data-testid='tweetText");
                            let spanTweetText = divTweetText.querySelector("span");
                            spanTweetTextInnerHtml = spanTweetText.innerHTML;
                        }
                        catch { spanTweetTextInnerHtml = "NO DATA" }

                        return [strDate, this.getUser(), spanTweetTextInnerHtml]
                    });

                    let header = ["Time", "User", "Text"]
                    let footer = "";
                    try {
                        resolve(new TabData(datesOfTweets, header, footer));
                    }
                    catch (e) { reject(e); }
                }

            }, this.timeout);
        });
    }

    private buildExtractingDataMessage = (hoursAgo: number, iterationIdx: number, maxTweetCount: number, earliestTimestamp: Date) => {
        var msg = `Extracting data ${hoursAgo} hours back. `;
        msg += `Scroll ${iterationIdx} of max. ${maxTweetCount}. `;
        msg += `Last: ${earliestTimestamp.toLocaleString('de')}`;
        return msg;
    }

    private getUser(): string {
        let url = window.location.href;
        return "@" + url.substring(url.lastIndexOf('/') + 1)
    }
}



