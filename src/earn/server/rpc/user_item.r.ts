/**
 * 
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { BTC, ETH, Hoe, Item, Items, KT, Mine, ST } from '../data/db/item.s';
import { ItemQuery } from './itemQuery.s';

// 查询指定用户物品信息
// #[rpc=rpcServer]
export const item_query = (uid: number): Items => {
    console.log('item query in !!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const userItemBucket = new Bucket('file', Items._$info.name, dbMgr);

    return <Items>userItemBucket.get(uid)[0];
};

// 获取指定物品信息
// #[rpc=rpcServer]
export const get_item = (itemQuery: ItemQuery): Item => {
    const itemInfo = item_query(itemQuery.uid);
    if (!itemInfo) return;
    const items = itemInfo.item;
    const itemList = [];
    for (const item of items) {
        if (item.enum_type === itemQuery.enumType) {
            itemList.push(item.value);
            continue;
        }
    }
    for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].num === itemQuery.itemType) {
            const resutlItem = new Item();
            resutlItem.enum_type = itemQuery.enumType;
            resutlItem.value = itemList[i];

            return resutlItem;
        }
    }
};