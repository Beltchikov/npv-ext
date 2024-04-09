import shared from "../shared";

export function getDataRow(): Array<string> {
    
    var timesOfTweets = getTimeTags(24);
    
    // TODO
    return ['Switzerland aims to host a high-level ', '@business', '1 Min.'];
}

const getTimeTags = (hoursAgo: number):any=>{
    var timeOfEarliestTweet = shared.addHoursToDate(new Date(Date.now()), -1*hoursAgo)
    
    var timeElements:any = shared.getElementsByTag('time');
    console.log('timeElements');
    console.log(timeElements);

    // var timeElements:any = shared.getElementsByTag('time')
    // .filter((e:any)=>new Date(e.dateTime) >=timeOfEarliestTweet) ;
    // console.log('timeElements');
    // console.log(timeElements);


    
    
    var datesOfTweets = timeElements.map((e:any)=> new Date(e.dateTime));
    console.log('datesOfTweets');
    console.log(datesOfTweets);
    
    return 'todo';
}

export function getHeader(): string {
    return "Message User Time";
}

