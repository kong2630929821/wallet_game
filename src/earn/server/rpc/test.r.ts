/**
 * 
 */
import { randomInt } from '../../../pi/util/math';
import { Hoe, Item, Items, Mine } from '../data/db/item.s';
import { doAward } from '../util/award.t';
import { add_itemCount, items_init } from '../util/item_util.r';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { ItemQuery } from './itemQuery.s';
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
    const itemQuery = new ItemQuery();
    itemQuery.uid = 7;
    itemQuery.enumType = 1;
    itemQuery.itemType = 1003;

    return add_itemCount(itemQuery, count);
};
