import shared from "../shared";

export function getDataRow(): Array<string> {

    var timesOfTweets = getTimeTags(24);

    // TODO
    return ['Switzerland aims to host a high-level ', '@business', '1 Min.'];
}

const getTimeTags = (hoursAgo: number): any => {
    var timeOfEarliestTweet = shared.addHoursToDate(new Date(Date.now()), -1 * hoursAgo)

    var allTimeElements: Array<HTMLTimeElement> = [];
    var timeout = 1000;
    var i = 0;

    var intervalId = setInterval(() => {
        const timeElements: Array<HTMLTimeElement> = shared.getElementsByTag('time');
        if (timeElements.length === 0) throw new Error('No time elements found');
        allTimeElements = allTimeElements.concat(timeElements);
        console.log('allTimeElements');
        console.log(allTimeElements);

        const lastElement: HTMLTimeElement = timeElements[timeElements.length - 1];
        const earliestDate = new Date(lastElement.dateTime);
        console.log('earliestDate');
        console.log(earliestDate);

        lastElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
        i++;
        if(i== 10) {
            clearInterval(intervalId);

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

