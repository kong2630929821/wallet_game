/**
 * 
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { MEMORY_NAME } from '../data/constant';
import { Item, Mine, MineSeed, MiningResponse } from '../data/db/item.s';
import { doAward } from '../util/award.t';
import { reduce_itemCount, reduce_mine } from '../util/item_util.r';
import { doMining } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { ItemQuery, MiningResult } from './itemQuery.s';

// 获取挖矿几率的随机种子
// #[rpc=rpcServer]
export const mining = (itemQuery:ItemQuery):RandomSeedMgr => {
    reduce_itemCount(itemQuery, 1);
    const seed = Math.floor(Math.random() * 233280 + 1);
    const uid = itemQuery.uid;
    const hoeType = itemQuery.itemType;
    console.log('mining = ',itemQuery);
    const dbMgr = getEnv().getDbMgr();
    const seedBucket = new Bucket(MEMORY_NAME, MineSeed._$info.name, dbMgr);
    seedBucket.put(uid, { seed, hoeType });

    return new RandomSeedMgr(seed);
};

// 返回挖矿结果
// #[rpc=rpcServer]
export const mining_result = (result:MiningResult):MiningResponse => {
    const count = result.hit;
    if (count > 200) {
        // 这手速绝非常人
        return;
    }
    const itemQuery = result.itemQuery;
    const mineNum = result.mineNum;
    const dbMgr = getEnv().getDbMgr();
    const seedBucket = new Bucket(MEMORY_NAME, MineSeed._$info.name, dbMgr);
    const seedAndHoe = seedBucket.get(itemQuery.uid);
    const seed = seedAndHoe[0];
    const hoeType = seedAndHoe[1];
    const randomMgr = new RandomSeedMgr(seed);
    let sumHits = 0;
    for (let i = 0; i < count; i ++) {
        const hit = doMining(hoeType, randomMgr);
        // hits.push(hit)
        sumHits = sumHits + hit;
    }
    const leftHp = reduce_mine(itemQuery, mineNum, sumHits);
    const miningresponse = new MiningResponse();
    if (leftHp > 0) {
        miningresponse.leftHp = leftHp;
        miningresponse.isAward = false;
        miningresponse.award = null;
    } else {
        miningresponse.leftHp = 0;
        miningresponse.isAward = true;
        const v = [];
        doAward(itemQuery.itemType, randomMgr, v);
        const itemNum = v[0][0];
        const itemCount = v[0][1];
        const item = new Item(Math.floor(itemNum / 1000));
        item.value.num = itemNum;
        item.value.count = itemCount;
        miningresponse.award = item;
    }

    return miningresponse;
};