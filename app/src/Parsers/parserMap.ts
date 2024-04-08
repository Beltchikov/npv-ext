import * as investingParser from "./InvestingParser"
import * as seekingAlphaParser from "./SeekingAlphaParser"
import * as twitterParser from "./TwitterParser"

export const parserMap = [
    { hostname: "www.investing.com", parser: investingParser },
    { hostname: "seekingalpha.com", parser: seekingAlphaParser },
    { hostname: "twitter.com", parser: twitterParser },
];