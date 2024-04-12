import shared from "../shared";
import IParser from "./IParser";

export class TwitterParser implements IParser {

    async getDataRowAsync(): Promise<Array<string>> {
        return getTimeTagsAsync(24);
    }

    getTimeTagsAsync(hoursAgo: number): Promise<Array<string>>{

        // TODO try catch and reject
    
        let promise = new Promise<Array<string>>((resolve, reject) => {
            var timestampOfEarliestTweet = shared.addHoursToDate(new Date(Date.now()), -1 * hoursAgo)
    
            var allTimeElements: Array<HTMLTimeElement> = [];
            var timeout = 1000;
            var i = 0;
            var maxTweetCount = 10;
    
            var intervalId = setInterval(() => {
                const timeElements: Array<HTMLTimeElement> = shared.getElementsByTag('time');
                if (timeElements.length === 0) throw new Error('No time elements found');
                allTimeElements = allTimeElements.concat(timeElements);
    
                const lastElement: HTMLTimeElement = timeElements[timeElements.length - 1];
                const earliestTimestamp = new Date(lastElement.dateTime);
                console.log(buildExtractingDataMessage(hoursAgo, i, maxTweetCount, earliestTimestamp));
    
                lastElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
                i++;
                if (i === maxTweetCount || earliestTimestamp <= timestampOfEarliestTweet) {
                    clearInterval(intervalId);
    
                    if (i === maxTweetCount) console.log(`LIMIT of ${maxTweetCount} reached`);
                    if (earliestTimestamp <= timestampOfEarliestTweet)
                        console.log(`24 HOURS PERIOD PROCESSED ${earliestTimestamp}`);
    
                    var datesOfTweets = allTimeElements.map((e: any) => {
                        var objDate = new Date(e.dateTime);
                        return objDate.toLocaleDateString('de') + "T" + objDate.toLocaleTimeString('de')
                    });
                    console.log('datesOfTweets');
                    console.log(datesOfTweets);
    
                    var allData: Array<string> = datesOfTweets.map<string>(d => d + ",TODO,TODO2");
    
                    console.log('shape cummulatedDataArray');
                    console.log(shared.getShape(allData));
    
                    resolve(allData);
                }
    
            }, timeout);
        });
    
        return promise;
    }
    
    private  buildExtractingDataMessage = (hoursAgo: number, iterationIdx: number, maxTweetCount: number, earliestTimestamp: Date) => {
        var msg = `Extracting data ${hoursAgo} hours back. `;
        msg += `Scroll ${iterationIdx} of max. ${maxTweetCount}. `;
        msg += `Last: ${earliestTimestamp.toLocaleString('de')}`;
        return msg;
    }
    
    private getHeader(): string {
        return "Message User Time";
    }

}

export async function getDataRow(): Promise<Array<string>> {
    return await getTimeTagsAsync(24);
}

const getTimeTagsAsync = async (hoursAgo: number): Promise<Array<string>> => {

    // TODO try catch and reject

    let promise = new Promise<Array<string>>((resolve, reject) => {
        var timestampOfEarliestTweet = shared.addHoursToDate(new Date(Date.now()), -1 * hoursAgo)

        var allTimeElements: Array<HTMLTimeElement> = [];
        var timeout = 1000;
        var i = 0;
        var maxTweetCount = 10;

        var intervalId = setInterval(() => {
            const timeElements: Array<HTMLTimeElement> = shared.getElementsByTag('time');
            if (timeElements.length === 0) throw new Error('No time elements found');
            allTimeElements = allTimeElements.concat(timeElements);

            const lastElement: HTMLTimeElement = timeElements[timeElements.length - 1];
            const earliestTimestamp = new Date(lastElement.dateTime);
            console.log(buildExtractingDataMessage(hoursAgo, i, maxTweetCount, earliestTimestamp));

            lastElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
            i++;
            if (i === maxTweetCount || earliestTimestamp <= timestampOfEarliestTweet) {
                clearInterval(intervalId);

                if (i === maxTweetCount) console.log(`LIMIT of ${maxTweetCount} reached`);
                if (earliestTimestamp <= timestampOfEarliestTweet)
                    console.log(`24 HOURS PERIOD PROCESSED ${earliestTimestamp}`);

                var datesOfTweets = allTimeElements.map((e: any) => {
                    var objDate = new Date(e.dateTime);
                    return objDate.toLocaleDateString('de') + "T" + objDate.toLocaleTimeString('de')
                });
                console.log('datesOfTweets');
                console.log(datesOfTweets);

                var allData: Array<string> = datesOfTweets.map<string>(d => d + ",TODO,TODO2");

                console.log('shape cummulatedDataArray');
                console.log(shared.getShape(allData));

                resolve(allData);
            }

        }, timeout);
    });

    return promise;
}

const buildExtractingDataMessage = (hoursAgo: number, iterationIdx: number, maxTweetCount: number, earliestTimestamp: Date) => {
    var msg = `Extracting data ${hoursAgo} hours back. `;
    msg += `Scroll ${iterationIdx} of max. ${maxTweetCount}. `;
    msg += `Last: ${earliestTimestamp.toLocaleString('de')}`;
    return msg;
}

export function getHeader(): string {
    return "Message User Time";
}

