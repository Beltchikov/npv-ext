import * as investingParser from "./InvestingParser"
import * as seekingAlphaParser from "./SeekingAlphaParser"
import * as twitterParser from "./TwitterParser"
import * as youTubeParser from "./YouTubeParser"

export const parserMap = [
    { hostname: "www.investing.com", parser: new investingParser.InvestingParser() },
    { hostname: "seekingalpha.com", parser: new seekingAlphaParser.SeekingAlphaParser() },
    { hostname: "twitter.com", parser: new twitterParser.TwitterParser() },
    { hostname: "x.com", parser: new twitterParser.TwitterParser() },
    { hostname: "www.youtube.com", parser: new youTubeParser.YouTubeParser() },
];