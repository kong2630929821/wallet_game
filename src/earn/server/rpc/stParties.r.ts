/**
 * ST独立活动
 */

import { randomInt } from '../../../pi/util/math';
import { Bucket } from '../../utils/db';
import { STConvertCfg } from '../../xlsx/awardCfg.s';
import { AWARD_SRC_CONVERT, AWARD_SRC_ROTARY, AWARD_SRC_TREASUREBOX, KT_TYPE, KT_UNIT_NUM, KT_WALLET_TYPE, LEVEL1_ROTARY_AWARD, LEVEL1_ROTARY_KTCOST, LEVEL1_ROTARY_STCOST, LEVEL1_TREASUREBOX_AWARD, LEVEL1_TREASUREBOX_KTCOST, LEVEL1_TREASUREBOX_STCOST, LEVEL2_ROTARY_AWARD, LEVEL2_ROTARY_KTCOST, LEVEL2_ROTARY_STCOST, LEVEL2_TREASUREBOX_AWARD, LEVEL2_TREASUREBOX_KTCOST, LEVEL2_TREASUREBOX_STCOST, LEVEL3_ROTARY_AWARD, LEVEL3_ROTARY_KTCOST, LEVEL3_ROTARY_STCOST, LEVEL3_TREASUREBOX_AWARD, LEVEL3_TREASUREBOX_KTCOST, LEVEL3_TREASUREBOX_STCOST, MEMORY_NAME, NO_AWARD_SORRY, RESULT_SUCCESS, ST_TYPE, ST_UNIT_NUM, ST_WALLET_TYPE, SURPRISE_BRO, WALLET_API_QUERY, WARE_NAME } from '../data/constant';
import { Result } from '../data/db/guessing.s';
import { AddConvertList, Award, AwardResponse, ConvertAwardList, ConvertTab, FreePlay, ProductInfo } from '../data/db/item.s';
import { BoxOrder, ConvertOrder, RotaryOrder, UserBoxOrderTab, UserConvertOrderTab, UserRotaryOrderTab } from '../data/db/stParties.s';
import { AWARD_NOT_ENOUGH, CONVERT_ALREADY_EXIST, DB_ERROR, GET_ORDERINFO_FAILD, NOT_LOGIN, ORDER_NOT_EXIST, PRODUCT_ALREADY_EXIST, PRODUCT_NOT_EXIST, REDUCE_KT_ERROR, REQUEST_WALLET_FAIL, ROTARY_TYPE_ERROR, ST_NOT_ENOUGH, TREASUREBOX_TYPE_ERROR, UNIFIEDORDER_API_FAILD } from '../data/errorNum';
import { BILL_ALREADY_CHECK, BILL_ALREADY_PAY, NOT_PAY_YET } from '../data/guessingConstant';
import { get_index_id } from '../data/util';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, reduce_itemCount } from '../util/item_util.r';
import { oauth_alter_balance, oauth_send, wallet_order_query, wallet_unifiedorder } from '../util/oauth_lib';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { CoinQueryRes, RandomAward } from './itemQuery.s';
import { getOpenid, getUid } from './user.r';

// 获取用户账户ST数量
// #[rpc=rpcServer]
export const get_STNum = (): CoinQueryRes => {
    const coinQueryRes = new CoinQueryRes();
    coinQueryRes.itemType = ST_TYPE;
    const openid = Number(getOpenid());
    const coinType = ST_WALLET_TYPE;
    const r = oauth_send(WALLET_API_QUERY, { openid: openid, coinType: coinType });
    console.log('http response!!!!!!!!!!!!!!!!!!!!', r);
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.return_code === 1) {
            // 根据平台数据库存储的单位进行转换
            const walletST = json.balance / ST_UNIT_NUM;
            coinQueryRes.num = walletST;
            console.log('http success walletST!!!!!!!!!!!!!!!!!!!!', json.balance);
        } else {
            coinQueryRes.resultNum = REQUEST_WALLET_FAIL;
        }
    } else {
        coinQueryRes.resultNum = REQUEST_WALLET_FAIL;
    }
    coinQueryRes.resultNum = RESULT_SUCCESS;

    return coinQueryRes;
};

