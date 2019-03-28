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
    const sk = DecodeHexStringToByteArray('9389abe48466d230289dcb847d1fcaddc3ac9665db3bcbcf461b2c2bf4e7efe7');
    // 私钥对应的公钥
    const pk = DecodeHexStringToByteArray('04419f657dc090c3679ac778cc1f324080f1fbc7cd74fbbb79ec3e9bf9336b653d4b2853ef38275130289924bc12dcabd83989c03a6819da710ddc65d50907b6fc');

    // 签名结果
    const sig = secp.sign(hash, sk).asSliceU8();

    // 验证签名
    console.log('verify result: ', secp.verify(hash, sig, pk));
    const r = new Result();
    r.reslutCode = 1;
    const sign = ab2hex(sig);
    r.msg = `${sign}`;

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
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }

    return buf as Uint8Array;
};

// // #[rpc=rpcServer]
// // 充值每日任务测试
// export const reset_dayliTask_test = ():Result => {
//     reset_dayli_task();
//     const result = new Result();
//     result.reslutCode = RESULT_SUCCESS;

//     return result;
// };