/**
 * 挖矿接口
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { DBIter } from '../../../pi_pt/rust/pi_serv/js_db';
import { Bucket } from '../../utils/db';
import { RegularAwardCfg } from '../../xlsx/awardCfg.s';
import { AWARD_SRC_MINE, BTC_TYPE, ETH_TYPE, FIRST_MINING_AWARD, INDEX_PRIZE, KT_TYPE, MAX_HUMAN_HITS, MAX_ONEDAY_MINING, MEMORY_NAME, RESULT_SUCCESS, ST_TYPE, WARE_NAME } from '../data/constant';
import { Result } from '../data/db/guessing.s';
import { AwardMap, AwardQuery, Item, ItemResponse, Mine, MineKTTop, MineSeed, MineTop, MiningKTMap, MiningKTMapTab, MiningKTNum, MiningMap, MiningResponse, TodayMineNum, TotalMiningMap, TotalMiningNum } from '../data/db/item.s';
import { ChatIDMap, UserAccMap } from '../data/db/user.s';
import { ARE_YOU_SUPERMAN, CONFIG_ERROR, DB_ERROR, GET_RANDSEED_FAIL, HOE_NOT_ENOUGH, MINE_NOT_ENOUGH, MINE_NOT_EXIST, MINENUM_OVER_LIMIT, NOT_LOGIN, TOP_DATA_FAIL } from '../data/errorNum';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, add_medal, get_award_ids, get_mine_total, get_mine_type, get_today, mining_add_medal, reduce_itemCount, reduce_mine } from '../util/item_util.r';
import { add_miningKTTotal, add_miningTotal, doMining, get_cfgAwardid, get_enumType } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { seriesLogin_award } from '../util/regularAward';
import { ChatIDs, MiningResult, SeedResponse } from './itemQuery.s';
import { get_loginDays, getOpenid, getUid } from './user.r';
import { add_mine, award_query, get_item, get_showMedal } from './user_item.r';

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
    if (!uid) {
        seedResponse.resultNum = NOT_LOGIN;

        return seedResponse;
    }
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
    const uid = getUid();
    if (!uid || !result) return;
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
    const todayMineNum = get_todayMineNum();
    // 当日已达最大挖矿数量
    if (todayMineNum.mineNum >= MAX_ONEDAY_MINING) {
        miningResponse.resultNum = MINENUM_OVER_LIMIT;

        return miningResponse;
    }
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
    if (!uid) return;
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

// 获取用户挖矿得到的BTC/ETH/ST/KT总数
// #[rpc=rpcServer]
export const get_miningCoinNum = (typeId: number): Result => {
    const result = new Result();
    const awardQuery = new AwardQuery();
    awardQuery.src = AWARD_SRC_MINE;
    const mineAwards = award_query(awardQuery).awards;
    // 没有货币类型参数 返回挖矿得到的所有货币总数
    if (!typeId) {
        let BTCNum = 0;
        let ETHNum = 0;
        let STNum = 0;
        let KTNum = 0;
        for (let i = 0; i < mineAwards.length; i++) {
            if (mineAwards[i].awardType === BTC_TYPE) {
                BTCNum += mineAwards[i].count;
                continue;
            }
            if (mineAwards[i].awardType === ETH_TYPE) {
                ETHNum += mineAwards[i].count;
                continue;
            }
            if (mineAwards[i].awardType === ST_TYPE) {
                STNum += mineAwards[i].count;
                continue;
            }
            if (mineAwards[i].awardType === KT_TYPE) {
                KTNum += mineAwards[i].count;
                continue;
            }
        }
        const coinNum = [BTCNum, ETHNum, STNum, KTNum];
        result.msg = JSON.stringify(coinNum);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
    }
    let coinNum = 0;
    for (let i = 0; i < mineAwards.length; i++) {
        if (mineAwards[i].awardType === typeId) {
            coinNum += mineAwards[i].count;
        }
    }
    result.msg = JSON.stringify(coinNum);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 获取用户挖矿得到KT总数
// #[rpc=rpcServer]
export const get_miningKTNum = (uid: number):MiningKTNum => {
    console.log('get_miningKTNum in!!!!!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, MiningKTNum._$info.name, dbMgr);
    const accMapBucket = new Bucket(WARE_NAME, UserAccMap._$info.name, dbMgr);
    const miningKTNum = bucket.get<number, [MiningKTNum]>(uid)[0];
    if (!miningKTNum) {
        const blankMiningKTNum = new MiningKTNum();
        blankMiningKTNum.uid = uid;
        // const openid = getOpenid();
        const userAccMap = accMapBucket.get<number, [UserAccMap]>(uid)[0];
        const openid = userAccMap.openid;
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
    const mineTop = new MineKTTop();
    const uid = getUid();
    if (!uid) return;
    const dbMgr = getEnv().getDbMgr();
    const mapbucket = new Bucket(WARE_NAME, MiningKTMapTab._$info.name, dbMgr);
    const iter = <DBIter>mapbucket.iter(null, true);
    mineTop.myKTNum = get_miningKTNum(uid).total;
    mineTop.myMedal = get_showMedal(uid).medalType;
    const mineTopList = [];
    for (let i = 0; i < topNum; i ++) {
        const iterEle = iter.nextElem();
        if (!iterEle) break;
        const mineKTMapTab:MiningKTMapTab = iterEle[1];
        console.log('elCfg----------------read---------------', mineKTMapTab);
        if (mineKTMapTab.miningKTMap.uid === uid) mineTop.myNum = i + 1;
        mineKTMapTab.medal = get_showMedal(mineKTMapTab.miningKTMap.uid).medalType;
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

// 好友挖矿排行
// #[rpc=rpcServer]
export const get_friends_KTTop = (chatIDs: ChatIDs): MineKTTop => {
    console.log('get_friends_KTTop in!!!!!!!!!!!!!!!!!', chatIDs);
    const uid = getUid();
    if (!uid) return;
    const mineTop = new MineKTTop();
    const dbMgr = getEnv().getDbMgr();
    const mapbucket = new Bucket(WARE_NAME, ChatIDMap._$info.name, dbMgr);
    const fuids: [number] = [uid];
    // 从数据库中绑定的聊天IDMap表中根据chatID关联到活动的uid
    for (let i = 0; i < chatIDs.chatIDs.length; i ++) {
        if (!mapbucket.get<number, [ChatIDMap]>(chatIDs.chatIDs[i])) continue;
        const chatIDMap = mapbucket.get<number, [ChatIDMap]>(chatIDs.chatIDs[i])[0];
        fuids.push(chatIDMap.uid);
    }
    const mineTopList = []; 
    for (let i = 0; i < fuids.length; i ++) {
        const miningKTNum = get_miningKTNum(fuids[i]);
        console.log('miningKTNum!!!!!!!!!!!!!!!!!', miningKTNum);
        const miningKTMap = new MiningKTMap();
        miningKTMap.ktNum = miningKTNum.total;
        miningKTMap.uid = miningKTNum.uid;
        const miningKTMapTab = new MiningKTMapTab();
        miningKTMapTab.miningKTMap = miningKTMap;
        if (miningKTNum.medal) {
            console.log('medal!!!!!!!!!!!!!!!!!');
            miningKTMapTab.medal = miningKTNum.medal;
        }
        miningKTMapTab.openid = miningKTNum.openid;
        mineTopList.push(miningKTMapTab);
    }
    // 按挖矿的KT数从大到小排序
    sort(mineTopList, 0, mineTopList.length - 1);
    console.log('mineTopList!!!!!!!!!!!!!!!!!', mineTopList);
    let myMiningKTMapTab: MiningKTMapTab;
    let myNum: number;
    for (let i = 0; i < mineTopList.length; i ++) {
        if (mineTopList[i].miningKTMap.uid === uid) {
            myMiningKTMapTab = mineTopList[i];
            myNum = i + 1;
            break;
        }
    }
    mineTop.topList = mineTopList;
    mineTop.myNum = myNum;
    if (myMiningKTMapTab.medal) mineTop.myMedal = myMiningKTMapTab.medal;
    mineTop.myKTNum = myMiningKTMapTab.miningKTMap.ktNum;
    mineTop.resultNum = RESULT_SUCCESS;

    return mineTop;
};

const sort = (list: any[], left: number, right: number) => {
    console.log('sort in!!!!!!!!!!!!!!!!!', { left, right });
    if (left > right) return;
    let i = left;
    let j = right;
    const temp = list[i];
    if (i < j) {
        while (i < j && list[j].miningKTMap.ktNum < temp.miningKTMap.ktNum) {
            j --;
        }
        list[i] = list[j];
        while (i < j && list[i].miningKTMap.ktNum > temp.miningKTMap.ktNum) {
            i ++;
        }
        list[j] = list[i];
    }
    list[i] = temp;
    sort(list, left, i - 1);
    sort(list, i + 1, right);
};

// 挖矿总数排行
// #[rpc=rpcServer]
export const get_miningTop = (topNum: number): MineTop => {
    console.log('get_miningTop in!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    if (!uid) return;
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