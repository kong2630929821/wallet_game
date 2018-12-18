/**
 * 
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { MEMORY_NAME } from '../data/constant';
import { Item, Mine, MineSeed, MiningResponse } from '../data/db/item.s';
import { doAward } from '../util/award.t';
import { get_mine_total, get_mine_type, reduce_itemCount, reduce_mine } from '../util/item_util.r';
import { doMining } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { ItemQuery, MiningResult, Seed } from './itemQuery.s';

// 获取挖矿几率的随机种子
// #[rpc=rpcServer]
export const mining = (itemQuery:ItemQuery):Seed => {
    reduce_itemCount(itemQuery, 1);
    const seed = Math.floor(Math.random() * 233280 + 1);
    const uid = itemQuery.uid;
    const hoeType = itemQuery.itemType;
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
    const mineNum = result.mineNum;
    const dbMgr = getEnv().getDbMgr();
    const seedBucket = new Bucket(MEMORY_NAME, MineSeed._$info.name, dbMgr);
    const seedAndHoe = <MineSeed>seedBucket.get(itemQuery.uid)[0];
    const seed = seedAndHoe.seed;
    console.log('!!!!!!!!!!!!!!seed:', seed);
    const hoeType = seedAndHoe.hoeType;
    console.log('!!!!!!!!!!!!!!hoeType:', hoeType);
    const randomMgr = new RandomSeedMgr(seed);
    let sumHits = 0;
    console.log('!!!!!!!!!!!!!!before');
    for (let i = 0; i < count; i ++) {
        const hit = doMining(hoeType, randomMgr);
        // hits.push(hit)
        sumHits = sumHits + hit;
    }
    console.log('!!!!!!!!!!!!!!sumhits:', sumHits);
    const leftHp = reduce_mine(itemQuery, mineNum, sumHits);
    const miningresponse = new MiningResponse();
    if (leftHp > 0) {
        miningresponse.leftHp = leftHp;
        miningresponse.isAward = false;
        miningresponse.award = null;
    } else {
        // 当前矿山血量小于等于0时，添加奖励
        miningresponse.leftHp = 0;
        miningresponse.isAward = true;
        const v = [];
        doAward(itemQuery.itemType, randomMgr, v);
        const itemNum = v[0][0];
        const itemCount = v[0][1];
        const leftMines = get_mine_total(itemQuery.uid);
        const item = new Item(Math.floor(itemNum / 1000));
        item.value.num = itemNum;
        item.value.count = itemCount;
        miningresponse.award = item;
        // 剩余矿山数量为0 时添加一座矿山
        if (leftMines === 0) {
            const mineType = get_mine_type();
            const newMine = new Mine();
            newMine.num = mineType;
            newMine.count = 1;
            miningresponse.isEmpty = true;
            miningresponse.newMine = newMine;
        } else {
            miningresponse.isEmpty = true;
            miningresponse.newMine = null;
        }
    }

    return miningresponse;
};