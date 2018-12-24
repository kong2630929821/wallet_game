/**
 * 
 */
import { randomInt } from '../../../pi/util/math';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { WARE_NAME } from '../data/constant';
import { Hoe, Item, Items, Mine, MineSeed, Prizes } from '../data/db/item.s';
import { doAward } from '../util/award.t';
import { add_itemCount, get_mine_type, items_init } from '../util/item_util.r';
import { doMining } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { ItemQuery, Seed } from './itemQuery.s';
import { Hits, Test } from './test.s';
import { item_query } from './user_item.r';

// #[rpc=rpcServer]
export const award = (award: number): Test => {
    const seedMgr = new RandomSeedMgr(randomInt(1, 100));
    const v = [];
    doAward(award, seedMgr, v);
    const t = new Test();
    t.r = v.join();

    return t;
};

// #[rpc=rpcServer]
export const db_test = (pid: number): Prizes => {
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Prizes._$info.name, dbMgr);

    return bucket.get(pid)[0];
};

// #[rpc=rpcServer]
export const item_add = (count: number): Item => {
    console.log('add test in!!!!!!!!!!');
    const itemQuery = new ItemQuery();
    itemQuery.uid = 7;
    itemQuery.enumType = 2;
    itemQuery.itemType = 2001;
    console.log('itemType:!!!!!!!!!', itemQuery.itemType);

    return add_itemCount(itemQuery, count);
};

// #[rpc=rpcServer]
export const item_addticket = (count: number): Item => {
    console.log('add test in!!!!!!!!!!');
    const itemQuery = new ItemQuery();
    itemQuery.uid = 7;
    itemQuery.enumType = 7;
    itemQuery.itemType = 7001;
    console.log('itemType:!!!!!!!!!', itemQuery.itemType);

    return add_itemCount(itemQuery, count);
};

// #[rpc=rpcServer]
export const hit_test = (hoeType:number): Hits => {
    console.log('hit test in !!!!!!!!!!!!!');
    const hits = [];
    const seeds = [];
    const random = new RandomSeedMgr(200);
    let seed = random.seed;
    for (let i = 0; i < 200; i ++) {
        seeds.push[seed];
        console.log('seed:!!!!!!!!!!!!!!!!!!', seed);
        const randomSeedMgr = new RandomSeedMgr(seed);
        const hit = doMining(hoeType, randomSeedMgr);
        hits.push(hit);
        seed = RandomSeedMgr.randNumber(seed);
    }
    const total = new Hits();
    total.r = hits;
    total.seed = seeds;

    return total;
};
