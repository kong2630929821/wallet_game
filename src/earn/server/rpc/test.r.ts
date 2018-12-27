/**
 * 
 */
import * as bigInt from '../../../pi/bigint/biginteger';
import { randomInt } from '../../../pi/util/math';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { WARE_NAME } from '../data/constant';
import { Award, ConvertTab, Hoe, Item, Items, Mine } from '../data/db/item.s';
import { doAward } from '../util/award.t';
import { add_itemCount, get_mine_type, items_init } from '../util/item_util.r';
import { doMining } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
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
export const db_test = (pid: number): Award => {
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Award._$info.name, dbMgr);

    return bucket.get(pid)[0];
};

// #[rpc=rpcServer]
export const item_add = (count: number): Item => {
    console.log('add test in!!!!!!!!!!');
    const itemType = 2003;

    return add_itemCount(itemType, count);
};

// #[rpc=rpcServer]
export const item_addticket = (ticketType: number): Item => {
    console.log('add test in!!!!!!!!!!');
    const itemType = ticketType;

    return add_itemCount(itemType, 10);
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

// 添加兑换码
// #[rpc=rpcServer]
export const add_convert = () => {
    console.log('add_convert in:!!!!!!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, ConvertTab._$info.name, dbMgr);
    const convertTab = new ConvertTab();
    convertTab.id = 1;
    convertTab.typeNum = 500001;
    convertTab.state = false;
    convertTab.convert = '101';
    const convertTab1 = new ConvertTab();
    convertTab1.id = 2;
    convertTab1.typeNum = 500002;
    convertTab1.state = true;
    convertTab1.convert = '102';
    const convertTab2 = new ConvertTab();
    convertTab2.id = 3;
    convertTab2.typeNum = 500001;
    convertTab2.state = true;
    convertTab2.convert = '103';
    const convertTab3 = new ConvertTab();
    convertTab3.id = 4;
    convertTab3.typeNum = 500001;
    convertTab3.state = true;
    convertTab3.convert = '104';
    console.log('before db write:!!!!!!!!!!!!!!!!!!');
    const isOk = bucket.put([1, 2, 3, 4], [convertTab, convertTab1, convertTab2, convertTab3]);
    console.log('db write isOk:!!!!!!!!!!!!!!!!!!', isOk);
};

export const bigint_test = ():Test => {
    const a:bigInt.BigInteger = bigInt('10');
    const b:bigInt.BigInteger = bigInt('20');
    const c = a.add(b);
    const d = c.toString();
    const test = new Test();
    test.r = d;

    return test;
};