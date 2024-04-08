import * as investingParser from "./InvestingParser"
import * as seekingAlphaParser from "./SeekingAlphaParser"

export const parserMap = [
    { hostname: "www.investing.com", parser: investingParser },
    { hostname: "seekingalpha.com", parser: seekingAlphaParser },
];