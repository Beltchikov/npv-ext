export class TabDataAndPayload {
    tabId: number;
    activeTab: boolean;
    tabData: string[][]|undefined;

    constructor(tabId:number, activeTab:boolean, tabData:Array<Array<string>>|undefined) {
      this.tabId = tabId;
      this.activeTab = activeTab;
      this.tabData = tabData;
    }
  }
