/**
 * 挖矿接口
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { DBIter } from '../../../pi_pt/rust/pi_serv/js_db';
import { Bucket } from '../../utils/db';
import { AWARD_SRC_MINE, INDEX_PRIZE, MAX_HUMAN_HITS, MAX_ONEDAY_MINING, MEMORY_NAME, WARE_NAME } from '../data/constant';
import { AwardMap, Item, Mine, MineSeed, MineTop, MiningMap, MiningResponse, TodayMineNum, TotalMiningMap, TotalMiningNum } from '../data/db/item.s';
import { UserInfo } from '../data/db/user.s';
import { get_index_id } from '../data/util';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, get_award_ids, get_mine_total, get_mine_type, get_today, reduce_itemCount, reduce_mine } from '../util/item_util.r';
import { add_miningTotal, doMining, get_cfgAwardid, get_enumType } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { MiningResult, Seed } from './itemQuery.s';
import { getUid } from './user.r';
import { get_item } from './user_item.r';

// 获取挖矿几率的随机种子
// #[rpc=rpcServer]
export const mining = (itemType:number):Seed => {
    // 相应锄头数量减1
    if (!reduce_itemCount(itemType, 1)) return;
    const seed = Math.floor(Math.random() * 233280 + 1);
    const uid = getUid();
    const hoeType = itemType;
    const dbMgr = getEnv().getDbMgr();
    const seedBucket = new Bucket(MEMORY_NAME, MineSeed._$info.name, dbMgr);
    seedBucket.put(uid, [seed, hoeType]);
    const seedStruct = new Seed();
    seedStruct.seed = seed;

    return seedStruct;
};

// 返回挖矿结果
// #[rpc=rpcServer]
export const mining_result = (result:MiningResult):MiningResponse => {
    console.log('!!!!!!!!!!!!!!mining_result in');
    const count = result.hit;
    if (count > MAX_HUMAN_HITS) {
        // 这手速绝非常人
        return;
    }
    const itemType = result.itemType;
    if (get_item(itemType).value.count === 0) return;
    const mineNum = result.mineNum;
    const dbMgr = getEnv().getDbMgr();
    const seedBucket = new Bucket(MEMORY_NAME, MineSeed._$info.name, dbMgr);
    const uid = getUid();
    const todayMineNum = get_todayMineNum(uid);
    // 当日已达最大挖矿数量
    // if (todayMineNum.mineNum >= MAX_ONEDAY_MINING) return; 
    const seedAndHoe = <MineSeed>seedBucket.get(uid)[0];
    if (!seedAndHoe) return;
    let seed = seedAndHoe.seed;
    console.log('!!!!!!!!!!!!!!seed:', seed);
    const hoeType = seedAndHoe.hoeType;
    console.log('!!!!!!!!!!!!!!hoeType:', hoeType);
    let sumHits = 0;
    for (let i = 0; i < count; i ++) {
        const randomMgr = new RandomSeedMgr(seed);
        const hit = doMining(hoeType, randomMgr);
        sumHits = sumHits + hit;
        seed = RandomSeedMgr.randNumber(seed);
    }
    console.log('!!!!!!!!!!!!!!sumhits:', sumHits);
    const leftHp = reduce_mine(itemType, mineNum, sumHits);
    console.log('!!!!!!!!!!!!!!leftHp:', leftHp);
    const miningresponse = new MiningResponse();
    if (leftHp > 0) {
        miningresponse.leftHp = leftHp;
        console.log('!!!!!!!!!!!!!!miningresponse:', miningresponse);
    } else {
        // 当前矿山血量小于等于0时，添加奖励
        miningresponse.leftHp = 0;
        const v = [];
        const randomMgr = new RandomSeedMgr(seed);
        const mineType = itemType;
        const pid = get_cfgAwardid(mineType); // 权重配置主键
        doAward(pid, randomMgr, v);
        console.log('award result!!!!!!!!!!!!!!!!!:', v);
        const itemNum = v[0][0];
        console.log('itemNum!!!!!!!!!!!!!!!!!:', itemNum);
        const itemCount = v[0][1];
        const item = add_itemCount(itemNum, itemCount);
        add_award(itemNum, itemCount, AWARD_SRC_MINE);
        // 用户挖矿数量+1
        todayMineNum.mineNum = todayMineNum.mineNum + 1;
        console.log('miningresponse!!!!!!!!!!!!!!!!!:', todayMineNum.mineNum);
        const mineNumBucket =  new Bucket(WARE_NAME, TodayMineNum._$info.name, dbMgr);
        mineNumBucket.put(todayMineNum.id, todayMineNum);
        add_miningTotal(uid);
        miningresponse.award = item;
    }

    return miningresponse;
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
        const unameBucket = new Bucket(WARE_NAME, UserInfo._$info.name, dbMgr);
        console.log('before get_uname!!!!!!!!!!!!!!!!!');
        const userInfo = unameBucket.get<number, [UserInfo]>(uid)[0];
        console.log('userInfo!!!!!!!!!!!!!!!!!', blanktotalMiningNum.uName);
        if (!userInfo) {
            blanktotalMiningNum.uName = 'nobody'; // 仅用于测试
        } else {
            blanktotalMiningNum.uName = userInfo.name;
        }
        blanktotalMiningNum.total = 0;

        return blanktotalMiningNum;
    } else {
        return totalMiningNum;
    }
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
    if (!mineTop.myNum) mineTop.myNum = 0;
    mineTop.topList = mineTopList;

    return mineTop;
};