// 获取用户账户KT数量
// #[rpc=rpcServer]
export const get_KTNum = (): CoinQueryRes => {
    const coinQueryRes = new CoinQueryRes();
    coinQueryRes.itemType = KT_TYPE;
    const openid = Number(getOpenid());
    const coinType = KT_WALLET_TYPE;
    const r = oauth_send(WALLET_API_QUERY, { openid: openid, coinType: coinType });
    console.log('http response!!!!!!!!!!!!!!!!!!!!', r);
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.return_code === 1) {
            // 根据平台数据库存储的单位进行转换
            const walletKT = json.balance / KT_UNIT_NUM;
            coinQueryRes.num = walletKT;
        } else {
            coinQueryRes.resultNum = REQUEST_WALLET_FAIL;
        }
    } else {
        coinQueryRes.resultNum = REQUEST_WALLET_FAIL;
    }
    coinQueryRes.resultNum = RESULT_SUCCESS;

    return coinQueryRes;
};

// KT转盘
// #[rpc=rpcServer]
export const kt_rotary = (rotaryType:number): Result => {
    const result = new Result(); 
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    let ktCount;
    let hasfree = 0;
    switch (rotaryType) {
        case LEVEL1_ROTARY_AWARD:
            ktCount = LEVEL1_ROTARY_KTCOST;
            const bucket = new Bucket(WARE_NAME, FreePlay._$info.name);
            const freePlay = bucket.get<number, [FreePlay]>(uid)[0];  // 获取是否还有免费的初级转盘次数
            if (!freePlay) break;
            if (freePlay.freeRotary === 0) break;
            hasfree = freePlay.freeRotary;
            freePlay.freeRotary = hasfree - 1;
            bucket.put(uid, freePlay);
            break;
        case LEVEL2_ROTARY_AWARD:
            ktCount = LEVEL2_ROTARY_KTCOST;
            break;
        case LEVEL3_ROTARY_AWARD:
            ktCount = LEVEL3_ROTARY_KTCOST;
            break;
        default:
            result.reslutCode = ROTARY_TYPE_ERROR;

            return result;
    }
    const randomAward = repeat_random_award(rotaryType);
    const newitemType = randomAward.awardType;
    const count = randomAward.count;
    if (hasfree >= 1) { // 如果有免费次数使用免费次数
        if (newitemType === SURPRISE_BRO) {    // 没有抽中奖品
            const time = (new Date()).valueOf().toString();
            const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_ROTARY, time);
            result.msg = JSON.stringify(award);
            result.reslutCode = RESULT_SUCCESS;
    
            return result;
        }
        add_itemCount(uid, newitemType, count);
        const award =  add_award(uid, newitemType, count, AWARD_SRC_ROTARY);
        if (!award) {
            result.reslutCode = DB_ERROR;

            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;

        return result;
    } else {
        // 直接从钱包扣除KT
        const time = (new Date()).valueOf();
        const oid = `${time}${uid}${randomInt(10000, 99999)}`;
        if (!oauth_alter_balance(KT_TYPE, oid, -ktCount)) {
            result.reslutCode = REDUCE_KT_ERROR;

            return result;
        }
        if (newitemType === SURPRISE_BRO) {    // 没有抽中奖品
            const time = (new Date()).valueOf().toString();
            const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_ROTARY, time);
            result.msg = JSON.stringify(award);
            result.reslutCode = RESULT_SUCCESS;
        
            return result;
        }
        add_itemCount(uid, newitemType, count);
        const award =  add_award(uid, newitemType, count, AWARD_SRC_ROTARY);
        if (!award) {
            result.reslutCode = DB_ERROR;
    
            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
        
    }
};

