/**
 * 用户物品接口
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { MAX_ONEDAY_MINING, WARE_NAME } from '../data/constant';
import { AwardList, BTC, ETH, Hoe, Item, Items, KT, Mine, Prizes, ST, TodayMineNum } from '../data/db/item.s';
import { add_itemCount, get_award_ids, get_mine_total, get_mine_type, get_today, items_init, items_init1 } from '../util/item_util.r';
import { ItemQuery } from './itemQuery.s';

// 添加矿山
// #[rpc=rpcServer]
export const add_mine = (uid: number): Mine => {
    if (get_mine_total(uid) >= MAX_ONEDAY_MINING) return;
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
    const userItemBucket = new Bucket(WARE_NAME, Items._$info.name, dbMgr);
    const items = <Items>userItemBucket.get(uid)[0];
    if (!items) {
        items_init(uid);

        return item_query(uid);
    }

    return items;
};

// 获取指定物品信息
// #[rpc=rpcServer]
export const get_item = (itemQuery: ItemQuery): Item => {
    console.log('get_item in !!!!!!!!!!!!');
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
export const award_query = (uid: number): AwardList => {
    const dbMgr = getEnv().getDbMgr();
    let pidList;
    const awardMap = get_award_ids(uid);
    const awardList = new AwardList();
    awardList.uid = uid;
    if (!awardMap.awards) {

        return awardList;
    } else {
        pidList = awardMap.awards;
        const bucket = new Bucket(WARE_NAME, Prizes._$info.name, dbMgr);
        const awards = bucket.get<number,[Prizes]>(pidList);
        console.log('awards:!!!!!!!!!!!!!!!!!!!', awards);
        console.log('awards:!!!!!!!!!!!!!!!!!!!', awards[0]);
        awardList.awards = awards;

        return awardList;
    }
    
};

// 查询用户当日挖矿山数量
// #[rpc=rpcServer]
export const get_todayMineNum = (uid: number):TodayMineNum => {
    console.log('get_todayMineNum in!!!!!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, TodayMineNum._$info.name, dbMgr);
    const today = get_today();
    console.log('today:!!!!!!!!!!!!!!!!!', today);
    const id = `${uid}:${today}`;
    console.log('id:!!!!!!!!!!!!!!!!!', id);
    const todayMineNum = bucket.get<string, [TodayMineNum]>(id)[0];
    if (!todayMineNum) {
        console.log('blanktodayMineNum:!!!!!!!!!!!!!!!!!', id);
        const blanktodayMineNum = new TodayMineNum();
        blanktodayMineNum.id = id;
        blanktodayMineNum.mineNum = 0;

        return blanktodayMineNum;
    } else {
        return todayMineNum;
    }
};