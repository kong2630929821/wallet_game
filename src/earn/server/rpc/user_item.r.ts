/**
 * 
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { BTC, ETH, Hoe, Item, Items, KT, Mine, ST } from '../data/db/item.s';
import { items_init } from '../util/item_util.r';
import { ItemQuery } from './itemQuery.s';

// 查询指定用户物品信息
// #[rpc=rpcServer]
export const item_query = (uid: number): Items => {
    console.log('item query in !!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const userItemBucket = new Bucket('file', Items._$info.name, dbMgr);
    const items = <Items>userItemBucket.get(uid)[0];
    if (!items) return;

    return items;
};

// 获取指定物品信息
// #[rpc=rpcServer]
export const get_item = (itemQuery: ItemQuery): Item => {
    const itemInfo = item_query(itemQuery.uid);
    if (!itemInfo) return;
    const items = itemInfo.item;
    for (const item of items) {
        if (item.value.num === itemQuery.itemType) {
            const resutlItem = new Item();
            resutlItem.enum_type = itemQuery.enumType;
            resutlItem.value = item.value;
            
            return resutlItem;
        }
    }
};