import shared from "../shared";

export function getDataRow(): Array<string> {

    var timesOfTweets = getTimeTags(24);

    // TODO
    return ['Switzerland aims to host a high-level ', '@business', '1 Min.'];
}

const getTimeTags = (hoursAgo: number): any => {
    var timestampOfEarliestTweet = shared.addHoursToDate(new Date(Date.now()), -1 * hoursAgo)

    var allTimeElements: Array<HTMLTimeElement> = [];
    var timeout = 1000;
    var i = 0;
    var maxTweetCount = 1000;

    var intervalId = setInterval(() => {
        const timeElements: Array<HTMLTimeElement> = shared.getElementsByTag('time');
        if (timeElements.length === 0) throw new Error('No time elements found');
        allTimeElements = allTimeElements.concat(timeElements);
        
        const lastElement: HTMLTimeElement = timeElements[timeElements.length - 1];
        const earliestTimestamp = new Date(lastElement.dateTime);
        console.log(buildExtractingDataMessage(hoursAgo, i, maxTweetCount, earliestTimestamp));

        lastElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
        i++;
        if(i== maxTweetCount || earliestTimestamp <= timestampOfEarliestTweet) {
            clearInterval(intervalId);

            if(i===maxTweetCount) console.log(`LIMIT of ${maxTweetCount} reached`);
            if(earliestTimestamp <= timestampOfEarliestTweet) 
                console.log(`24 HOURS PERIOD PROCESSED ${earliestTimestamp}`);

            var datesOfTweets = allTimeElements.map((e: any) => (new Date(e.dateTime)).toLocaleString('de'));
            console.log('datesOfTweets');
            console.log(datesOfTweets);
        
            return 'todo';
        }

    }, timeout);

   
}

const buildExtractingDataMessage = (hoursAgo:number, iterationIdx: number, maxTweetCount:number, earliestTimestamp: Date)=>{
    var msg = `Extracting data ${hoursAgo} back. `;
    msg += `Scroll ${iterationIdx} of max. ${maxTweetCount}. `;
    msg += `Last: ${earliestTimestamp.toLocaleString('de')}`;
    return msg;
}

export function getHeader(): string {
    return "Message User Time";
}

