/**
 * 红包模块
 */

import { randomInt, round } from '../../../pi/util/math';
import { Bucket } from '../../utils/db';
import { CID_START_LENGTH, CODE_MAX_CONFLICTS, NORMAL_RED_BAG, RANDOM_RED_BAG, RED_BAG_TIMEOUT, RESULT_SUCCESS, RID_START_LENGTH, WARE_NAME } from '../data/constant';
import { Result } from '../data/db/guessing.s';
import { CidAmount, RedBagConvert, RedBagConvertData, RedBagConvertList, RedBagData, RedBagInfo, RedBagInfoList, UserRedBag } from '../data/db/redBag.s';
import { CREATE_RED_BAG_ERROR, GET_RED_BAG_REPEAT, RED_BAG_ADD_MONEY_FAIL, RED_BAG_CODE_ERROR, RED_BAG_CONVERT_ERROR, RED_BAG_CONVERT_USED, REDUCE_PRICE_FAIL } from '../data/errorNum';
import { oauth_alter_balance } from '../util/oauth_lib';
import { EmitRedBag } from './redBag.s';
import { get_userInfo, getUid } from './user.r';

// 发红包
// #[rpc=rpcServer]
export const emitRedBag = (emit: EmitRedBag): Result => {
    const result = new Result();
    const uid = getUid();
    // 生成红包
    const rid = createRedBag(uid, emit.redBag_type, emit.coin_type, emit.total_amount, emit.count, emit.desc);
    if (rid) {
        // 向钱包扣除指定金额
        const time = Date.now();
        const oid = `${time}${uid}${randomInt(10000, 99999)}`;
        if (!oauth_alter_balance(emit.coin_type, oid, -emit.total_amount)) {
            result.reslutCode = REDUCE_PRICE_FAIL;
    
            return result;
        }
        result.msg = rid;
        result.reslutCode = RESULT_SUCCESS;

        return result;
    } else {
        result.reslutCode = CREATE_RED_BAG_ERROR;

        return result;
    }

};

