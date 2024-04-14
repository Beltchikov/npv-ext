import {TabData} from "./TabData";

export default interface IParcer
{
    getDataRowAsync(): Promise<TabData>
}