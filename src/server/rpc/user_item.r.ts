import { getEnv } from "../../pi_pt/net/rpc_server";
import { Bucket } from "../../utils/db";
import { USER_ITEMS_TABLE } from "../data/constant";
import { Items, Mine, Hoe, BTC, ETH, ST, KT, Item } from "../data/db/item.s";
import { ItemQuery } from "./itemQuery.s";

//查询指定用户物品信息
// #[rpc=rpcServer]
export const item_query = (uid: number): Items => {
    console.log("item query in !!!!!!!!!!!!")
    const dbMgr = getEnv().getDbMgr();
    const userItemBucket = new Bucket('file', USER_ITEMS_TABLE, dbMgr);
    let itemInfo = <Items>userItemBucket.get(uid)[0]
    return itemInfo
};

//获取指定物品信息
// #[rpc=rpcServer]
export const get_item = (itemQuery: ItemQuery): Item => {
    let itemInfo = item_query(itemQuery.uid);
    let items = itemInfo.item;
    let itemList = [];
    for (let item of items) {
        if (item.enum_type === itemQuery.enumType) {
            itemList.push(item.value);
            continue;
        }
    }
    for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].num === itemQuery.itemType) {
            let resutlItem = new Item();
            resutlItem.enum_type = itemQuery.enumType;
            resutlItem.value = itemList[i];
            return resutlItem;
        }
    }
};