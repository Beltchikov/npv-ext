import { IStrategy } from "../IStrategy";
import { EntryHandler } from "./EntryHandler";
import { TabDataAndPayload } from "./TabDataAndPayload";
import { TabDataHandler } from "./TabDataHandler";

export class ParserStrategy implements IStrategy {
  tabsRequested: Array<TabDataAndPayload> = [];

  addMessageListener(): void {
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      if (message.target !== 'background') return;

      const messageTypeMap = [
        { messageType: "strategyEntry", handler: new EntryHandler() },
        { messageType: "tabData", handler: new TabDataHandler() },
      ];

      let messageMapEntries = messageTypeMap.filter((m) => m["messageType"] === message.type);
      if (messageMapEntries.length !== 1)
        throw new Error(`message map is not proper defined for message type ${message.type}`);
      let messageEntry = messageMapEntries[0];
      if (!messageEntry) throw new Error(`Unexpected. messageEntry is undefined.`);
      let messageHandler = messageEntry.handler;

      this.tabsRequested = await messageHandler.handle(message, sender, this.tabsRequested);
      console.log('this.tabsRequested');
      console.log(this.tabsRequested);

      sendResponse(true);
    });
  }

  async #onMessageListener(message:any, sender:chrome.runtime.MessageSender, sendResponse:(r?:any)=>void)
  {
    if (message.target !== 'background') return;

      const messageTypeMap = [
        { messageType: "strategyEntry", handler: new EntryHandler() },
        { messageType: "tabData", handler: new TabDataHandler() },
      ];

      let messageMapEntries = messageTypeMap.filter((m) => m["messageType"] === message.type);
      if (messageMapEntries.length !== 1)
        throw new Error(`message map is not proper defined for message type ${message.type}`);
      let messageEntry = messageMapEntries[0];
      if (!messageEntry) throw new Error(`Unexpected. messageEntry is undefined.`);
      let messageHandler = messageEntry.handler;

      this.tabsRequested = await messageHandler.handle(message, sender, this.tabsRequested);
      console.log('this.tabsRequested');
      console.log(this.tabsRequested);

      sendResponse(true);
  }
}