/**
 * 
 */
import * as bigInt from '../../../pi/bigint/biginteger';
import { randomInt } from '../../../pi/util/math';
import { ab2hex } from '../../../pi/util/util';
import { digest, DigestAlgorithm } from '../../../pi_pt/rust/pi_crypto/digest';
import { ECDSASecp256k1 } from '../../../pi_pt/rust/pi_crypto/signature';
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
    const bucket = new Bucket(WARE_NAME, Award._$info.name);

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
    const bucket = new Bucket(WARE_NAME, UserAccMap._$info.name);
    const uids = [2,3,4,56,5,77];
    const openids = bucket.get<number[], [UserAccMap]>(uids);
    console.log('openids:!!!!!!!!!!!!!!!!!!', openids);
    result.msg = JSON.stringify(openids);

    return result;
};

// 签名测试
// #[rpc=rpcServer]
export const test_secp256k1 = (msg:string):Result => {
    // 创建一个secp256对象
    const secp = ECDSASecp256k1.new();
    // 要进行签名的消息 "abc"
    // const data = new Uint8Array([97, 98, 99]); // "abc"
    const data = str2ab(msg);
    // 消息的sha256哈希，哈希算法可以自己选择
    const hash = digest(DigestAlgorithm.SHA256, data).asSliceU8();
    // 私钥， 32字节
    const sk = DecodeHexStringToByteArray('1468577c399931bd1443aedb915267421863547ede5939eb8a3b7d1f20d1ac78');
    // 私钥对应的公钥
    const pk = DecodeHexStringToByteArray('043ec6a343d986aaaf90ee6665b41705699a8b296dd7443c93e83be9abeca0f99be28db368121b8b4cfa3c82a8bdf764eb63d77f10faf02187feea781cc99d0267');

    // 签名结果
    const sig = secp.sign(hash, sk).asSliceU8();

    const verify = secp.verify(hash, sig, pk);

    // 验证签名
    console.log('verify result: ', verify);
    const r = new Result();
    r.reslutCode = 1;
    const sign = ab2hex(sig);
    r.msg = `verify:${verify}, sign:${sign}, msg:${msg}, sk:${sk}, pk:${pk}`;

    return r;
};

const DecodeHexStringToByteArray = (hexString:string) => {
    const result = [];
    while (hexString.length >= 2) { 
        result.push(parseInt(hexString.substring(0, 2), 16));
        hexString = hexString.substring(2, hexString.length);
    }
    
    return new Uint8Array(result);
};

const str2ab = (str):Uint8Array => {
    const arr = [];
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        arr[i] = str.charCodeAt(i);
    }

    console.log(arr);

    return new Uint8Array(arr);
};

// // #[rpc=rpcServer]
// // 充值每日任务测试
// export const reset_dayliTask_test = ():Result => {
//     reset_dayli_task();
//     const result = new Result();
//     result.reslutCode = RESULT_SUCCESS;

//     return result;
// };