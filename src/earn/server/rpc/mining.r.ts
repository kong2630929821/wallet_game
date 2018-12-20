/**
 * 
 */
import { DEFAULT_FILE_WARE } from '../../../pi_pt/constant';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { INDEX_PRIZE, MEMORY_NAME } from '../data/constant';
import { Item, Mine, MineSeed, MiningResponse, Prizes } from '../data/db/item.s';
import { get_index_id } from '../data/util';
import { doAward } from '../util/award.t';
import { add_itemCount, get_mine_total, get_mine_type, reduce_itemCount, reduce_mine } from '../util/item_util.r';
import { doMining } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { ItemQuery, MiningResult, Seed } from './itemQuery.s';
import { get_item } from './user_item.r';

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
    if (count > 200) {
        // 这手速绝非常人
        return;
    }
    const itemQuery = result.itemQuery;
    if (get_item(itemQuery).value.count === 0) return;
    const mineNum = result.mineNum;
    const dbMgr = getEnv().getDbMgr();
    const seedBucket = new Bucket(MEMORY_NAME, MineSeed._$info.name, dbMgr);
    const uid = itemQuery.uid;
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
        let pid; // 权重配置主键
        if (mineType === 1001) pid = 100101;
        if (mineType === 1002) pid = 100102;
        if (mineType === 1003) pid = 100103;
        doAward(pid, randomMgr, v);
        console.log('award result!!!!!!!!!!!!!!!!!:', v);
        const itemNum = v[0][0];
        console.log('itemNum!!!!!!!!!!!!!!!!!:', itemNum);
        const itemCount = v[0][1];
        const awarditemQuery = new ItemQuery();
        awarditemQuery.enumType = Math.floor(itemNum / 1000);
        awarditemQuery.itemType = itemNum;
        awarditemQuery.uid = uid;
        const item = add_itemCount(awarditemQuery, itemCount);
        const dbMgr = getEnv().getDbMgr();
        const bucket = new Bucket(DEFAULT_FILE_WARE, Prizes._$info.name, dbMgr);
        const time = new Date().valueOf();
        const prizeid = get_index_id(INDEX_PRIZE);
        console.log('prizeid!!!!!!!!!!!!!!!!!:', prizeid);
        const src:string = 'mining';
        bucket.put(prizeid, [item, uid, src, time]);
        miningresponse.award = item;
        console.log('miningresponse!!!!!!!!!!!!!!!!!:', miningresponse);
        // // 剩余矿山数量为0 时添加一座矿山
        // if (leftMines === 0) {
        //     const mineType = get_mine_type();
        //     newMine.num = mineType;
        //     newMine.count = 1;
        //     miningresponse.isEmpty = true;
        //     miningresponse.newMine = newMine;
        // } else {
        //     miningresponse.isEmpty = true;
        //     miningresponse.newMine = newMine;
        // }
    }

    return miningresponse;
};