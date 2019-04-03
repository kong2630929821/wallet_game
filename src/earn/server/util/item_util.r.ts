/**
 * 
 */
import { Award, AwardMap, BTC, ConvertTab, ETH, Hoe, Item, Items, KT, Mine, MineHp, SpecialAward, ST, Ticket } from '../data/db/item.s';

import { Bucket } from '../../utils/db';

import { Tr } from '../../../pi/db/mgr';
import { Env } from '../../../pi/lang/env';
import { randomInt } from '../../../pi/util/math';
import { TaskAwardCfg } from '../../xlsx/awardCfg.s';
import { ItemInitCfg, MedalCfg, MineHpCfg } from '../../xlsx/item.s';
import { AWARD_SRC_MINE, AWARD_SRC_MINE_PRE, BTC_ENUM_NUM, BTC_TYPE, BTC_UNIT_NUM, BTC_WALLET_TYPE, DIAMOND_HOE_TYPE, ETH_ENUM_NUM, ETH_TYPE, ETH_UNIT_NUM, ETH_WALLET_TYPE, GET_RANDOM_MINE, GOLD_HOE_TYPE, HOE_ENUM_NUM, HUGE_MINE_TYPE, INDEX_PRIZE, IRON_HOE_TYPE, KT_ENUM_NUM, KT_TYPE, KT_UNIT_NUM, KT_WALLET_TYPE, MAX_TYPE_NUM, MEDAL_BTC, MEDAL_ETH, MEDAL_KT0, MEDAL_ST, MEMORY_NAME, MESSAGE_TYPE_ADDAWARD, MESSAGE_TYPE_ADDMEDAL, MIDDLE_MINE_TYPE, MINE_ENUM_NUM, SMALL_MINE_TYPE, ST_ENUM_NUM, ST_TYPE, ST_UNIT_NUM, ST_WALLET_TYPE, SURPRISE_BRO, THE_ELDER_SCROLLS, TICKET_ENUM_NUM, WALLET_API_ALTER, WARE_NAME } from '../data/constant';
import { Achievements, AddMedal, Medals, ShowMedal } from '../data/db/medal.s';
import { Task, UserTaskTab } from '../data/db/user.s';
import { get_index_id } from '../data/util';
import { mqtt_send } from '../rpc/dbWatcher.r';
import { get_miningKTNum } from '../rpc/mining.r';
import { IsOk } from '../rpc/test.s';
import { getOpenid, getUid } from '../rpc/user.r';
import { get_item, item_query, show_medal } from '../rpc/user_item.r';
import { doAward } from './award.t';
import { get_cfgAwardid, get_enumType } from './mining_util';
import { oauth_alter_balance, oauth_send } from './oauth_lib';
import { RandomSeedMgr } from './randomSeedMgr';
import { send } from './sendMessage';

declare var env: Env;

