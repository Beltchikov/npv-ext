import shared from "../../shared";
import { IStrategy } from "../IStrategy";
import { EntryHandler } from "./EntryHandler";
import { TabDataAndPayload } from "./TabDataAndPayload";
import { TabDataHandler } from "./TabDataHandler";

export class ParserStrategy implements IStrategy {
  // TODO declare private
  tabsRequested: Array<TabDataAndPayload> = [];
  noListener = true;

  addMessageListener(): void {
    // if (this.noListener) {
      
    //   shared.logMessageAndObject('ParserStrategy: adding listener', {});

    //   chrome.runtime.onMessage.addListener(this.onMessageListener);
    //   this.noListener = false;
    // }

    chrome.runtime.onMessage.addListener(this.onMessageListener);
  }

  // TODO refactor in separate class
  async onMessageListener(message: any, sender: chrome.runtime.MessageSender, sendResponse: (r?: any) => void) {
    shared.logMessageAndObject(`ParserStrategy: message received:`, message);
    if (message.target !== 'background') return;

    const messageTypeMap = [
      { messageType: "strategyEntry", handler: new EntryHandler() },
      { messageType: "tabData", handler: new TabDataHandler() },
    ];

    // TODO refactor valueFromDictionary
    let messageMapEntries = messageTypeMap.filter((m) => m["messageType"] === message.type);
    if (messageMapEntries.length !== 1)
      throw new Error(`message map is not proper defined for message type ${message.type}`);
    let messageEntry = messageMapEntries[0];
    if (!messageEntry) throw new Error(`Unexpected. messageEntry is undefined.`);
    let messageHandler = messageEntry.handler;

    this.tabsRequested = await messageHandler.handle(message, sender, this.tabsRequested);

    if (message.type === "strategyEntry") {

      shared.logMessageAndObject(`ParserStrategy: removing listener`, {});

      // chrome.runtime.onMessage.removeListener(this.onMessageListener);
      // this.noListener = true;
    }
    sendResponse(true);
  }
}