// ST转盘
// #[rpc=rpcServer]
export const st_rotary = (rotaryType:number): Result => {
    const result = new Result(); 
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    let stCount;
    let hasfree = 0;
    switch (rotaryType) {
        case LEVEL1_ROTARY_AWARD:
            stCount = LEVEL1_ROTARY_STCOST;
            const bucket = new Bucket(WARE_NAME, FreePlay._$info.name);
            const freePlay = bucket.get<number, [FreePlay]>(uid)[0];  // 获取是否还有免费的初级转盘次数
            if (!freePlay) break;
            if (freePlay.freeRotary === 0) break;
            hasfree = freePlay.freeRotary;
            freePlay.freeRotary = hasfree - 1;
            bucket.put(uid, freePlay);
            break;
        case LEVEL2_ROTARY_AWARD:
            stCount = LEVEL2_ROTARY_STCOST;
            break;
        case LEVEL3_ROTARY_AWARD:
            stCount = LEVEL3_ROTARY_STCOST;
            break;
        default:
            result.reslutCode = ROTARY_TYPE_ERROR;

            return result;
    }
    if (hasfree >= 1) { // 如果有免费次数使用免费次数
        const randomAward = repeat_random_award(rotaryType);
        const newitemType = randomAward.awardType;
        const count = randomAward.count;
        if (newitemType === SURPRISE_BRO) {    // 没有抽中奖品
            const time = (new Date()).valueOf().toString();
            const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_ROTARY, time);
            result.msg = JSON.stringify(award);
            result.reslutCode = RESULT_SUCCESS;
    
            return result;
        }
        add_itemCount(uid, newitemType, count);
        const award =  add_award(uid, newitemType, count, AWARD_SRC_ROTARY);
        if (!award) {
            result.reslutCode = DB_ERROR;

            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;

        return result;
    } else { // 没有免费次数则向钱包下单
        // 随机奖品
        const randomAward = repeat_random_award(rotaryType);
        const newitemType = randomAward.awardType;
        const count = randomAward.count;
        // 生成订单
        const time = (new Date()).valueOf();
        const oid = `${time}${uid}${randomInt(10000, 99999)}`;
        const orderBucket = new Bucket(WARE_NAME, RotaryOrder._$info.name);
        const order = new RotaryOrder(oid, uid, rotaryType, newitemType, count, stCount, time.toString(), NOT_PAY_YET);
        orderBucket.put(oid, order);
        const resultJson = wallet_unifiedorder(oid, stCount, 'Rotary', ST_WALLET_TYPE);
        if (!resultJson) {
            result.reslutCode = UNIFIEDORDER_API_FAILD;

            return result;
        }
        // 是否是第一次购买
        const userOrderBucket = new Bucket(WARE_NAME, UserRotaryOrderTab._$info.name);
        const userRotaryOrderTab = userOrderBucket.get<number, [UserRotaryOrderTab]>(uid)[0];
        if (!userRotaryOrderTab) {
            resultJson.isFirst = 1;
        } else {
            resultJson.isFirst = 0;
        }
        resultJson.oid = oid;
        result.msg = JSON.stringify(resultJson);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
        
    }
};

