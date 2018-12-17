import { doAward } from '../util/award.t';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { randomInt } from '../../pi/util/math';
import { Test } from './test.s';
import { item_query } from './user_item.r';
import { Items, Item, Mine, Hoe } from '../data/db/item.s';
import { ItemQuery } from './itemQuery.s';
import { items_init, add_itemCount } from '../util/item_util.r';

// #[rpc=rpcServer]
export const award = (award: number): Test => {
    const seedMgr = new RandomSeedMgr(randomInt(1, 100));
    let v = []
    doAward(award, seedMgr, v);
    let t = new Test();
    t.r = v.join();
    return t
};

// #[rpc=rpcServer]
export const db_test = (uid: number): Items => {
    items_init(uid);
    let items = item_query(uid);
    return items;
};

// #[rpc=rpcServer]
export const item_add = (count: number): Item => {
    let itemQuery = new ItemQuery();
    itemQuery.uid = 7;
    itemQuery.enumType = 1;
    itemQuery.itemType = 1001;
    let item = add_itemCount(itemQuery, count);
    return item;
}
