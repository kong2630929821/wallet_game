/**
 * 
 */
import { DEFAULT_FILE_WARE } from '../../../pi_pt/constant';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { BTC, ETH, Hoe, Item, Items, KT, Mine, Prizes, ST } from '../data/db/item.s';
import { add_itemCount, get_mine_total, get_mine_type, items_init } from '../util/item_util.r';
import { ItemQuery } from './itemQuery.s';

// 添加矿山
// #[rpc=rpcServer]
export const add_mine = (uid: number): Mine => {
    // if (get_mine_total(uid) >= 9) return;
    const itemQuery = new ItemQuery();
    itemQuery.uid = uid;
    itemQuery.enumType = 1;
    itemQuery.itemType = get_mine_type();
    const item = add_itemCount(itemQuery, 1);

    return <Mine>item.value;
};

// 查询指定用户物品信息
// #[rpc=rpcServer]
export const item_query = (uid: number): Items => {
    console.log('item query in !!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const userItemBucket = new Bucket(DEFAULT_FILE_WARE, Items._$info.name, dbMgr);
    const items = <Items>userItemBucket.get(uid)[0];
    if (!items) {
        items_init(uid);
    }

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

// 查询用户获取奖品信息
// #[rpc=rpcServer]
// export const award_query = (uid: number): Prizes => {
//     const dbMgr = getEnv().getDbMgr();
//     const userPrizeBucket = new Bucket(DEFAULT_FILE_WARE, Prizes._$info.name, dbMgr);
//     const iter =  userPrizeBucket.iter(1);
    
// }