/**
 * 
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { AWARD_SRC_MINE, INDEX_PRIZE, MAX_HUMAN_HITS, MAX_ONEDAY_MINING, MEMORY_NAME, WARE_NAME } from '../data/constant';
import { AwardMap, Item, Mine, MineSeed, MiningResponse, Prizes, TodayMineNum } from '../data/db/item.s';
import { get_index_id } from '../data/util';
import { doAward } from '../util/award.t';
import { add_itemCount, get_award_ids, get_mine_total, get_mine_type, reduce_itemCount, reduce_mine } from '../util/item_util.r';
import { doMining, get_cfgAwardid, get_enumType } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { ItemQuery, MiningResult, Seed } from './itemQuery.s';
import { get_item, get_todayMineNum } from './user_item.r';

// 获取挖矿几率的随机种子
// #[rpc=rpcServer]
export const mining = (itemQuery:ItemQuery):Seed => {
    reduce_itemCount(itemQuery, 1);
    const seed = Math.floor(Math.random() * 233280 + 1);
    const uid = itemQuery.uid;
    const hoeType = itemQuery.itemType;
    console.log('mining = ',itemQuery);
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
    const itemQuery = result.itemQuery;
    if (get_item(itemQuery).value.count === 0) return;
    const mineNum = result.mineNum;
    const dbMgr = getEnv().getDbMgr();
    const seedBucket = new Bucket(MEMORY_NAME, MineSeed._$info.name, dbMgr);
    const uid = itemQuery.uid;
    const todayMineNum = get_todayMineNum(uid);
    // 当日已达最大挖矿数量
    if (todayMineNum.mineNum >= MAX_ONEDAY_MINING) return; 
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
    const leftHp = reduce_mine(itemQuery, mineNum, sumHits);
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
        const mineType = itemQuery.itemType;
        const pid = get_cfgAwardid(mineType); // 权重配置主键
        doAward(pid, randomMgr, v);
        console.log('award result!!!!!!!!!!!!!!!!!:', v);
        const itemNum = v[0][0];
        console.log('itemNum!!!!!!!!!!!!!!!!!:', itemNum);
        const itemCount = v[0][1];
        const awarditemQuery = new ItemQuery();
        awarditemQuery.enumType = get_enumType(itemNum);
        awarditemQuery.itemType = itemNum;
        awarditemQuery.uid = uid;
        const item = add_itemCount(awarditemQuery, itemCount);
        const dbMgr = getEnv().getDbMgr();
        const bucket = new Bucket(WARE_NAME, Prizes._$info.name, dbMgr);
        const prizeid = get_index_id(INDEX_PRIZE);
        // 奖励详情写入数据库
        console.log('prizeid!!!!!!!!!!!!!!!!!:', prizeid);
        const prize = new Prizes();
        prize.id = prizeid;
        prize.prize = item;
        prize.src = AWARD_SRC_MINE;
        prize.uid = uid;
        prize.time = new Date().valueOf();
        bucket.put(prizeid, prize);
        console.log('detail!!!!!!!!!!!!!!!!!:', bucket.get(prizeid)[0]);
        const awardMap = <AwardMap>get_award_ids(uid);
        let awardList = [];
        awardList = awardMap.awards;
        awardList.push(prizeid);
        console.log('awardList!!!!!!!!!!!!!!!!!:', awardList);
        const mapBucket = new Bucket(WARE_NAME, AwardMap._$info.name, dbMgr);
        awardMap.awards = awardList;
        mapBucket.put(uid, awardMap);
        // 用户挖矿数量+1
        todayMineNum.mineNum = todayMineNum.mineNum + 1;
        console.log('miningresponse!!!!!!!!!!!!!!!!!:', todayMineNum.mineNum);
        const mineNumBucket =  new Bucket(WARE_NAME, TodayMineNum._$info.name, dbMgr);
        mineNumBucket.put(todayMineNum.id, todayMineNum);
        miningresponse.award = item;
    }

    return miningresponse;
};