// 添加奖品
export const add_award = (uid:number, itemType:number, count:number, src:string, convert?:string, desc?:string, deadTime?:string):Award => {
    const time = (new Date()).valueOf();
    console.log('time!!!!!!!!!!!!!!!!!:', time);
    const awardid = `${time}${uid}${randomInt(10000, 99999)}`;
    const award = new Award();
    award.id = awardid;
    award.awardType = itemType;
    award.count = count;
    award.src = src;
    award.uid = uid;
    award.time = time.toString();
    if (convert) award.convert = convert;
    if (desc) award.desc = desc;
    if (deadTime) award.deadTime = deadTime;
    console.log('award!!!!!!!!!!!!!!!!!:', award);
    // 写入奖励表
    const bucket = new Bucket(WARE_NAME, Award._$info.name);
    bucket.put(awardid, award);
    // 写入奖励MAP表
    const awardMap = <AwardMap>get_award_ids(uid);
    console.log('awardMap!!!!!!!!!!!!!!!!!:', awardMap);
    let awardList = [];
    awardList = awardMap.awards;
    awardList.push(awardid);
    console.log('awardList!!!!!!!!!!!!!!!!!:', awardList);
    const mapBucket = new Bucket(WARE_NAME, AwardMap._$info.name);
    awardMap.awards = awardList;
    mapBucket.put(uid, awardMap);
    // 向钱包添加奖励相应的货币
    if (itemType === BTC_TYPE || itemType === ETH_TYPE || itemType === ST_TYPE || itemType === KT_TYPE) {
        // 如果向钱包改动数据失败，返回错误码
        if (!oauth_alter_balance(itemType, awardid, count)) {
            award.desc = '-1';
        }
        // 写入特别奖励表
        console.log('add_special before!!!!!!!!!!!!!!!!!:', itemType, src);
        if ((itemType === BTC_TYPE || itemType === ETH_TYPE || itemType === ST_TYPE) && (src === AWARD_SRC_MINE)) {
            console.log('add_special in!!!!!!!!!!!!!!!!!:');
            const specialAward = new SpecialAward();
            specialAward.id = THE_ELDER_SCROLLS;
            specialAward.awardType = itemType;
            specialAward.count = count;
            specialAward.src = src;
            specialAward.uid = uid;
            specialAward.openid = getOpenid();
            specialAward.time = time.toString();
            const specialAwardbucket = new Bucket(WARE_NAME, SpecialAward._$info.name);
            specialAwardbucket.put(THE_ELDER_SCROLLS, specialAward);
        }
    }
    // 推送奖励信息
    send(uid, MESSAGE_TYPE_ADDAWARD, JSON.stringify(award));

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
    const itemBucket = new Bucket('file', Items._$info.name);
    if (enumNum === 1) { // 添加物品为矿山时
        if (count > 1) return; // 拒绝批量添加矿山
        const mineHp = new MineHp();
        mineHp.hp = get_mine_hp(typeNum);
        const index = `${uid}:${mineHp.hp}`;
        mineHp.num = get_index_id(index);
        const v = [];
        const seed = Math.floor(Math.random() * 233280 + 1);
        const randomMgr = new RandomSeedMgr(seed);
        const mineType = itemType;
        const pid = get_cfgAwardid(mineType); // 配置奖励权重主键
        doAward(pid, randomMgr, v);
        console.log('award result!!!!!!!!!!!!!!!!!:', v);
        const itemNum = v[0][0];
        const itemCount = v[0][1];
        // 添加矿山的奖励属性
        if (itemNum !== SURPRISE_BRO) {   // 随机奖励不为空添加奖励属性
            const award = new Award(AWARD_SRC_MINE_PRE, itemNum, itemCount, uid, AWARD_SRC_MINE_PRE);
            mineHp.award = award;
        }
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
    // 向钱包扣除相应的货币
    if (itemType === BTC_TYPE || itemType === ETH_TYPE || itemType === ST_TYPE || itemType === KT_TYPE) {
        const time = (new Date()).valueOf();
        const oid = `${time}${uid}${randomInt(10000, 99999)}`;
        if (!oauth_alter_balance(itemType, oid, -count)) {
            return;
        }

        return item;
    }
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
    const itemBucket = new Bucket(WARE_NAME, Items._$info.name);
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
export const reduce_mine = (itemType: number, mineNum:number, hits:number): MineHp => {
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
            const itemBucket = new Bucket(WARE_NAME, Items._$info.name);
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
        
            } else {
                console.log('mine HP zero!!!!!!!!!!!!!!');
                mine.count = mine.count - 1;
                mine.hps.splice(i, 1);
                item.value = mine;
                items[itemIndex] = item;
                itemInfo.item = items;
                itemBucket.update(uid, itemInfo);
        
                leftHp = 0;
            }
            const mineHp = new MineHp();
            mineHp.hp = leftHp;
            if (mine.hps[i].award)  mineHp.award = mine.hps[i].award;
            mineHp.num = mineNum;

            return mineHp;
        }
    }

    return;
};

// 挖矿添加奖章
export const mining_add_medal = (uid:number, itemType:number) => {
    console.log('Mining_add_medal!!!!!!!!!!!!!!!!', itemType);
    const bucket = new Bucket(MEMORY_NAME, MedalCfg._$info.name);
    if (itemType === KT_TYPE) {
        const ktNum = get_miningKTNum(uid).total;
        console.log('KTnum!!!!!!!!!!!!!!!!', ktNum);
        const iter = bucket.iter(null, true);
        let pushMsg = true;
        do {
            const iterCfg = iter.next();
            console.log('elCfg----------------read---------------', iterCfg);
            if (!iterCfg) {
                break;
            }
            const medalCfg:MedalCfg = iterCfg[1];  
            if (medalCfg.coinType === itemType && ktNum >= medalCfg.coinNum) {
                console.log('pushMsg!!!!!!!!!!!!!!!!!!!!!', pushMsg);
                if (pushMsg === true) {
                    showMedal(medalCfg.id); // 挂出用户最新的等级奖章
                    console.log('do showMedal!!!!!!!!!!!!!!!!!!!!!');
                }
                add_medal(uid, medalCfg.id, pushMsg);
                pushMsg = false;
            }
        } while (iter);
    }
    if (itemType === ST_TYPE) {
        add_achievement(uid, MEDAL_ST);
    }
    if (itemType === ETH_TYPE) {
        add_achievement(uid, MEDAL_ETH);
    }
    if (itemType === BTC_TYPE) {
        add_achievement(uid, MEDAL_BTC);
    }
};

