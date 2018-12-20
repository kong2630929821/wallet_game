/**
 * 
 */
import { randomInt } from '../../../pi/util/math';
import { Hoe, Item, Items, Mine, MineSeed } from '../data/db/item.s';
import { doAward } from '../util/award.t';
import { add_itemCount, get_mine_type, items_init } from '../util/item_util.r';
import { doMining } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { ItemQuery, Seed } from './itemQuery.s';
import { Test } from './test.s';
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
export const db_test = (uid: number): Items => {
    items_init(uid);

    return item_query(uid);
};

// #[rpc=rpcServer]
export const item_add = (count: number): Item => {
    console.log('add test in!!!!!!!!!!');
    const itemQuery = new ItemQuery();
    itemQuery.uid = 9;
    itemQuery.enumType = 1;
    itemQuery.itemType = get_mine_type();
    console.log('itemType:!!!!!!!!!', itemQuery.itemType);

    return add_itemCount(itemQuery, count);
};

// #[rpc=rpcServer]
export const hit_test = (hoeType:number): Seed => {
    console.log('hit test in !!!!!!!!!!!!!');
    const randomSeedMgr = new RandomSeedMgr(2563);
    const hit = doMining(hoeType, randomSeedMgr);
    const mineseed = new Seed();
    mineseed.seed = hit;

    return mineseed;
};
