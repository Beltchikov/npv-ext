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
    var maxTweetCount = 100;

    var intervalId = setInterval(() => {
        const timeElements: Array<HTMLTimeElement> = shared.getElementsByTag('time');
        if (timeElements.length === 0) throw new Error('No time elements found');
        allTimeElements = allTimeElements.concat(timeElements);
        
        const lastElement: HTMLTimeElement = timeElements[timeElements.length - 1];
        const earliestTimestamp = new Date(lastElement.dateTime);
        console.log('earliestTimestamp');
        console.log(earliestTimestamp);

        lastElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
        i++;
        if(i== maxTweetCount || earliestTimestamp <= timestampOfEarliestTweet) {
            clearInterval(intervalId);

            if(i===maxTweetCount) console.log(`LIMIT of ${maxTweetCount} reached`);
            if(earliestTimestamp <= timestampOfEarliestTweet) 
                console.log(`24 HOURS PERIOD PROCESSED ${earliestTimestamp}`);

            var datesOfTweets = allTimeElements.map((e: any) => new Date(e.dateTime));
            console.log('datesOfTweets');
            console.log(datesOfTweets);
        
            return 'todo';
        }

    }, timeout);

   
}

export function getHeader(): string {
    return "Message User Time";
}

