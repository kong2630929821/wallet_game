import { ItemQuery, SpecificMine } from "../rpc/itemQuery.s";

import { Item, Mine, Items, Hoe, BTC, ETH, ST, KT } from "../data/db/item.s";

import { Bucket } from "../../utils/db";

import { USER_ITEMS_TABLE } from "../data/constant";
import { item_query, get_item } from "../rpc/user_item.r";
import { getEnv } from "../../pi_pt/net/rpc_server";

//添加制定数量物品(包含Mine类,todo:mine类count参数大于1异常处理)
export const add_itemCount = (itemQuery: ItemQuery, count: number): Item => {
    let uid = itemQuery.uid;
    let enumNum = itemQuery.enumType;
    let typeNum = itemQuery.itemType;
    let itemInfo = item_query(uid)
    let item = get_item(itemQuery);
    let beforeCount = item.value.count;
    let afterCount = beforeCount + count;
    let items = itemInfo.item;
    // let itemIndex = items.indexOf(item);
    for (let item1 of items) {
        if (item1.value.num === typeNum) {
            var itemIndex = items.indexOf(item1);
            break;
        }
    }
    const dbMgr = getEnv().getDbMgr();
    const itemBucket = new Bucket('file', USER_ITEMS_TABLE, dbMgr);
    if (enumNum === 1) {
        let hp = get_mine_hp(typeNum);
        let hpList = [];
        let mine = <Mine>item.value;
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

//扣除物品(不包含Mine类)
export const reduce_itemCount = (itemQuery: ItemQuery, count: number): Item => {
    let uid = itemQuery.uid;
    let enumNum = itemQuery.enumType;
    let typeNum = itemQuery.itemType;
    let itemInfo = item_query(uid)
    let item = get_item(itemQuery);
    let beforeCount = item.value.count;
    let afterCount = beforeCount - count;
    let items = itemInfo.item;
    for (let item1 of items) {
        if (item1.value.num === typeNum) {
            var itemIndex = items.indexOf(item1);
            break;
        }
    }
    const dbMgr = getEnv().getDbMgr();
    const itemBucket = new Bucket('file', USER_ITEMS_TABLE, dbMgr);
    if (enumNum === 1) {
        //todo:异常处理
    } else {
        item.value.count = afterCount;
    }
    items[itemIndex] = item;
    itemInfo.item = items;
    itemBucket.update(uid, itemInfo);
    return item;
};

export const reduce_mine = (itemQuery: ItemQuery, mineNum): boolean => {
    let uid = itemQuery.uid;
    let enumNum = itemQuery.enumType;
    if (enumNum === 1) {
        let typeNum = itemQuery.itemType;
        let itemInfo = item_query(uid)
        let item = get_item(itemQuery);
        let mine = <Mine>item.value;
        mine.count = mine.count - 1;
        mine.hps.splice(mineNum, 1);
        let items = itemInfo.item;
        for (let item1 of items) {
            if (item1.value.num === typeNum) {
                var itemIndex = items.indexOf(item1);
                break;
            }
        }
        const dbMgr = getEnv().getDbMgr();
        const itemBucket = new Bucket('file', USER_ITEMS_TABLE, dbMgr);
        items[itemIndex] = item;
        itemInfo.item = items;
        itemBucket.update(uid, itemInfo);
        return true;
    } else {
        return false;
    }

};

//用户物品数据库初始化
export const items_init = (uid: number): boolean => {
    console.log("item init in!!!!!!!!!!!!!")
    const dbMgr = getEnv().getDbMgr();
    const itemBucket = new Bucket('file', USER_ITEMS_TABLE, dbMgr);
    let itemInfo = new Items();
    itemBucket.readAndWrite(uid, (v) => {
        const mine_constractor = (mine: Mine, num: number, count: number, hps: Array<number>) => {
            mine.num = num;
            mine.count = count;
            mine.hps = hps;
        }
        const hoe_constractor = (mine: Hoe, num: number, count: number) => {
            mine.num = num;
            mine.count = count;
        }
        if (!v[0]) {
            let initCount = 0;
            let hps = [];
            let mine1 = new Mine();
            mine_constractor(mine1, 1001, initCount, hps);
            let mine2 = new Mine();
            mine_constractor(mine2, 1002, initCount, hps);
            let mine3 = new Mine();
            mine_constractor(mine3, 1003, initCount, hps);
            let hoe1 = new Hoe();
            hoe_constractor(hoe1, 2001, initCount);
            let hoe2 = new Hoe();
            hoe_constractor(hoe2, 2002, initCount);
            let hoe3 = new Hoe();
            hoe_constractor(hoe3, 2003, initCount);
            //账号余额初始化值应从钱包接口获取，暂时为0
            let btc = new BTC();
            btc.num = 3001;
            btc.count = 0;
            let eth = new ETH();
            eth.num = 3002;
            eth.count = 0;
            let st = new ST();
            st.num = 3003;
            st.count = 0;
            let kt = new KT();
            kt.num = 3004;
            kt.count = 0;
            let itemsTmp = [mine1, mine2, mine3, hoe1, hoe2, hoe3, btc, eth, st, kt];
            let items: Array<Item> = [];
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

//随机(根据配置)获取矿山类型
// export const get_mine_type = ():number => {

// }

//根据配置返回指定类型矿山的血量
export const get_mine_hp = (mineType: number): number => {
    return 100; //test
};