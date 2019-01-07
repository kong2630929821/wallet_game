/**
 * 挖矿接口
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { DBIter } from '../../../pi_pt/rust/pi_serv/js_db';
import { Bucket } from '../../utils/db';
import { RegularAwardCfg } from '../../xlsx/awardCfg.s';
import { AWARD_SRC_MINE, BTC_TYPE, FIRST_MINING_AWARD, INDEX_PRIZE, KT_TYPE, MAX_HUMAN_HITS, MAX_ONEDAY_MINING, MEMORY_NAME, RESULT_SUCCESS, WARE_NAME } from '../data/constant';
import { AwardMap, Item, ItemResponse, Mine, MineKTTop, MineSeed, MineTop, MiningKTMapTab, MiningKTNum, MiningMap, MiningResponse, TodayMineNum, TotalMiningMap, TotalMiningNum } from '../data/db/item.s';
import { ARE_YOU_SUPERMAN, CONFIG_ERROR, DB_ERROR, GET_RANDSEED_FAIL, HOE_NOT_ENOUGH, MINE_NOT_ENOUGH, MINE_NOT_EXIST, MINENUM_OVER_LIMIT, TOP_DATA_FAIL } from '../data/errorNum';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, add_medal, get_award_ids, get_mine_total, get_mine_type, get_today, mining_add_medal, reduce_itemCount, reduce_mine } from '../util/item_util.r';
import { add_miningKTTotal, add_miningTotal, doMining, get_cfgAwardid, get_enumType } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { seriesLogin_award } from '../util/regularAward';
import { MiningResult, SeedResponse } from './itemQuery.s';
import { get_loginDays, getOpenid, getUid } from './user.r';
import { add_mine, get_item } from './user_item.r';

// 获取挖矿几率的随机种子
// #[rpc=rpcServer]
export const mining = (itemType:number):SeedResponse => {
    const seedResponse = new SeedResponse();
    // 相应锄头数量减1
    if (!reduce_itemCount(itemType, 1)) {
        seedResponse.resultNum = HOE_NOT_ENOUGH;

        return seedResponse;
    }
    // 获取随机种子并写入内存表
    const seed = Math.floor(Math.random() * 233280 + 1);
    const uid = getUid();
    const hoeType = itemType;
    const dbMgr = getEnv().getDbMgr();
    const seedBucket = new Bucket(MEMORY_NAME, MineSeed._$info.name, dbMgr);
    seedBucket.put(uid, [seed, hoeType]);

    seedResponse.seed = seed;
    seedResponse.resultNum = RESULT_SUCCESS;

    return seedResponse;
};

// 返回挖矿结果
// #[rpc=rpcServer]
export const mining_result = (result:MiningResult):MiningResponse => {
    console.log('!!!!!!!!!!!!!!mining_result in');
    const miningResponse = new MiningResponse();
    const count = result.hit;
    // 10s内点击次数超过设定上限
    if (count > MAX_HUMAN_HITS) {
        miningResponse.resultNum = ARE_YOU_SUPERMAN;

        return miningResponse;
    }
    const itemType = result.itemType;
    if (get_item(itemType).value.count === 0) {
        miningResponse.resultNum = MINE_NOT_ENOUGH;
        
        return miningResponse;
    }
    const mineNum = result.mineNum;
    const dbMgr = getEnv().getDbMgr();
    const seedBucket = new Bucket(MEMORY_NAME, MineSeed._$info.name, dbMgr);
    const uid = getUid();
    const todayMineNum = get_todayMineNum();
    // 当日已达最大挖矿数量
    // if (todayMineNum.mineNum >= MAX_ONEDAY_MINING) {
    //     miningResponse.resultNum = MINENUM_OVER_LIMIT;

    //     return miningResponse;
    // }
    const seedAndHoe = <MineSeed>seedBucket.get(uid)[0];
    if (!seedAndHoe) {
        miningResponse.resultNum = GET_RANDSEED_FAIL;

        return miningResponse;
    }
    let seed = seedAndHoe.seed;
    const hoeType = seedAndHoe.hoeType;
    let sumHits = 0;
    for (let i = 0; i < count; i ++) {
        const randomMgr = new RandomSeedMgr(seed);
        const hit = doMining(hoeType, randomMgr);
        sumHits = sumHits + hit;
        seed = RandomSeedMgr.randNumber(seed);
    }
    const leftHp = reduce_mine(itemType, mineNum, sumHits);
    if (!leftHp && leftHp !== 0) {
        console.log('!!!!!!!!!!!!!!leftHp:', leftHp);
        miningResponse.resultNum = MINE_NOT_EXIST;

        return miningResponse;
    }
    if (leftHp > 0) {
        miningResponse.leftHp = leftHp;
    } else {
        miningResponse.leftHp = 0; // 当前矿山血量小于等于0时，添加奖励
        const v = [];
        const randomMgr = new RandomSeedMgr(seed);
        const mineType = itemType;
        const pid = get_cfgAwardid(mineType); // 权重配置主键
        doAward(pid, randomMgr, v);
        console.log('award result!!!!!!!!!!!!!!!!!:', v);
        const itemNum = v[0][0];
        console.log('itemNum!!!!!!!!!!!!!!!!!:', itemNum);
        const itemCount = v[0][1];
        const item = add_itemCount(uid, itemNum, itemCount);
        const awards = [];
        awards.push(item);
        add_award(uid, itemNum, itemCount, AWARD_SRC_MINE);
        if (itemNum === KT_TYPE) add_miningKTTotal(uid, itemCount); // 奖品为KT时添加挖矿获取KT总数
        // 挖开第一个矿山额外奖励
        const totalMiningNum = get_totalminingNum(uid);
        if (totalMiningNum.total === 0) {
            const regularBucket = new Bucket(MEMORY_NAME, RegularAwardCfg._$info.name, dbMgr);
            const firstAwardCfg = regularBucket.get<number, [RegularAwardCfg]>(FIRST_MINING_AWARD)[0];
            if (!firstAwardCfg) {
                miningResponse.resultNum = CONFIG_ERROR;

                return miningResponse;
            }
            const firstAward = add_itemCount(uid, firstAwardCfg.prop, firstAwardCfg.num);
            add_award(uid, firstAwardCfg.prop, firstAwardCfg.num, AWARD_SRC_MINE);
            awards.push(firstAward);
        }
        miningResponse.awards = awards;
        // 添加奖章
        mining_add_medal(uid, itemNum);
        // 用户挖矿数量+1
        todayMineNum.mineNum = todayMineNum.mineNum + 1;
        const mineNumBucket =  new Bucket(WARE_NAME, TodayMineNum._$info.name, dbMgr);
        mineNumBucket.put(todayMineNum.id, todayMineNum);
        add_miningTotal(uid);
        // 矿山数量为0时，添加矿山
        if (get_mine_total() === 0) {
            const mine = add_mine();
            miningResponse.mine = mine;
        }
    }
    miningResponse.resultNum = RESULT_SUCCESS;

    return miningResponse;
};

// 签到奖励(连续登陆)
// export const get_loginAward = ():ItemResponse => {
//     const itemResponse = new ItemResponse();
//     const uid = getUid();
//     // 获取连续登陆天数
//     const daysRes = get_loginDays();
//     if (!daysRes) {
//         itemResponse.resultNum = DB_ERROR;

//         return itemResponse;
//     }
//     const days = daysRes.days;
//     const awardItem = seriesLogin_award(days);
//     if (!awardItem) {
//         itemResponse.resultNum = CONFIG_ERROR;

//         return itemResponse;
//     }
//     itemResponse.item = awardItem;
//     itemResponse.resultNum = RESULT_SUCCESS;

//     return itemResponse;
// };

// 查询用户当日挖矿山数量
// #[rpc=rpcServer]
export const get_todayMineNum = ():TodayMineNum => {
    const uid = getUid();
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

// 获取用户挖矿山总数
// #[rpc=rpcServer]
export const get_totalminingNum = (uid: number):TotalMiningNum => {
    console.log('get_totalminingNum in!!!!!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, TotalMiningNum._$info.name, dbMgr);
    const totalMiningNum = bucket.get<number, [TotalMiningNum]>(uid)[0];
    if (!totalMiningNum) {
        const blanktotalMiningNum = new TotalMiningNum();
        blanktotalMiningNum.uid = uid;
        const openid = getOpenid();
        console.log('openid !!!!!!!!!!!!!!!!!', openid);
        blanktotalMiningNum.openid = openid;
        blanktotalMiningNum.total = 0;

        return blanktotalMiningNum;
    } else {
        return totalMiningNum;
    }
};

// 获取用户挖矿得到KT总数
// #[rpc=rpcServer]
export const get_miningKTNum = (uid: number):MiningKTNum => {
    console.log('get_miningKTNum in!!!!!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, MiningKTNum._$info.name, dbMgr);
    const miningKTNum = bucket.get<number, [MiningKTNum]>(uid)[0];
    if (!miningKTNum) {
        const blankMiningKTNum = new MiningKTNum();
        blankMiningKTNum.uid = uid;
        const openid = getOpenid();
        console.log('openid !!!!!!!!!!!!!!!!!', openid);
        blankMiningKTNum.openid = openid;
        blankMiningKTNum.total = 0;

        return blankMiningKTNum;
    } else {
        return miningKTNum;
    }
};

// 挖矿得到KT排行
// #[rpc=rpcServer]
export const get_miningKTTop = (topNum: number): MineKTTop => {
    console.log('get_miningTop in!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr();
    const mapbucket = new Bucket(WARE_NAME, MiningKTMapTab._$info.name, dbMgr);
    const iter = <DBIter>mapbucket.iter(null, true);
    const mineTop = new MineKTTop();
    const mineTopList = [];
    for (let i = 0; i < topNum; i ++) {
        const iterEle = iter.nextElem();
        if (!iterEle) break;
        const mineKTMapTab:MiningKTMapTab = iterEle[1];
        console.log('elCfg----------------read---------------', mineKTMapTab);
        if (mineKTMapTab.miningKTMap.uid === uid) mineTop.myNum = i + 1;
        mineTopList.push(mineKTMapTab);
        console.log('mineTopList!!!!!!!!!!!!!!!!!', mineTopList);
        continue;
    }
    if (!mineTopList) {
        mineTop.resultNum = TOP_DATA_FAIL;

        return mineTop;
    }
    if (!mineTop.myNum) mineTop.myNum = 0;
    mineTop.topList = mineTopList;
    mineTop.resultNum = RESULT_SUCCESS;

    return mineTop;
};

// 挖矿总数排行
// #[rpc=rpcServer]
export const get_miningTop = (topNum: number): MineTop => {
    console.log('get_miningTop in!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr();
    const mapbucket = new Bucket(WARE_NAME, TotalMiningMap._$info.name, dbMgr);
    const iter = <DBIter>mapbucket.iter(null, true);
    const mineTop = new MineTop();
    const mineTopList = [];
    // const num = topQuery.top > iter._$getSinfo.length ? iter._$getSinfo.length : topQuery.top;
    for (let i = 0; i < topNum; i ++) {
        const mineTotalMapEle = iter.nextElem();
        if (!mineTotalMapEle) break;
        const mineTotalMap:TotalMiningMap = mineTotalMapEle[1];
        console.log('elCfg----------------read---------------', mineTotalMap);
        if (mineTotalMap.miningMap.uid === uid) mineTop.myNum = i + 1;
        mineTopList.push(mineTotalMap);
        console.log('mineTopList!!!!!!!!!!!!!!!!!', mineTopList);
        continue;
    }
    if (!mineTopList) {
        mineTop.resultNum = TOP_DATA_FAIL;

        return mineTop;
    }
    if (!mineTop.myNum) mineTop.myNum = 0;
    mineTop.topList = mineTopList;
    mineTop.resultNum = RESULT_SUCCESS;

    return mineTop;
};