// 添加奖章
export const add_medal = (uid:number, medalType: number, pushMsg: boolean): boolean => {
    console.log('add_medal in!!!!!!!!!!!!!');
    const bucket = new Bucket(WARE_NAME, Medals._$info.name);
    let medals = bucket.get<number, [Medals]>(uid)[0];
    if (!medals) {
        medals = new Medals();
        medals.uid = uid;
        medals.medals = [];
    } else {
        for (const medal of medals.medals) {
            if (medal === medalType) {
                return false;
            }
        }
    }
    medals.medals.push(medalType);
    bucket.put(uid, medals);
    // 推送获得奖章的信息
    if (pushMsg) send(uid, MESSAGE_TYPE_ADDMEDAL, medalType.toString());
};

// 挂奖章
export const showMedal = (medalType: number) => {
    console.log('showMedal in!!!!!!!!!!!!!!!!!', medalType);
    const bucket = new Bucket(WARE_NAME, ShowMedal._$info.name);
    const uid = getUid();
    if (!uid) return;
    const showMedal = new ShowMedal();
    showMedal.uid = uid;
    showMedal.medal = medalType;
    bucket.put(uid, showMedal);
};

// 添加成就
export const add_achievement = (uid:number, achievementType: number): boolean => {
    add_medal(uid, achievementType, true);
    const bucket = new Bucket(WARE_NAME, Achievements._$info.name);
    let achievements = bucket.get<number, [Achievements]>(uid)[0];
    if (!achievements) {
        achievements = new Achievements();
        achievements.uid = uid;
        achievements.achievements = [];
    } else {
        for (const achievement of achievements.achievements) {
            if (achievement === achievementType) {
                return false;
            }
        }
    }
    achievements.achievements.push(achievementType);
    bucket.put(uid, achievements);
};

// 用户物品数据库根据配置初始化
export const items_init = (uid: number) => {
    console.log('item init in!!!!!!!!!!!!!');
    const dbMgr = env.dbMgr;
    const itemInfo = new Items();
    const items = [];
    dbMgr.read((tr: Tr) => {
        const iterCfg = tr.iter_raw(MEMORY_NAME, ItemInitCfg._$info.name, 0, false, null); // 取from表的迭代器
        console.log('!!!!!!!!!!!!!!iterCfg:', iterCfg);
        let maxid = MAX_TYPE_NUM;
        do {
            const elCfg = iterCfg.next();
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
    const bucket = new Bucket(WARE_NAME, Items._$info.name);
    bucket.put(uid, itemInfo);
};

// 初始化用户任务列表
export const task_init = (uid: number) => {
    console.log('!!!!!!!!!!!!!!task_init in');
    const userTaskBucket = new Bucket(WARE_NAME, UserTaskTab._$info.name);
    const taskCfgBucket = new Bucket(MEMORY_NAME, TaskAwardCfg._$info.name);
    const iter = taskCfgBucket.iter(null);
    const taskList:Task[] = [];
    do {
        const iterEle = iter.next();
        console.log('elCfg----------------read---------------', iterEle);
        if (!iterEle) break;
        const taskCfg: TaskAwardCfg = iterEle[1];
        const task = new Task(taskCfg.id, taskCfg.prop, taskCfg.num, 0, taskCfg.name);
        taskList.push(task);
    } while (iter);
    const userTask = new UserTaskTab(uid, taskList);
    userTaskBucket.put(uid, userTask);
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
    const bucket = new Bucket(MEMORY_NAME, MineHpCfg._$info.name);
    console.log('doAward v:!!!!!!!!!!!!!', bucket.get(mineType)[0]);

    return bucket.get(mineType)[0].hp;
};

// 获取用户获奖id列表
export const get_award_ids = (uid: number): AwardMap => {
    console.log('get_award_ids in !!!!!!!!!!!!!!!', uid);
    const bucket = new Bucket(WARE_NAME, AwardMap._$info.name);
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
    const time = timestamps + 28800000;
    console.log('timestamps !!!!!!!!!!!!!!!', time);

    return Math.floor(time / (1000 * 60 * 60 * 24));
};