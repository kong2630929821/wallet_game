/**
 * 
 */
import { Award, AwardMap, BTC, ConvertTab, ETH, Hoe, Item, Items, KT, Mine, MineHp, SpecialAward, ST, Ticket } from '../data/db/item.s';

import { Bucket } from '../../utils/db';

import { randomInt } from '../../../pi/util/math';
import { iterDb, read } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { AwardConvertCfg, ItemInitCfg, MineHpCfg } from '../../xlsx/item.s';
import { BTC_ENUM_NUM, BTC_TYPE, DIAMOND_HOE_TYPE, ETH_ENUM_NUM, ETH_TYPE, GET_RANDOM_MINE, GOLD_HOE_TYPE, HOE_ENUM_NUM, HUGE_MINE_TYPE, INDEX_PRIZE, IRON_HOE_TYPE, KT_ENUM_NUM, KT_TYPE, MAX_TYPE_NUM, MEMORY_NAME, MIDDLE_MINE_TYPE, MINE_ENUM_NUM, SMALL_MINE_TYPE, ST_ENUM_NUM, ST_TYPE, THE_ELDER_SCROLLS, TICKET_ENUM_NUM, WARE_NAME } from '../data/constant';
import { get_index_id } from '../data/util';
import { IsOk } from '../rpc/test.s';
import { getUid } from '../rpc/user.r';
import { get_item, item_query } from '../rpc/user_item.r';
import { doAward } from './award.t';
import { get_enumType } from './mining_util';
import { RandomSeedMgr } from './randomSeedMgr';

// 添加兑换码
// #[rpc=rpcServer]
export const add_convert = ():IsOk => {
    console.log('add_convert in !!!!!!!!!!!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(MEMORY_NAME, AwardConvertCfg._$info.name, dbMgr);
    const iter = bucket.iter(null);
    const ids = [];
    const converts = [];
    do {
        const iterEle = iter.nextElem();
        console.log('elCfg----------------read---------------', iterEle);
        if (!iterEle) break;
        const iterConvert:ConvertTab = iterEle[1];
        ids.push(iterConvert.id);
        converts.push(iterConvert);
    } while (iter);
    const tabBucket = new Bucket(WARE_NAME, ConvertTab._$info.name, dbMgr);
    const ok = new IsOk();
    console.log('converts !!!!!!!!!!!!!!!!!!!!!!!', converts);
    ok.isok =  tabBucket.put(ids, converts);
    console.log('isok !!!!!!!!!!!!!!!!!!!!!!!', ok.isok);
    
    return ok;
};

// 添加奖品
export const add_award = (uid:number, itemType:number, count:number, src:string, convert?:string, desc?:string):Award => {
    const time = (new Date()).valueOf();
    console.log('time!!!!!!!!!!!!!!!!!:', time);
    const awardid = `${time}${uid}${randomInt(10000, 99999)}`;
    const dbMgr = getEnv().getDbMgr();
    const award = new Award();
    award.id = awardid;
    award.awardType = itemType;
    award.count = count;
    award.src = src;
    award.uid = uid;
    award.time = time.toString();
    console.log('award.time!!!!!!!!!!!!!!!!!:', award.time);
    if (convert) award.convert = convert;
    if (desc) award.desc = desc;
    
    // 写入奖励表
    const bucket = new Bucket(WARE_NAME, Award._$info.name, dbMgr);
    bucket.put(awardid, award);
    // 写入奖励MAP表
    const awardMap = <AwardMap>get_award_ids(uid);
    let awardList = [];
    awardList = awardMap.awards;
    awardList.push(awardid);
    console.log('awardList!!!!!!!!!!!!!!!!!:', awardList);
    const mapBucket = new Bucket(WARE_NAME, AwardMap._$info.name, dbMgr);
    awardMap.awards = awardList;
    mapBucket.put(uid, awardMap);

    // 写入特别奖励表
    if (itemType === BTC_TYPE || itemType === ETH_TYPE || itemType === ST_TYPE) {
        const specialAward = new SpecialAward();
        specialAward.id = awardid;
        specialAward.awardType = itemType;
        specialAward.count = count;
        specialAward.src = src;
        specialAward.uid = uid;
        specialAward.time = time.toString();
        const specialAwardbucket = new Bucket(WARE_NAME, SpecialAward._$info.name, dbMgr);
        specialAwardbucket.put(awardid, specialAward);
    }
    
    return award;
};

// 添加指定数量物品(包含Mine类)
export const add_itemCount = (uid:number, itemType:number, count: number): Item => {
    console.log('add_itemCount in!!!!!!!!!!!!!!', itemType);
    if (count < 0) return;
    const enumNum = get_enumType(itemType);
    const typeNum = itemType;
    const itemInfo = item_query();
    const item = get_item(itemType);
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
        const mineHp = new MineHp();
        mineHp.hp = get_mine_hp(typeNum);
        const index = `${uid}:${mineHp.hp}`;
        mineHp.num = get_index_id(index);
        console.log('hp:!!!!!!!!!!!!!!', mineHp);
        let hpList = [];
        const mine = <Mine>item.value;
        hpList = mine.hps;
        hpList.push(mineHp);
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
export const reduce_itemCount = (itemType: number, count: number): Item => {
    console.log('reduce_item in!!!!!!!!!!!!!!');
    const uid = getUid();
    const enumNum = get_enumType(itemType);
    const itemInfo = item_query();
    const item = get_item(itemType);
    const beforeCount = item.value.count;
    const afterCount = beforeCount - count;
    console.log('afterCount !!!!!!!!!!!!!!', afterCount);
    if (afterCount < 0) return;
    const items = itemInfo.item;
    let itemIndex;
    for (const item1 of items) {
        if (item1.value.num === itemType) {
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
export const reduce_mine = (itemType: number, mineNum:number, hits:number): number => {
    console.log('reduce_mine in!!!!!!!!!!!!!!', mineNum);
    const uid = getUid();
    const typeNum = itemType;
    const itemInfo = item_query();
    const item = get_item(itemType);
    const mine = <Mine>item.value;
    const hps = mine.hps;
    let leftHp;
    console.log('mine.hps.length!!!!!!!!!!!!!!', mine.hps.length);
    for (let i = 0; i < hps.length; i ++) {
        console.log('mine index!!!!!!!!!!!!!!', i);
        if (hps[i].num === mineNum) {
            console.log('mine HP!!!!!!!!!!!!!!', hps[i]);
            leftHp = mine.hps[i].hp;
            leftHp -= hits;
            hps[i].hp = leftHp;
            console.log('mineHp!!!!!!!!!!!!!!', hps[i]);
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
                item.value = mine;
                items[itemIndex] = item;
                itemInfo.item = items;
                itemBucket.update(uid, itemInfo);
        
                return leftHp;
            } else {
                console.log('mine HP zero!!!!!!!!!!!!!!');
                mine.count = mine.count - 1;
                mine.hps.splice(i, 1);
                item.value = mine;
                items[itemIndex] = item;
                itemInfo.item = items;
                itemBucket.update(uid, itemInfo);
        
                return 0;
            }
        }
    }

    return;
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
export const get_mine_total = ():number => {
    console.log('!!!!!!!!!!!!!!get_mine_total:');
    const items = item_query().item;
    let mineTotal = 0;
    for (let i = 0; i < items.length; i ++) {
        if (items[i].enum_type === 1) {
            mineTotal = mineTotal + items[i].value.count;
            continue;
        }
    }
    console.log('!!!!!!!!!!!!!!mineTotal:', mineTotal);

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