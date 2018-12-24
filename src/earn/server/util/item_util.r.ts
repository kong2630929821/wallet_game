/**
 * 
 */
import { ItemQuery } from '../rpc/itemQuery.s';

import { AwardMap, BTC, ETH, Hoe, Item, Items, KT, Mine, Prizes, ST, Ticket } from '../data/db/item.s';

import { Bucket } from '../../utils/db';

import { randomInt } from '../../../pi/util/math';
import { iterDb, read } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { ItemInitCfg, MineHpCfg } from '../../xlsx/item.s';
import { BTC_ENUM_NUM, BTC_TYPE, DIAMOND_HOE_TYPE, ETH_ENUM_NUM, ETH_TYPE, GET_RANDOM_MINE, GOLD_HOE_TYPE, HOE_ENUM_NUM, HUGE_MINE_TYPE, INDEX_PRIZE, IRON_HOE_TYPE, KT_ENUM_NUM, KT_TYPE, MAX_TYPE_NUM, MEMORY_NAME, MIDDLE_MINE_TYPE, MINE_ENUM_NUM, SMALL_MINE_TYPE, ST_ENUM_NUM, ST_TYPE, TICKET_ENUM_NUM, WARE_NAME } from '../data/constant';
import { get_index_id } from '../data/util';
import { get_item, item_query } from '../rpc/user_item.r';
import { doAward } from './award.t';
import { RandomSeedMgr } from './randomSeedMgr';

// #[rpc=rpcServer]
export const doTest = (uid: number): Items => {
    console.log('item query in !!!!!!!!!!!!');

    return;
};

// 添加奖品
export const add_award = (itemQuery:ItemQuery, count:number, src:string):Item => {
    const uid = itemQuery.uid;
    const item = add_itemCount(itemQuery, count);
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Prizes._$info.name, dbMgr);
    const prizeid = get_index_id(INDEX_PRIZE);
    // 奖励详情写入数据库
    console.log('prizeid!!!!!!!!!!!!!!!!!:', prizeid);
    const prize = new Prizes();
    prize.id = prizeid;
    prize.prize = item;
    prize.src = src;
    prize.uid = uid;
    prize.time = new Date().valueOf();
    bucket.put(prizeid, prize);
    const awardMap = <AwardMap>get_award_ids(uid);
    let awardList = [];
    awardList = awardMap.awards;
    awardList.push(prizeid);
    console.log('awardList!!!!!!!!!!!!!!!!!:', awardList);
    const mapBucket = new Bucket(WARE_NAME, AwardMap._$info.name, dbMgr);
    awardMap.awards = awardList;
    mapBucket.put(uid, awardMap);
    console.log('db write ok!!!!!!!!!!!!!!!!!:');

    return item;
};

// 添加指定数量物品(包含Mine类,todo:mine类count参数大于1异常处理)
export const add_itemCount = (itemQuery: ItemQuery, count: number): Item => {
    console.log('add_itemCount in!!!!!!!!!!!!!!', itemQuery);
    if (count < 0) return;
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
            console.log('itemIndex:!!!!!!!!!!!!!!', itemIndex);
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
    } else {
        item.value.count = afterCount;
    }
    items[itemIndex] = item;
    itemInfo.item = items;
    itemBucket.put(uid, itemInfo);
    item.value.count = count;

    return item;
};

