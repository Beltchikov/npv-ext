import { parserMap } from "./Parsers/parserMap";

(function starter() {
    console.log(`header.ts`);

    var hostMapEntry = parserMap.filter((e) => e.hostname === window.location.hostname);
    if (hostMapEntry.length !== 1) 
        throw new Error(`hostMapEntry is not proper defined for ${window.location.hostname}`);

    var parser = hostMapEntry[0].parser;
    var header = parser.getHeader();


    chrome.runtime.sendMessage({
        target: 'background',
        context: window.location.hostname,
        type: 'header',
        data: header,
        sender: 'parser'
    })
    .then((_r=>console.log("Header message sent succcessfully.")))
    .catch(e => console.log(`Error sending header message. Reason: ${e}`));

})();

export {}