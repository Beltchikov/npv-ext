import shared from "../shared";

export function getDataRow(): Array<string> {
    
    var timesOfTweets = getTimeTags(24);
    
    // TODO
    return ['Switzerland aims to host a high-level ', '@business', '1 Min.'];
}

const getTimeTags = (hoursAgo: number):any=>{
    var timeElements:any = shared.getElementsByTag('time');
    var datesOfTweets = timeElements.map((e:any)=> e.dateTime);
    console.log('datesOfTweets');
    console.log(datesOfTweets);
    
    return 'todo';
}

export function getHeader(): string {
    return "Message User Time";
}