// 扣除物品(不包含Mine类)
export const reduce_itemCount = (itemQuery: ItemQuery, count: number): Item => {
    console.log('reduce_item in!!!!!!!!!!!!!!');
    const uid = itemQuery.uid;
    const enumNum = itemQuery.enumType;
    const typeNum = itemQuery.itemType;
    const itemInfo = item_query(uid);
    const item = get_item(itemQuery);
    const beforeCount = item.value.count;
    const afterCount = beforeCount - count;
    console.log('afterCount !!!!!!!!!!!!!!', afterCount);
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
    const itemBucket = new Bucket(WARE_NAME, Items._$info.name, dbMgr);
    if (enumNum === 1) {
        return;
    } else {
        item.value.count = afterCount;
    }
    items[itemIndex] = item;
    itemInfo.item = items;
    itemBucket.put(uid, itemInfo);

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
export const items_init1 = (uid: number): boolean => {
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
            mine_constractor(mine1, SMALL_MINE_TYPE, initCount, hps);
            const mine2 = new Mine();
            mine_constractor(mine2, MIDDLE_MINE_TYPE, initCount, hps);
            const mine3 = new Mine();
            mine_constractor(mine3, HUGE_MINE_TYPE, initCount, hps);
            const hoe1 = new Hoe();
            hoe_constractor(hoe1, IRON_HOE_TYPE, initCount);
            const hoe2 = new Hoe();
            hoe_constractor(hoe2, GOLD_HOE_TYPE, initCount);
            const hoe3 = new Hoe();
            hoe_constractor(hoe3, DIAMOND_HOE_TYPE, initCount);
            // 账号余额初始化值应从钱包接口获取，暂时为0
            const btc = new BTC();
            btc.num = BTC_TYPE;
            btc.count = 0;
            const eth = new ETH();
            eth.num = ETH_TYPE;
            eth.count = 0;
            const st = new ST();
            st.num = ST_TYPE;
            st.count = 0;
            const kt = new KT();
            kt.num = KT_TYPE;
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

// 用户物品数据库根据配置初始化
export const items_init = (uid: number) => {
    console.log('item init in!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const itemInfo = new Items();
    const items = [];
    read(dbMgr, (tr: Tr) => {
        const iterCfg = iterDb(tr, MEMORY_NAME, ItemInitCfg._$info.name, 0, false, null); // 取from表的迭代器
        console.log('!!!!!!!!!!!!!!iterCfg:', iterCfg);
        let maxid = MAX_TYPE_NUM;
        do {
            const elCfg = iterCfg.nextElem();
            if (!elCfg) return;
            console.log('elCfg----------------read---------------', elCfg);
            const cfg:ItemInitCfg = elCfg[1];
            const enumNum = cfg.enumNum;
            const typeNum = cfg.typeNum;
            const count = cfg.count;
            switch (enumNum) {
                case MINE_ENUM_NUM:
                    const mine = new Mine();
                    mine.num = typeNum;
                    mine.count = count;
                    mine.hps = [];
                    const itemMine = new Item(enumNum, mine);
                    items.push(itemMine);
                    break;
                case HOE_ENUM_NUM:
                    const hoe = new Hoe();
                    hoe.num = typeNum;
                    hoe.count = count;
                    const itemHoe = new Item(enumNum, hoe);
                    items.push(itemHoe);
                    break;
                case BTC_ENUM_NUM:
                    const btc = new BTC();
                    btc.num = typeNum;
                    btc.count = count;
                    const itemBtc = new Item(enumNum, btc);
                    items.push(itemBtc);
                    break;
                case ETH_ENUM_NUM:
                    const eth = new ETH();
                    eth.num = typeNum;
                    eth.count = count;
                    const itemEth = new Item(enumNum, eth);
                    items.push(itemEth);
                    break;
                case ST_ENUM_NUM:
                    const st = new ST();
                    st.num = typeNum;
                    st.count = count;
                    const itemSt = new Item(enumNum, st);
                    items.push(itemSt);
                    break;
                case KT_ENUM_NUM:
                    const kt = new KT();
                    kt.num = typeNum;
                    kt.count = count;
                    const itemKt = new Item(enumNum, kt);
                    items.push(itemKt);
                    break;
                case TICKET_ENUM_NUM:
                    const ticket = new Ticket();
                    ticket.num = typeNum;
                    ticket.count = count;
                    const itemTicket = new Item(enumNum, ticket);
                    items.push(itemTicket);
                    break;
                default:
            }
            console.log('!!!!!!!!!!!!!!ITEMS:', items);
            maxid --;
        } while (maxid > 0);
    });
    itemInfo.uid = uid;
    itemInfo.item = items;
    const bucket = new Bucket(WARE_NAME, Items._$info.name, dbMgr);
    bucket.put(uid, itemInfo);
    
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
    const pid = GET_RANDOM_MINE; // 配置中按权重获取矿山类型的主键
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

// 获取用户获奖id列表
export const get_award_ids = (uid: number): AwardMap => {
    console.log('get_award_ids in !!!!!!!!!!!!!!!', uid);
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, AwardMap._$info.name, dbMgr);
    const awardMap = bucket.get<number, [AwardMap]>(uid)[0];
    if (!awardMap) {
        const blankAwardMap = new AwardMap();
        blankAwardMap.uid = uid;
        blankAwardMap.awards = [];
        console.log('null awardMap in !!!!!!!!!!!!!!!', blankAwardMap);

        return blankAwardMap;
    } else {
        return awardMap;
    }
};

// 获取1970年1月1日距今的时间(单位：天)
export const get_today  = ():number => {
    const timestamps = new Date().getTime();
    console.log('timestamps !!!!!!!!!!!!!!!', timestamps);

    return Math.round(timestamps / (1000 * 60 * 60 * 24));
};