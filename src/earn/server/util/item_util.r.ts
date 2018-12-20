/**
 * 
 */
import { ItemQuery } from '../rpc/itemQuery.s';

import { BTC, ETH, Hoe, Item, Items, KT, Mine, ST } from '../data/db/item.s';

import { Bucket } from '../../utils/db';

import { randomInt } from '../../../pi/util/math';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { MineHpCfg } from '../../xlsx/item.s';
import { MEMORY_NAME, WARE_NAME } from '../data/constant';
import { get_item, item_query } from '../rpc/user_item.r';
import { doAward } from './award.t';
import { RandomSeedMgr } from './randomSeedMgr';

// #[rpc=rpcServer]
export const doTest = (uid: number): Items => {
    console.log('item query in !!!!!!!!!!!!');

    return;
};

// 添加指定数量物品(包含Mine类,todo:mine类count参数大于1异常处理)
export const add_itemCount = (itemQuery: ItemQuery, count: number): Item => {
    console.log('add_itemCount in!!!!!!!!!!!!!!');
    const uid = itemQuery.uid;
    const enumNum = itemQuery.enumType;
    const typeNum = itemQuery.itemType;
    const itemInfo = item_query(uid);
    const item = get_item(itemQuery);
    const beforeCount = item.value.count;
    console.log('beforeCount:!!!!!!!!!!!!!!', beforeCount);
    const afterCount = beforeCount + count;
    console.log('afterCount:!!!!!!!!!!!!!!', afterCount);
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
        if (count > 1) return;
        const hp = get_mine_hp(typeNum);
        console.log('hp:!!!!!!!!!!!!!!', hp);
        let hpList = [];
        const mine = <Mine>item.value;
        hpList = mine.hps;
        hpList.push(hp);
        mine.count = afterCount;
        mine.hps = hpList;
        console.log('mine:!!!!!!!!!!!!!!', mine);
    } else {
        item.value.count = afterCount;
    }
    items[itemIndex] = item;
    itemInfo.item = items;
    itemBucket.update(uid, itemInfo);
    item.value.count = count;

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
    if (afterCount < 0) return;
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
    console.log('reduce_mine in!!!!!!!!!!!!!!');
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
            eth.num = 4001;
            eth.count = 0;
            const st = new ST();
            st.num = 5001;
            st.count = 0;
            const kt = new KT();
            kt.num = 6001;
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

// 获取矿山总数
export const get_mine_total = (uid:number):number => {
    const items = item_query(uid).item;
    let mineTotal = 0;
    for (let i = 0; i < item_query.length; i ++) {
        if (items[i].enum_type === 1) {
            mineTotal = mineTotal + items[i].value.count;
            continue;
        }
    }

    return mineTotal;
};

// 随机(根据配置)获取矿山类型
export const get_mine_type = ():number => {
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const pid = 100401; // 配置中按权重获取矿山类型的主键
    const v = [];
    doAward(pid, randomMgr, v);
    // console.log('doAward v:!!!!!!!!!!!!!', v);
    
    return v[0][0];
};

// 根据配置返回指定类型矿山的血量
export const get_mine_hp = (mineType: number): number => {
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(MEMORY_NAME, MineHpCfg._$info.name, dbMgr);
    console.log('doAward v:!!!!!!!!!!!!!', bucket.get(mineType)[0]);

    return bucket.get(mineType)[0].hp;
};