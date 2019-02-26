/**
 * 
 */
import * as bigInt from '../../../pi/bigint/biginteger';
import { randomInt } from '../../../pi/util/math';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { RESULT_SUCCESS, THE_ELDER_SCROLLS, WARE_NAME } from '../data/constant';
import { Result } from '../data/db/guessing.s';
import { Award, ConvertTab, Hoe, Item, Items, Mine, SpecialAward } from '../data/db/item.s';
import { UserAccMap } from '../data/db/user.s';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, get_mine_type, items_init } from '../util/item_util.r';
import { doMining } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { Hits, Test } from './test.s';
import { getUid, reset_dayli_task } from './user.r';
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
export const db_test = (pid: number): Award => {
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Award._$info.name, dbMgr);

    return bucket.get(pid)[0];
};

// #[rpc=rpcServer]
export const item_add = (count: number): Item => {
    console.log('add test in!!!!!!!!!!');
    const uid = getUid();
    const itemType = 2003;

    return add_itemCount(uid, itemType, count);
};

// #[rpc=rpcServer]
export const item_addticket = (ticketType: number): Item => {
    console.log('add test in!!!!!!!!!!');
    const uid = getUid();
    const itemType = ticketType;

    return add_itemCount(uid, itemType, 10);
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

// #[rpc=rpcServer]
export const bigint_test = ():Test => {
    add_award(2, 5001, 20000, 'test');
    const test = new Test();
    test.r = 'test';

    return test;
};

// #[rpc=rpcServer]
export const get_objStr = ():Result => {
    console.log('get_objStr in:!!!!!!!!!!!!!!!!!!');
    const result = new Result();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, UserAccMap._$info.name, dbMgr);
    const uids = [2,3,4,56,5,77];
    const openids = bucket.get<number[], [UserAccMap]>(uids);
    console.log('openids:!!!!!!!!!!!!!!!!!!', openids);
    result.msg = JSON.stringify(openids);

    return result;
};

// // #[rpc=rpcServer]
// // 充值每日任务测试
// export const reset_dayliTask_test = ():Result => {
//     reset_dayli_task();
//     const result = new Result();
//     result.reslutCode = RESULT_SUCCESS;

//     return result;
// };