// 转盘支付查询
// #[rpc=rpcServer]
export const rotary_pay_query = (oid: string): Result => {
    console.log('guessing_pay_query in!!!!!!!!!!!!');
    const result = new Result();
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    const orderBucket = new Bucket(WARE_NAME, RotaryOrder._$info.name);
    const order = orderBucket.get<string, [RotaryOrder]>(oid)[0];
    if (!order) {
        result.reslutCode = ORDER_NOT_EXIST;

        return result;
    }
    // 向钱包服务器查询订单
    const resultJson = wallet_order_query(oid);
    if (resultJson.pay_status !== 'success') {
        console.log('resultJson.pay_status!!!!!!!!!!', resultJson.pay_status);
        result.reslutCode = GET_ORDERINFO_FAILD;

        return result;
    }
    // 支付成功 更新订单信息
    if (order.state === BILL_ALREADY_CHECK) {
        result.reslutCode = RESULT_SUCCESS;

        return result;
    }
    order.state = BILL_ALREADY_PAY;
    orderBucket.put(oid, order);
    const userOrderBucket = new Bucket(WARE_NAME, UserRotaryOrderTab._$info.name);
    let userRotaryOrderTab = userOrderBucket.get<number, [UserRotaryOrderTab]>(uid)[0];
    if (!userRotaryOrderTab) {
        userRotaryOrderTab = new UserRotaryOrderTab(uid, []);
    }
    userRotaryOrderTab.oidList.push(oid);
    userOrderBucket.put(uid, userRotaryOrderTab);
    
    if (order.awardType === SURPRISE_BRO) {    // 没有抽中奖品
        const time = (new Date()).valueOf().toString();
        const award = new Award(NO_AWARD_SORRY, order.awardType, 1, uid, AWARD_SRC_ROTARY, time);
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
    }
    const convertInfoResult = get_convert_info(order.awardType);
    if (convertInfoResult.reslutCode !== RESULT_SUCCESS) {    // 判断奖品是否为虚拟兑换类奖品
        add_itemCount(uid, order.awardType, order.awardCount); // 不是可兑换奖品 作为普通物品添加
        const award =  add_award(uid, order.awardType, order.awardCount, AWARD_SRC_ROTARY);
        if (!award) {
            result.reslutCode = DB_ERROR;
    
            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
    } else {  // 是可兑换奖品 添加兑换码
        const convertInfo: ProductInfo = JSON.parse(convertInfoResult.msg);
        const convertAward = get_convert(order.awardType);
        if (!convertAward) {
            result.reslutCode = AWARD_NOT_ENOUGH;
    
            return result;
        }
        const award =  add_award(uid, order.awardType, order.awardCount, AWARD_SRC_ROTARY, convertAward.convert, convertInfo.name, convertAward.deadTime);
        if (!award) {
            result.reslutCode = DB_ERROR;
    
            return result;
        }
        // 奖品已发放 更改订单状态
        order.state === BILL_ALREADY_CHECK;
        orderBucket.put(oid, order);
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
    }
};

// ST开宝箱
// #[rpc=rpcServer]
export const st_treasurebox = (treasureboxType:number): Result => {
    console.log('st_treasurebox in!!!!!!!!!!!!', treasureboxType);
    const result = new Result();
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    let stCount;
    let hasfree = 0;
    switch (treasureboxType) {
        case LEVEL1_TREASUREBOX_AWARD:
            stCount = LEVEL1_TREASUREBOX_STCOST;
            const bucket = new Bucket(WARE_NAME, FreePlay._$info.name);
            const freePlay = bucket.get<number, [FreePlay]>(uid)[0];  // 获取是否还有免费的初级转盘次数
            if (!freePlay) break;
            if (freePlay.freeBox === 0) break;
            hasfree = freePlay.freeBox;
            freePlay.freeBox = hasfree - 1;
            bucket.put(uid, freePlay);
            break;
        case LEVEL2_TREASUREBOX_AWARD:
            stCount = LEVEL2_TREASUREBOX_STCOST;
            break;
        case LEVEL3_TREASUREBOX_AWARD:
            stCount = LEVEL3_TREASUREBOX_STCOST;
            break;
        default:
            result.reslutCode = TREASUREBOX_TYPE_ERROR;

            return result;
    }
    if (hasfree >= 1) { // 如果有免费次数使用免费次数
        console.log('freeBox in!!!!!!!!!!!!', hasfree);
        const randomAward = repeat_random_award(treasureboxType);
        const newitemType = randomAward.awardType;
        const count = randomAward.count;
        if (newitemType === SURPRISE_BRO) {    // 没有抽中奖品
            const time = (new Date()).valueOf().toString();
            const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_TREASUREBOX, time);
            result.msg = JSON.stringify(award);
            result.reslutCode = RESULT_SUCCESS;
    
            return result;
        }
        add_itemCount(uid, newitemType, count);
        const award =  add_award(uid, newitemType, count, AWARD_SRC_TREASUREBOX);
        if (!award) {
            result.reslutCode = DB_ERROR;

            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;

        return result;
    } else { // 没有免费次数则向钱包下单
        // 随即奖品
        const randomAward = repeat_random_award(treasureboxType);
        const newitemType = randomAward.awardType;
        const count = randomAward.count;
        // 生成订单
        const time = (new Date()).valueOf();
        const oid = `${time}${uid}${randomInt(10000, 99999)}`;
        const orderBucket = new Bucket(WARE_NAME, BoxOrder._$info.name);
        const order = new BoxOrder(oid, uid, treasureboxType, newitemType, count, stCount, time.toString(), NOT_PAY_YET);
        orderBucket.put(oid, order);
        const resultJson = wallet_unifiedorder(oid, stCount, 'TreasureBox', ST_WALLET_TYPE);
        if (!resultJson) {
            result.reslutCode = UNIFIEDORDER_API_FAILD;

            return result;
        }
        // 是否是第一次购买
        const userOrderBucket = new Bucket(WARE_NAME, UserBoxOrderTab._$info.name);
        const userBoxOrderTab = userOrderBucket.get<number, [UserBoxOrderTab]>(uid)[0];
        if (!userBoxOrderTab) {
            resultJson.isFirst = 1;
        } else {
            resultJson.isFirst = 0;
        }
        resultJson.oid = oid;
        console.log('resultJson!!!!!!!!!!', resultJson);
        result.msg = JSON.stringify(resultJson);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
        
    }
};

// KT宝箱
// #[rpc=rpcServer]
export const kt_treasurebox = (boxType:number): Result => {
    const result = new Result(); 
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    let ktCount;
    let hasfree = 0;
    switch (boxType) {
        case LEVEL1_TREASUREBOX_AWARD:
            ktCount = LEVEL1_TREASUREBOX_KTCOST;
            const bucket = new Bucket(WARE_NAME, FreePlay._$info.name);
            const freePlay = bucket.get<number, [FreePlay]>(uid)[0];  // 获取是否还有免费的初级转盘次数
            if (!freePlay) break;
            if (freePlay.freeBox === 0) break;
            hasfree = freePlay.freeBox;
            freePlay.freeBox = hasfree - 1;
            bucket.put(uid, freePlay);
            break;
        case LEVEL2_TREASUREBOX_AWARD:
            ktCount = LEVEL2_TREASUREBOX_KTCOST;
            break;
        case LEVEL3_TREASUREBOX_AWARD:
            ktCount = LEVEL3_TREASUREBOX_KTCOST;
            break;
        default:
            result.reslutCode = TREASUREBOX_TYPE_ERROR;

            return result;
    }
    const randomAward = repeat_random_award(boxType);
    const newitemType = randomAward.awardType;
    const count = randomAward.count;
    if (hasfree >= 1) { // 如果有免费次数使用免费次数
        if (newitemType === SURPRISE_BRO) {    // 没有抽中奖品
            const time = (new Date()).valueOf().toString();
            const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_TREASUREBOX, time);
            result.msg = JSON.stringify(award);
            result.reslutCode = RESULT_SUCCESS;
    
            return result;
        }
        add_itemCount(uid, newitemType, count);
        const award =  add_award(uid, newitemType, count, AWARD_SRC_TREASUREBOX);
        if (!award) {
            result.reslutCode = DB_ERROR;

            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;

        return result;
    } else {
        // 直接从钱包扣除KT
        const time = (new Date()).valueOf();
        const oid = `${time}${uid}${randomInt(10000, 99999)}`;
        if (!oauth_alter_balance(KT_TYPE, oid, -ktCount)) {
            result.reslutCode = REDUCE_KT_ERROR;

            return result;
        }
        if (newitemType === SURPRISE_BRO) {    // 没有抽中奖品
            const time = (new Date()).valueOf().toString();
            const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_TREASUREBOX, time);
            result.msg = JSON.stringify(award);
            result.reslutCode = RESULT_SUCCESS;
        
            return result;
        }
        add_itemCount(uid, newitemType, count);
        const award =  add_award(uid, newitemType, count, AWARD_SRC_TREASUREBOX);
        if (!award) {
            result.reslutCode = DB_ERROR;
    
            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
        
    }
};

// 宝箱支付查询
// #[rpc=rpcServer]
export const box_pay_query = (oid: string): Result => {
    console.log('box_pay_query in!!!!!!!!!!!!', oid);
    const result = new Result();
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    const orderBucket = new Bucket(WARE_NAME, BoxOrder._$info.name);
    const order = orderBucket.get<string, [BoxOrder]>(oid)[0];
    if (!order) {
        result.reslutCode = ORDER_NOT_EXIST;

        return result;
    }
    console.log('order!!!!!!!!!!', order);
    // 向钱包服务器查询订单
    const resultJson = wallet_order_query(oid);
    if (resultJson.pay_status !== 'success') {
        console.log('resultJson.pay_status!!!!!!!!!!', resultJson.pay_status);
        result.reslutCode = GET_ORDERINFO_FAILD;

        return result;
    }
    // 支付成功 更新订单信息
    if (order.state === BILL_ALREADY_CHECK) {
        result.reslutCode = RESULT_SUCCESS;

        return result;
    }
    order.state = BILL_ALREADY_PAY;
    orderBucket.put(oid, order);
    const userOrderBucket = new Bucket(WARE_NAME, UserBoxOrderTab._$info.name);
    let userBoxOrderTab = userOrderBucket.get<number, [UserBoxOrderTab]>(uid)[0];
    if (!userBoxOrderTab) {
        userBoxOrderTab = new UserBoxOrderTab(uid, []);
    }
    userBoxOrderTab.oidList.push(oid);
    userOrderBucket.put(uid, userBoxOrderTab);
    if (order.awardType === SURPRISE_BRO) {    // 没有抽中奖品
        const time = (new Date()).valueOf().toString();
        const award = new Award(NO_AWARD_SORRY, order.awardType, 1, uid, AWARD_SRC_TREASUREBOX, time);
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
        
        return result;
    }
    const convertInfoResult = get_convert_info(order.awardType);
    if (convertInfoResult.reslutCode !== RESULT_SUCCESS) {    // 判断奖品是否为虚拟兑换类奖品
        add_itemCount(uid, order.awardType, order.awardCount); // 不是可兑换奖品 作为普通物品添加
        const award =  add_award(uid, order.awardType, order.awardCount, AWARD_SRC_TREASUREBOX);
        if (!award) {
            result.reslutCode = DB_ERROR;
            
            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
        
        return result;
    } else {  // 是可兑换奖品 添加兑换码
        const convertInfo: ProductInfo = JSON.parse(convertInfoResult.msg);
        const convertAward = get_convert(order.awardType);
        if (!convertAward) {
            result.reslutCode = AWARD_NOT_ENOUGH;
            
            return result;
        }
        const award =  add_award(uid, order.awardType, order.awardCount, AWARD_SRC_TREASUREBOX, convertAward.convert, convertInfo.name, convertAward.deadTime);
        if (!award) {
            result.reslutCode = DB_ERROR;
            
            return result;
        }
        // 奖品已发放 更改订单状态
        order.state === BILL_ALREADY_CHECK;
        orderBucket.put(oid, order);
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
    }
};

// 查看兑换列表
// #[rpc=rpcServer]
export const get_convert_list = (): Result => {
    const result = new Result();
    const convertAwardList = new ConvertAwardList();
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    const iter = bucket.iter(null);
    const list = [];
    do {
        const iterConvert = iter.next();
        console.log('elCfg----------------read---------------', iterConvert);
        if (!iterConvert) {
            break;
        }
        const stConvertCfg:ProductInfo = iterConvert[1];
        list.push(stConvertCfg);
        
    } while (iter);
    convertAwardList.list = list;
    result.reslutCode = RESULT_SUCCESS;
    result.msg = JSON.stringify(convertAwardList);
    
    return result;
};

// ST兑换(已经改成KT了)
// #[rpc=rpcServer]
export const st_convert = (awardType:number):Result => {
    console.log('resultJst_convertson in!!!!!!!!!!');
    const result = new Result();
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    const productInfo = bucket.get<number, [ProductInfo]>(awardType)[0];
    if (!productInfo) {
        result.reslutCode = DB_ERROR;

        return result;
    }
    console.log('productInfo in!!!!!!!!!!', productInfo);
    const stCount = productInfo.stCount;
    // 判断该商品是否有库存
    if (productInfo.leftCount <= 0) {
        result.reslutCode = AWARD_NOT_ENOUGH;

        return result;
    }
    // 生成订单
    const time = (new Date()).valueOf();
    const oid = `${time}${uid}${randomInt(10000, 99999)}`;
    const orderBucket = new Bucket(WARE_NAME, ConvertOrder._$info.name);
    const order = new ConvertOrder(oid, uid, awardType, stCount, time.toString(), NOT_PAY_YET);
    orderBucket.put(oid, order);
    const resultJson = wallet_unifiedorder(oid, stCount, 'Convert', KT_WALLET_TYPE);
    if (!resultJson) {
        result.reslutCode = UNIFIEDORDER_API_FAILD;

        return result;
    }
    // 是否是第一次购买
    const userOrderBucket = new Bucket(WARE_NAME, UserConvertOrderTab._$info.name);
    const userConvertOrderTab = userOrderBucket.get<number, [UserConvertOrderTab]>(uid)[0];
    if (!userConvertOrderTab) {
        resultJson.isFirst = 1;
    } else {
        resultJson.isFirst = 0;
    }
    resultJson.oid = oid;
    console.log('resultJson!!!!!!!!!!', resultJson);
    result.msg = JSON.stringify(resultJson);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 兑换支付查询
// #[rpc=rpcServer]
export const convert_pay_query = (oid: string): Result => {
    console.log('convert_pay_query in!!!!!!!!!!!!');
    const result = new Result();
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    const orderBucket = new Bucket(WARE_NAME, ConvertOrder._$info.name);
    const order = orderBucket.get<string, [ConvertOrder]>(oid)[0];
    if (!order) {
        result.reslutCode = ORDER_NOT_EXIST;

        return result;
    }
    // 向钱包服务器查询订单
    const resultJson = wallet_order_query(oid);
    if (resultJson.pay_status !== 'success') {
        console.log('resultJson.pay_status!!!!!!!!!!', resultJson.pay_status);
        result.reslutCode = GET_ORDERINFO_FAILD;

        return result;
    }
    // 支付成功 更新订单信息
    order.state = BILL_ALREADY_PAY;
    orderBucket.put(oid, order);
    const userOrderBucket = new Bucket(WARE_NAME, UserConvertOrderTab._$info.name);
    let userConvertOrderTab = userOrderBucket.get<number, [UserConvertOrderTab]>(uid)[0];
    if (!userConvertOrderTab) {
        userConvertOrderTab = new UserConvertOrderTab(uid, []);
    }
    userConvertOrderTab.oidList.push(oid);
    userOrderBucket.put(uid, userConvertOrderTab);
    // 从数据库获取兑换码
    const awardType = order.awardType;
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    const productInfo = bucket.get<number, [ProductInfo]>(awardType)[0];
    if (!productInfo) {
        result.reslutCode = DB_ERROR;

        return result;
    }
    const convertAward = get_convert(awardType);
    if (!convertAward) {
        result.reslutCode = AWARD_NOT_ENOUGH;
    
        return result;
    }
    bucket.put(awardType, productInfo);
    const award = add_award(uid, awardType, 1, AWARD_SRC_CONVERT, convertAward.convert, productInfo.desc, convertAward.deadTime);
    if (!award) {
        result.reslutCode = DB_ERROR;
    
        return result;
    }
    result.msg = JSON.stringify(award);
    result.reslutCode = RESULT_SUCCESS;
    
    return result;
};

// 获取可兑换的虚拟物品信息
// #[rpc=rpcServer]
export const get_convert_info = (id:number):Result => {
    console.log('get_convert_info in !!!!!!!!!!!!!!!!!!!!!!!', id);
    const result = new Result();
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    const productInfo = bucket.get<number, [ProductInfo]>(id)[0];
    if (!productInfo) {
        result.reslutCode = PRODUCT_NOT_EXIST;

        return result;
    }
    result.msg = JSON.stringify(productInfo);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 添加商品信息
// #[rpc=rpcServer]
export const add_convert_info = (convertAwardList :ConvertAwardList): Result => {
    console.log('add_convert_info in !!!!!!!!!!!!!!!!!!!!!!!', convertAwardList);
    const result = new Result();
    const productInfoList = convertAwardList.list;
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    for (let i = 0 ; i < productInfoList.length; i ++) {
        const pid = productInfoList[i].id;
        console.log('pid !!!!!!!!!!!!!!!!!!!!!!!', pid);
        if (bucket.get(pid)[0]) {
            result.reslutCode = PRODUCT_ALREADY_EXIST;

            return result;
        }
        console.log('stCount !!!!!!!!!!!!!!!!!!!!!!!', productInfoList[i].stCount);
        productInfoList[i].leftCount = 0;
        productInfoList[i].convertCount = 0;
        bucket.put(pid, productInfoList[i]);
    }
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 从excel批量添加商品信息
// #[rpc=rpcServer]
export const add_convert_infos = (): Result => {
    console.log('add_convert_infos in !!!!!!!!!!!!!!!!!!!!!!!');
    const result = new Result();
    const excelBucket = new Bucket(MEMORY_NAME, STConvertCfg._$info.name);
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    const iter = excelBucket.iter(null);
    do {
        const iterEle = iter.next();
        console.log('elCfg----------------read---------------', iterEle);
        if (!iterEle) {
            break;
        }
        const convertCfg:STConvertCfg = iterEle[1];
        // 数据库已存在该条记录则忽略
        if (bucket.get(convertCfg.id)[0]) continue;
        const productInfo = new ProductInfo(convertCfg.id, convertCfg.count, convertCfg.name, convertCfg.value, convertCfg.desc, convertCfg.progress, convertCfg.tips, convertCfg.level, convertCfg.pic, 0, 0);
        bucket.put(convertCfg.id, productInfo);
        
    } while (iter);
    
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 修改商品信息
// #[rpc=rpcServer]
export const modify_convert_info = (product: ProductInfo): Result => {
    console.log('modify_convert_info in !!!!!!!!!!!!!!!!!!!!!!!', product);
    const result = new Result();
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    const pid = product.id;
    console.log('pid !!!!!!!!!!!!!!!!!!!!!!!', pid);
    if (!bucket.get(pid)[0]) {
        result.reslutCode = PRODUCT_NOT_EXIST;

        return result;
    }
    console.log('stCount !!!!!!!!!!!!!!!!!!!!!!!', product.stCount);
    bucket.put(pid, product);
    console.log('ProductInfo !!!!!!!!!!!!!!!!!!!!!!!', bucket.get(pid)[0]);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 修改商品
// #[rpc=rpcServer]
export const delete_convert_info = (id: number): Result => {
    console.log('delete_convert_info in !!!!!!!!!!!!!!!!!!!!!!!', id);
    const result = new Result();
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    console.log('pid !!!!!!!!!!!!!!!!!!!!!!!', id);
    if (!bucket.get(id)[0]) {
        result.reslutCode = PRODUCT_NOT_EXIST;

        return result;
    }
    bucket.delete(id);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 添加兑换码
// #[rpc=rpcServer]
export const add_convert = (addConvertList: AddConvertList):Result => {
    console.log('add_convert in !!!!!!!!!!!!!!!!!!!!!!!', addConvertList);
    const result = new Result();
    const addList = addConvertList.list;
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    const tabBucket = new Bucket(WARE_NAME, ConvertTab._$info.name);
    for (let i = 0; i < addList.length; i ++) {
        const productInfo = bucket.get<number, [ProductInfo]>(addList[i].typeNum)[0];
        if (!productInfo) {
            result.reslutCode = PRODUCT_NOT_EXIST;

            return result;
        }
        // const id = get_index_id(AWARD_SRC_CONVERT);
        if (tabBucket.get(addList[i].convert)[0]) {
            result.reslutCode = CONVERT_ALREADY_EXIST;

            return result;
        }
        console.log('addList[i].convert!!!!!!!!!', tabBucket.get(addList[i].convert)[0]);
        const convertTab = new ConvertTab(addList[i].convert, addList[i].typeNum, true, addList[i].deadTime);
        tabBucket.put(addList[i].convert, convertTab);
        // 相应商品库存加1
        productInfo.leftCount += 1;
        console.log('add_leftCount!!!!!!!!!', productInfo.leftCount);
        bucket.put(addList[i].typeNum, productInfo);
    }
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 查询是否有初级转盘和宝箱免费次数
// #[rpc=rpcServer]
export const get_hasFree = ():FreePlay => {
    const uid = getUid();
    if (!uid) return;
    const bucket = new Bucket(WARE_NAME, FreePlay._$info.name);
    let freePlay = bucket.get<number, [FreePlay]>(uid)[0];
    if (!freePlay) {
        freePlay = new FreePlay();
        freePlay.uid = uid;
        freePlay.freeBox = 0;
        freePlay.freeRotary = 0;
        freePlay.adAwardBox = 0;
        freePlay.adAwardRotary = 0;
        bucket.put(uid, freePlay);
    }

    return freePlay;
};

// 每日首次登陆添加一次免费初级转盘和宝箱次数
export const add_free_rotary = () => {
    console.log('add_free_rotary in!!!!!!!!!');
    const uid = getUid();
    const bucket = new Bucket(WARE_NAME, FreePlay._$info.name);
    const freePlay = new FreePlay();
    // 前一天的免费次数清零
    freePlay.uid = uid;
    freePlay.freeRotary = 1;
    freePlay.freeBox = 1;
    freePlay.adAwardRotary = 0;
    freePlay.adAwardBox = 0;
    bucket.put(uid, freePlay);
};

// 从数据库获取兑换码
export const get_convert = (id: number): ConvertTab => {
    const convertBucket = new Bucket(WARE_NAME, ConvertTab._$info.name);
    const productInfoBucket = new Bucket(WARE_NAME, ProductInfo._$info.name);
    const productInfo = productInfoBucket.get<number, [ProductInfo]>(id)[0];
    if (!productInfo) return;
    // 从数据库获取兑换码
    const iter = convertBucket.iter(null);
    let convertAward:ConvertTab;
    do {
        const iterConvert = iter.next();
        console.log('elCfg----------------read---------------', iterConvert);
        if (!iterConvert) {
            return ;
        }
        const convertTab:ConvertTab = iterConvert[1];
        if ((convertTab.typeNum === id) && (convertTab.state === true)) {
            convertAward = convertTab;
            break;
        }
    } while (iter);
    if (!convertAward) return;
    // 已发出的兑换码数据库状态改为false
    convertAward.state = false;
    convertBucket.put(convertAward.convert, convertAward);
    // 更改商品库存
    productInfo.leftCount -= 1;
    productInfo.convertCount += 1;
    productInfoBucket.put(id, productInfo);

    return convertAward;
};

// 重复随机奖励
export const repeat_random_award = (id: number): RandomAward => {
    console.log('repeat_random_award in~ !!!!!!!!!!!!!!!!!!!!!!!', id);
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    let count;
    let awardType;
    let convertInfoResult: Result;
    let convertInfo: ProductInfo;
    do {
        convertInfo = null;
        const v = [];
        doAward(id, randomMgr, v);
        console.log('repeat awardType !!!!!!!!!!!!!!!!!!!!!!!', v);
        count = v[0][1];
        awardType = v[0][0];
        convertInfoResult = get_convert_info(awardType);
        if (convertInfoResult.reslutCode === RESULT_SUCCESS) {
            convertInfo = JSON.parse(convertInfoResult.msg);
        }
    } while (convertInfoResult.reslutCode === RESULT_SUCCESS && convertInfo && convertInfo.leftCount === 0);
    const randomAward = new RandomAward();
    randomAward.awardType = awardType;
    randomAward.count = count;

    return randomAward;
};