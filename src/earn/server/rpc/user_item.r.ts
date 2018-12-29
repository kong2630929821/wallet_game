/**
 * 用户物品接口
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { MAX_ONEDAY_MINING, WARE_NAME } from '../data/constant';
import { Award, AwardList, AwardQuery, BTC, ETH, Hoe, Item, Items, KT, Mine, ST, TodayMineNum } from '../data/db/item.s';
import { add_itemCount, get_award_ids, get_mine_total, get_mine_type, get_today, items_init } from '../util/item_util.r';
import { get_enumType } from '../util/mining_util';
import { getUid } from './user.r';

// 添加矿山
// #[rpc=rpcServer]
export const add_mine = (): Mine => {
    // if (get_mine_total(uid) >= MAX_ONEDAY_MINING) return;
    const uid = getUid();
    const itemType = get_mine_type();
    const item = add_itemCount(uid, itemType, 1);

    return <Mine>item.value;
};

// 查询指定用户物品信息
// #[rpc=rpcServer]
export const item_query = (): Items => {
    const uid = getUid();
    console.log('item query in !!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const userItemBucket = new Bucket(WARE_NAME, Items._$info.name, dbMgr);
    const items = <Items>userItemBucket.get(uid)[0];
    if (!items) {
        items_init(uid);

        return item_query();
    }

    return items;
};

// 获取指定物品信息
// #[rpc=rpcServer]
export const get_item = (itemType: number): Item => {
    console.log('get_item in !!!!!!!!!!!!');
    const itemInfo = item_query();
    if (!itemInfo) return;
    const items = itemInfo.item;
    for (const item of items) {
        if (item.value.num === itemType) {
            const resutlItem = new Item();
            resutlItem.enum_type = get_enumType(itemType);
            resutlItem.value = item.value;
            
            return resutlItem;
        }
    }
};

// 查询用户所有获奖信息
// #[rpc=rpcServer]
export const award_query = (awardQuery:AwardQuery): AwardList => {
    const uid = getUid();
    const src = awardQuery.src;
    const dbMgr = getEnv().getDbMgr();
    let pidList;
    const awardMap = get_award_ids(uid);
    const awardList = new AwardList();
    awardList.uid = uid;
    if (!awardMap.awards) {
        return awardList;
    } else {
        pidList = awardMap.awards;
        const bucket = new Bucket(WARE_NAME, Award._$info.name, dbMgr);
        const awards = bucket.get<[string],[Award]>(pidList);
        if (!awardQuery.src) {
            console.log('awards:!!!!!!!!!!!!!!!!!!!', awards);
            awardList.awards = awards;
        } else {
            const srcAwards = [];
            for (const award of awards) {
                console.log('src:!!!!!!!!!!!!!!!!!!!', award.src);
                if (award.src === src) {
                    srcAwards.push(award);
                    continue;
                }
            }
            console.log('srcAwards:!!!!!!!!!!!!!!!!!!!', srcAwards);
            awardList.awards = srcAwards;
        }

        return awardList;
    }
    
};

// 获取用户持有KT数量