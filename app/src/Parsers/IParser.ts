import {TabData} from "./TabData";

export default interface IParcer
{
    getTabDataAsync(): Promise<TabData>
}