// 领取红包兑换码
// #[rpc=rpcServer]
export const getRedBagConvert = (rid: string): Result => {
    const result = new Result();
    const uid = getUid();
    const redBagInfoBucket = new Bucket(WARE_NAME, RedBagInfo._$info.name);
    const userRedBagBucket = new Bucket(WARE_NAME, UserRedBag._$info.name);
    const redBagInfo = redBagInfoBucket.get<string, RedBagInfo[]>(rid)[0];
    // 红包不存在
    if (!redBagInfo) {
        result.reslutCode = RED_BAG_CODE_ERROR;

        return result;
    }
    // 红包已超时失效
    const time = Date.now();
    if (time > parseInt(redBagInfo.timeout, 10)) {
        result.reslutCode = RED_BAG_TIMEOUT;

        return result;
    }
    let userRedBag = userRedBagBucket.get<number, UserRedBag[]>(uid)[0];
    if (!userRedBag) {
        userRedBag = new UserRedBag();
        userRedBag.uid = uid;
        userRedBag.rid_list = [];
        userRedBag.get_rid_list = [];
        userRedBag.cid_list = [];
    }
    // 无法重复领取
    if (userRedBag.get_rid_list.indexOf(rid) >= 0) {
        result.reslutCode = GET_RED_BAG_REPEAT;

        return result;
    }
    // 获取兑换码
    const cidIndex = randomInt(0, redBagInfo.left_cid_list.length - 1);
    const cid = redBagInfo.left_cid_list[cidIndex].cid;
    const amount = redBagInfo.left_cid_list[cidIndex].amount;
    redBagInfo.left_cid_list.splice(cidIndex, 1);
    redBagInfoBucket.put(redBagInfo.rid, redBagInfo);
    userRedBag.get_rid_list.push(rid);
    userRedBag.cid_list.push(cid);
    userRedBagBucket.put(uid, userRedBag);
    // 生成兑换码信息
    const redBagConvertBucket = new Bucket(WARE_NAME, RedBagConvert._$info.name);
    const convertInfo = new RedBagConvert();
    convertInfo.cid = cid;
    convertInfo.rid = rid;
    convertInfo.uid = uid;
    convertInfo.send_uid = redBagInfo.uid;
    convertInfo.amount = amount;
    convertInfo.coin_type = redBagInfo.coin_type;
    convertInfo.get_time = time.toString();
    convertInfo.convert_time = '0';
    convertInfo.timeout = redBagInfo.timeout;
    redBagConvertBucket.put(cid, convertInfo);
    result.msg = JSON.stringify(convertInfo);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 外部应用领取红包兑换码
// #[rpc=rpcServer]
export const OutgetRedBagConvert = (rid: string): Result => {
    const result = new Result();
    const redBagInfoBucket = new Bucket(WARE_NAME, RedBagInfo._$info.name);
    const redBagInfo = redBagInfoBucket.get<string, RedBagInfo[]>(rid)[0];
    // 红包不存在
    if (!redBagInfo) {
        result.reslutCode = RED_BAG_CODE_ERROR;

        return result;
    }
    // 红包已超时失效
    const time = Date.now();
    if (time > parseInt(redBagInfo.timeout, 10)) {
        result.reslutCode = RED_BAG_TIMEOUT;

        return result;
    }

    // 获取兑换码
    const cidIndex = randomInt(0, redBagInfo.left_cid_list.length - 1);
    const cid = redBagInfo.left_cid_list[cidIndex].cid;
    const amount = redBagInfo.left_cid_list[cidIndex].amount;
    redBagInfo.left_cid_list.splice(cidIndex, 1);
    redBagInfoBucket.put(redBagInfo.rid, redBagInfo);

    // 生成兑换码信息
    const redBagConvertBucket = new Bucket(WARE_NAME, RedBagConvert._$info.name);
    const convertInfo = new RedBagConvert();
    convertInfo.cid = cid;
    convertInfo.rid = rid;
    convertInfo.uid = 0;
    convertInfo.send_uid = redBagInfo.uid;
    convertInfo.amount = amount;
    convertInfo.coin_type = redBagInfo.coin_type;
    convertInfo.get_time = time.toString();
    convertInfo.convert_time = '0';
    convertInfo.timeout = redBagInfo.timeout;
    redBagConvertBucket.put(cid, convertInfo);
    result.msg = JSON.stringify(convertInfo);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 兑换红包
// #[rpc=rpcServer]
export const convertRedBag = (cid: string): Result => {
    const result = new Result();
    const uid = getUid();
    const redBagConvertBucket = new Bucket(WARE_NAME, RedBagConvert._$info.name); 
    console.log('============cid', cid);
    const redBagConvert = redBagConvertBucket.get<string, RedBagConvert[]>(cid)[0];
    const userRedBagBucket = new Bucket(WARE_NAME, UserRedBag._$info.name);
    let userRedBag = userRedBagBucket.get<number, UserRedBag[]>(uid)[0];
    if (!userRedBag) {
        userRedBag = new UserRedBag();
        userRedBag.uid = uid;
        userRedBag.rid_list = [];
        userRedBag.get_rid_list = [];
        userRedBag.cid_list = [];
    }
    console.log('============redBagConvert', redBagConvert);
    // 兑换码错误
    if (!redBagConvert) {
        result.reslutCode = RED_BAG_CONVERT_ERROR;

        return result;
    }
    // 兑换码已使用
    if (redBagConvert.convert_time !== '0') {
        result.reslutCode = RED_BAG_CONVERT_USED;

        return result;
    }
    // 获取红包信息
    const redBagInfoBucket = new Bucket(WARE_NAME, RedBagInfo._$info.name);
    const redBagInfo = redBagInfoBucket.get<string, RedBagInfo[]>(redBagConvert.rid)[0];
    // 红包已超时失效
    const time = Date.now();
    if (time > parseInt(redBagInfo.timeout, 10)) {
        result.reslutCode = RED_BAG_TIMEOUT;

        return result;
    }
    // 向钱包服务器增加金额
    const oid = `${time}${uid}${randomInt(10000, 99999)}`;
    if (!oauth_alter_balance(redBagConvert.coin_type, oid, redBagConvert.amount)) {
        result.reslutCode = RED_BAG_ADD_MONEY_FAIL;

        return result;
    }
    // 更新红包和兑换码信息
    redBagInfo.left_amount -= redBagConvert.amount;
    redBagInfoBucket.put(redBagInfo.rid, redBagInfo);
    redBagConvert.uid = uid;
    redBagConvert.convert_time = time.toString();
    redBagConvertBucket.put(redBagConvert.cid, redBagConvert);
    userRedBag.cid_list.push(cid);
    userRedBagBucket.put(cid, userRedBag);

    const redBagConvertData = getConvertData(redBagConvert, redBagInfo.desc);

    result.msg = JSON.stringify(redBagConvertData);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 用户发红包记录
// #[rpc=rpcServer]
export const queryEmitLog = (): Result => {
    const result = new Result();
    const uid = getUid();
    const userRedBagBucket = new Bucket(WARE_NAME, UserRedBag._$info.name);
    const userRedBag = userRedBagBucket.get<number, UserRedBag[]>(uid)[0];
    if (!userRedBag) {
        result.reslutCode = RESULT_SUCCESS;

        return result;
    }
    const redBagInfoList = new RedBagInfoList();
    const list = [];
    for (let i = 0; i < userRedBag.rid_list.length; i++) {
        const redBagData = getRedBagData(userRedBag.rid_list[i]);
        if (redBagData) list.push(redBagData);
    }
    redBagInfoList.list = list;
    result.reslutCode = RESULT_SUCCESS;
    result.msg = JSON.stringify(redBagInfoList);

    return result;
};

// 用户兑换红包记录
// #[rpc=rpcServer]
export const queryConvertLog = (): Result => {
    const result = new Result();
    const uid = getUid();
    const redBagConvertBucket = new Bucket(WARE_NAME, RedBagConvert._$info.name); 
    const userRedBagBucket = new Bucket(WARE_NAME, UserRedBag._$info.name);
    const userRedBag = userRedBagBucket.get<number, UserRedBag[]>(uid)[0];
    if (!userRedBag) {
        result.reslutCode = RESULT_SUCCESS;

        return result;
    }
    const convertInfoList = new RedBagConvertList();
    convertInfoList.list = [];
    for (let i = 0; i < userRedBag.cid_list.length; i++) {
        const convertInfo = redBagConvertBucket.get<string, RedBagConvert[]>(userRedBag.cid_list[i])[0];
        if (convertInfo) convertInfoList.list.push(convertInfo);
    }
    result.reslutCode = RESULT_SUCCESS;
    result.msg = JSON.stringify(convertInfoList);

    return result;
};

// 获取指定红包的详情
// #[rpc=rpcServer]
export const queryRedBagDetail = (rid: string): Result => {
    const result = new Result();
    const redBagData = getRedBagData(rid);
    if (redBagData) result.msg = JSON.stringify(redBagData);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// =================== 本地方法 =====================
/**
 * 生成红包
 * @param uid 发红包用户id
 * @param redBagType 红包类型
 * @param coinType 货币类型
 * @param totalAmount 总金额
 * @param count 红包数量
 * @param desc 红包描述
 */
export const createRedBag = (uid: number, redBagType: number, coinType: number, totalAmount: number, count: number, desc: string): string => {
    const redBagInfoBucket = new Bucket(WARE_NAME, RedBagInfo._$info.name);
    const userRedBagBucket = new Bucket(WARE_NAME, UserRedBag._$info.name);
    const redbagInfo = new RedBagInfo();
    const time = Date.now();
    redbagInfo.rid = createRid(CODE_MAX_CONFLICTS, RID_START_LENGTH);
    redbagInfo.uid = uid;
    redbagInfo.redBag_type = redBagType;
    redbagInfo.coin_type = coinType;
    redbagInfo.total_amount = totalAmount;
    redbagInfo.left_amount = totalAmount;
    redbagInfo.desc = desc;
    redbagInfo.send_time = time.toString();
    redbagInfo.update_time = time.toString();
    redbagInfo.timeout = (time + RED_BAG_TIMEOUT * 24 * 60 * 60 * 1000).toString();
    const cidList = [];
    // 生成红包兑换码和金额
    switch (redBagType) {
        case NORMAL_RED_BAG: // 普通红包
            for (let i = 0; i < count; i++) {
                const cidAmount = new CidAmount();
                cidAmount.cid = createCid(CODE_MAX_CONFLICTS, CID_START_LENGTH);
                cidAmount.amount = Math.floor(totalAmount / count);
                cidList.push(cidAmount);
            }
            break;
        case RANDOM_RED_BAG: // 拼手气红包
            let leftAmount = totalAmount;
            for (let i = 0; i < count; i++) {
                const leftCount = count - i;
                const cidAmount = new CidAmount();
                cidAmount.cid = createCid(CODE_MAX_CONFLICTS, CID_START_LENGTH);
                cidAmount.amount = randomInt(1, leftAmount - leftCount);
                leftAmount = leftAmount - cidAmount.amount;
                cidList.push(cidAmount);
            }
            break;
        default:
            return;
    }
    redbagInfo.cid_list = cidList;
    redbagInfo.left_cid_list = cidList;
    redBagInfoBucket.put(redbagInfo.rid, redbagInfo);
    // 更新用户红包信息
    let userRedBag = userRedBagBucket.get<number, UserRedBag[]>(uid)[0];
    if (!userRedBag) {
        userRedBag = new UserRedBag();
        userRedBag.uid = uid;
        userRedBag.rid_list = [];
        userRedBag.get_rid_list = [];
        userRedBag.cid_list = [];
    }
    userRedBag.rid_list.push(redbagInfo.rid);
    userRedBagBucket.put(uid, userRedBag);
    setTimeout(() => { 
        returnTimeout(redbagInfo.rid);
    }, 20000);

    return redbagInfo.rid;
};

// 超时退款
export const returnTimeout = (rid: string): boolean => {
    console.log('============returnTimeout in', rid);
    const redBagInfoBucket = new Bucket(WARE_NAME, RedBagInfo._$info.name);
    const redBagInfo = redBagInfoBucket.get<string, RedBagInfo[]>(rid)[0];
    if (!redBagInfo) return false;
    // 向钱包服务器增加金额
    const time = Date.now();
    const oid = `${time}${redBagInfo.uid}${randomInt(10000, 99999)}`;
    oauth_alter_balance(redBagInfo.coin_type, oid, redBagInfo.left_amount);
    
    return true;
};

// 获取红包详情
export const getRedBagData = (rid: string): RedBagData => {
    const redBagInfoBucket = new Bucket(WARE_NAME, RedBagInfo._$info.name);
    const redBagConvertBucket = new Bucket(WARE_NAME, RedBagConvert._$info.name);
    const redBagInfo = redBagInfoBucket.get<string, RedBagInfo[]>(rid)[0];
    if (redBagInfo) {
        const redBagData = new RedBagData();
        redBagData.rid = redBagInfo.rid;
        redBagData.uid = redBagInfo.uid;
        redBagData.redBag_type = redBagInfo.redBag_type;
        redBagData.coin_type = redBagInfo.coin_type;
        redBagData.desc = redBagInfo.desc;
        redBagData.total_amount = redBagInfo.total_amount;
        redBagData.left_amount = redBagInfo.left_amount;
        redBagData.send_time = redBagInfo.send_time;
        redBagData.update_time = redBagInfo.update_time;
        redBagData.timeout = redBagInfo.timeout;
        redBagData.cid_list = redBagInfo.cid_list;
        redBagData.left_cid_list = redBagInfo.left_cid_list;
        redBagData.convert_info_list = [];
        for (let j = 0; j < redBagInfo.cid_list.length; j++) {
            const convertInfo = redBagConvertBucket.get<string, RedBagConvert[]>(redBagInfo.cid_list[j].cid)[0];
            if (convertInfo) {
                const convertData = getConvertData(convertInfo, redBagInfo.desc);
                redBagData.convert_info_list.push(convertData);
            }
        }

        return redBagData;
    }

    return;
};

// 获取兑换码详情
export const getConvertData = (redBagConvert: RedBagConvert, desc: string): RedBagConvertData => {
    const redBagConvertData = new RedBagConvertData();
    redBagConvertData.uid = redBagConvert.uid;
    redBagConvertData.send_uid = redBagConvert.send_uid;
    redBagConvertData.rid = redBagConvert.rid;
    redBagConvertData.cid = redBagConvert.cid;
    redBagConvertData.coin_type = redBagConvert.coin_type;
    redBagConvertData.amount = redBagConvert.amount;
    redBagConvertData.get_time = redBagConvert.get_time;
    redBagConvertData.convert_time = redBagConvert.convert_time;
    redBagConvertData.timeout = redBagConvert.timeout;
    redBagConvertData.desc = desc;
    redBagConvertData.user_info = get_userInfo(redBagConvert.uid);

    return redBagConvertData;
};

export const createRid = (count: number, length: number): string => {
    const redBagInfoBucket = new Bucket(WARE_NAME, RedBagInfo._$info.name);
    const chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I',
        'J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let rid = '';
    for (let i = 0; i < length; i++) {
        rid += chars[randomInt(0, chars.length - 1)];
    }
    const redBagInfo = redBagInfoBucket.get<string, RedBagInfo[]>(rid)[0];
    if (redBagInfo) {
        if (count > 0) {
            return createCid(count - 1, length);
        } else {
            return createCid(CODE_MAX_CONFLICTS, length + 1);
        }
    } else {
        return rid;
    }
};

export const createCid = (count: number, length: number): string => {
    const redBagConvertBucket = new Bucket(WARE_NAME, RedBagConvert._$info.name);
    const chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I',
        'J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let cid = '';
    for (let i = 0; i < length; i++) {
        cid += chars[randomInt(0, chars.length - 1)];
    }
    const redBagConvert = redBagConvertBucket.get<string, RedBagConvert[]>(cid)[0];
    if (redBagConvert) {
        if (count > 0) {
            return createCid(count - 1, length);
        } else {
            return createCid(CODE_MAX_CONFLICTS, length + 1);
        }
    } else {
        return cid;
    }
};