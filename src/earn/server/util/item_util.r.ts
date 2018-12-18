/**
 * 
 */
import { ItemQuery } from '../rpc/itemQuery.s';

import { BTC, ETH, Hoe, Item, Items, KT, Mine, ST } from '../data/db/item.s';

import { Bucket } from '../../utils/db';

import { getEnv } from '../../../pi_pt/net/rpc_server';
import { WARE_NAME } from '../data/constant';
import { get_item, item_query } from '../rpc/user_item.r';

// #[rpc=rpcServer]
export const doTest = (uid: number): Items => {
    console.log('item query in !!!!!!!!!!!!');

    return;
};

// 添加指定数量物品(包含Mine类,todo:mine类count参数大于1异常处理)
export const add_itemCount = (itemQuery: ItemQuery, count: number): Item => {
    const uid = itemQuery.uid;
    const enumNum = itemQuery.enumType;
    const typeNum = itemQuery.itemType;
    const itemInfo = item_query(uid);
    const item = get_item(itemQuery);
    const beforeCount = item.value.count;
    const afterCount = beforeCount + count;
    const items = itemInfo.item;
    // let itemIndex = items.indexOf(item);
    let itemIndex;
    for (const item1 of items) {
        if (item1.value.num === typeNum) {
            itemIndex = items.indexOf(item1);
            break;
        }
    }
    const dbMgr = getEnv().getDbMgr();
    const itemBucket = new Bucket('file', Items._$info.name, dbMgr);
    if (enumNum === 1) {
        const hp = get_mine_hp(typeNum);
        let hpList = [];
        const mine = <Mine>item.value;
        hpList = mine.hps;
        hpList.push(hp);
        mine.count = afterCount;
        mine.hps = hpList;
    } else {
        item.value.count = afterCount;
    }
    items[itemIndex] = item;
    itemInfo.item = items;
    itemBucket.update(uid, itemInfo);

    return item;
};

// 扣除物品(不包含Mine类)
export const reduce_itemCount = (itemQuery: ItemQuery, count: number): Item => {
    const uid = itemQuery.uid;
    const enumNum = itemQuery.enumType;
    const typeNum = itemQuery.itemType;
    const itemInfo = item_query(uid);
    const item = get_item(itemQuery);
    const beforeCount = item.value.count;
    const afterCount = beforeCount - count;
    const items = itemInfo.item;

    let itemIndex;
    for (const item1 of items) {
        if (item1.value.num === typeNum) {
            itemIndex = items.indexOf(item1);
            break;
        }
    }
    const dbMgr = getEnv().getDbMgr();
    const itemBucket = new Bucket('file', Items._$info.name, dbMgr);
    if (enumNum === 1) {
        // todo:异常处理
    } else {
        item.value.count = afterCount;
    }
    items[itemIndex] = item;
    itemInfo.item = items;
    itemBucket.update(uid, itemInfo);

    return item;
};

// 矿山扣血
export const reduce_mine = (itemQuery: ItemQuery, mineNum:number, hits:number): number => {
    const uid = itemQuery.uid;
    const typeNum = itemQuery.itemType;
    const itemInfo = item_query(uid);
    const item = get_item(itemQuery);
    const mine = <Mine>item.value;
    const leftHp = mine.hps[mineNum] - hits;
    // 获取Item对象在数组中的下标
    const items = itemInfo.item;
    const dbMgr = getEnv().getDbMgr();
    const itemBucket = new Bucket(WARE_NAME, Items._$info.name, dbMgr);
    let itemIndex;
    for (const item1 of items) {
        if (item1.value.num === typeNum) {
            itemIndex = items.indexOf(item1);
            break;
        }
    }
    if (leftHp > 0) {
        mine.hps[mineNum] = leftHp;
        item.value = mine;
        items[itemIndex] = item;
        itemInfo.item = items;
        itemBucket.update(uid, itemInfo);

        return leftHp;
    } else {
        mine.count = mine.count - 1;
        mine.hps.splice(mineNum, 1);
        item.value = mine;
        items[itemIndex] = item;
        itemInfo.item = items;
        itemBucket.update(uid, itemInfo);

        return 0;
    }

};

// 用户物品数据库初始化
export const items_init = (uid: number): boolean => {
    console.log('item init in!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const itemBucket = new Bucket('file', Items._$info.name, dbMgr);
    const itemInfo = new Items();
    itemBucket.readAndWrite(uid, (v) => {
        const mine_constractor = (mine: Mine, num: number, count: number, hps: number[]) => {
            mine.num = num;
            mine.count = count;
            mine.hps = hps;
        };
        const hoe_constractor = (mine: Hoe, num: number, count: number) => {
            mine.num = num;
            mine.count = count;
        };
        if (!v[0]) {
            const initCount = 0;
            const hps = [];
            const mine1 = new Mine();
            mine_constractor(mine1, 1001, initCount, hps);
            const mine2 = new Mine();
            mine_constractor(mine2, 1002, initCount, hps);
            const mine3 = new Mine();
            mine_constractor(mine3, 1003, initCount, hps);
            const hoe1 = new Hoe();
            hoe_constractor(hoe1, 2001, initCount);
            const hoe2 = new Hoe();
            hoe_constractor(hoe2, 2002, initCount);
            const hoe3 = new Hoe();
            hoe_constractor(hoe3, 2003, initCount);
            // 账号余额初始化值应从钱包接口获取，暂时为0
            const btc = new BTC();
            btc.num = 3001;
            btc.count = 0;
            const eth = new ETH();
            eth.num = 3002;
            eth.count = 0;
            const st = new ST();
            st.num = 3003;
            st.count = 0;
            const kt = new KT();
            kt.num = 3004;
            kt.count = 0;
            const itemsTmp = [mine1, mine2, mine3, hoe1, hoe2, hoe3, btc, eth, st, kt];
            const items: Item[] = [];
            for (let i = 0; i < 10; i++) {
                items[i] = new Item();
                if (i >= 0 && i < 3) {
                    items[i].enum_type = 1;
                    items[i].value = itemsTmp[i];
                    continue;
                }
                if (i > 2 && i < 6) {
                    items[i].enum_type = 2;
                    items[i].value = itemsTmp[i];
                    continue;
                } else {
                    items[i].enum_type = i - 3;
                    items[i].value = itemsTmp[i];
                    continue;
                }
            }
            itemInfo.uid = uid;
            itemInfo.item = items;
        }

        return itemInfo;
    });

    return true;
};

// 随机(根据配置)获取矿山类型
// export const get_mine_type = ():number => {

// }

// 根据配置返回指定类型矿山的血量
export const get_mine_hp = (mineType: number): number => {
    return 100; // test
};