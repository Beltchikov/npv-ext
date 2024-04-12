import * as investingParser from "./InvestingParser"
import * as seekingAlphaParser from "./SeekingAlphaParser"
import * as twitterParser from "./TwitterParser"

export const parserMap = [
    { hostname: "www.investing.com", parser: new investingParser.InvestingParser() },
    { hostname: "seekingalpha.com", parser: new seekingAlphaParser.SeekingAlphaParser() },
    { hostname: "twitter.com", parser: new twitterParser.TwitterParser() },
];