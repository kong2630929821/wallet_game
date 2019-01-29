/**
 * ST独立活动
 */

import { randomInt } from '../../../pi/util/math';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { DBIter } from '../../../pi_pt/rust/pi_serv/js_db';
import { Bucket } from '../../utils/db';
import { AWARD_SRC_CONVERT, AWARD_SRC_ROTARY, AWARD_SRC_TREASUREBOX, KT_TYPE, KT_UNIT_NUM, KT_WALLET_TYPE, LEVEL1_ROTARY_AWARD, LEVEL1_ROTARY_STCOST, LEVEL1_TREASUREBOX_AWARD, LEVEL1_TREASUREBOX_STCOST, LEVEL2_ROTARY_AWARD, LEVEL2_ROTARY_STCOST, LEVEL2_TREASUREBOX_AWARD, LEVEL2_TREASUREBOX_STCOST, LEVEL3_ROTARY_AWARD, LEVEL3_ROTARY_STCOST, LEVEL3_TREASUREBOX_AWARD, LEVEL3_TREASUREBOX_STCOST, MEMORY_NAME, NO_AWARD_SORRY, RESULT_SUCCESS, ST_TYPE, ST_UNIT_NUM, ST_WALLET_TYPE, SURPRISE_BRO, WALLET_API_QUERY, WARE_NAME } from '../data/constant';
import { Result } from '../data/db/guessing.s';
import { AddConvertList, Award, AwardResponse, ConvertAwardList, ConvertTab, FreePlay, ProductInfo } from '../data/db/item.s';
import { BoxOrder, RotaryOrder, UserBoxOrderTab, UserRotaryOrderTab } from '../data/db/stParties.s';
import { AWARD_NOT_ENOUGH, CONVERT_ALREADY_EXIST, DB_ERROR, GET_ORDERINFO_FAILD, ORDER_NOT_EXIST, PRODUCT_ALREADY_EXIST, PRODUCT_NOT_EXIST, REQUEST_WALLET_FAIL, ROTARY_TYPE_ERROR, ST_NOT_ENOUGH, TREASUREBOX_TYPE_ERROR, UNIFIEDORDER_API_FAILD } from '../data/errorNum';
import { BILL_ALREADY_PAY, NOT_PAY_YET } from '../data/guessingConstant';
import { get_index_id } from '../data/util';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, reduce_itemCount } from '../util/item_util.r';
import { oauth_send, wallet_order_query, wallet_unifiedorder } from '../util/oauth_lib';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { CoinQueryRes } from './itemQuery.s';
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

// ST转盘
// #[rpc=rpcServer]
export const st_rotary = (rotaryType:number): Result => {
    const result = new Result(); 
    const uid = getUid();
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const dbMgr = getEnv().getDbMgr();
    let stCount;
    let hasfree = false;
    switch (rotaryType) {
        case LEVEL1_ROTARY_AWARD:
            stCount = LEVEL1_ROTARY_STCOST;
            const bucket = new Bucket(WARE_NAME, FreePlay._$info.name, dbMgr);
            const freePlay = bucket.get<number, [FreePlay]>(uid)[0];  // 获取是否还有免费的初级转盘次数
            if (!freePlay) break;
            hasfree = freePlay.freeRotary;
            freePlay.freeRotary = false;
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
    if (hasfree === true) { // 如果有免费次数使用免费次数
        const v = [];
        doAward(rotaryType, randomMgr, v);
        const count = v[0][1];
        const newitemType = v[0][0];
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
        // 生成订单
        const time = (new Date()).valueOf();
        const oid = `${time}${uid}${randomInt(10000, 99999)}`;
        const orderBucket = new Bucket(WARE_NAME, RotaryOrder._$info.name, dbMgr);
        const order = new RotaryOrder(oid, uid, rotaryType, stCount, time.toString(), NOT_PAY_YET);
        orderBucket.put(oid, order);
        const resultJson = wallet_unifiedorder(oid, stCount, 'Rotary');
        if (!resultJson) {
            result.reslutCode = UNIFIEDORDER_API_FAILD;

            return result;
        }
        // 是否是第一次购买
        const userOrderBucket = new Bucket(WARE_NAME, UserRotaryOrderTab._$info.name, dbMgr);
        const userRotaryOrderTab = userOrderBucket.get<number, [UserRotaryOrderTab]>(uid)[0];
        if (!userRotaryOrderTab) {
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

// 转盘支付查询
// #[rpc=rpcServer]
export const rotary_pay_query = (oid: string): Result => {
    console.log('guessing_pay_query in!!!!!!!!!!!!');
    const uid = getUid();
    const result = new Result();
    const dbMgr = getEnv().getDbMgr();
    const orderBucket = new Bucket(WARE_NAME, RotaryOrder._$info.name, dbMgr);
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
    order.state = BILL_ALREADY_PAY;
    orderBucket.put(oid, order);
    const userOrderBucket = new Bucket(WARE_NAME, UserRotaryOrderTab._$info.name, dbMgr);
    let userRotaryOrderTab = userOrderBucket.get<number, [UserRotaryOrderTab]>(uid)[0];
    if (!userRotaryOrderTab) {
        userRotaryOrderTab = new UserRotaryOrderTab(uid, []);
    }
    userRotaryOrderTab.oidList.push(oid);
    userOrderBucket.put(uid, userRotaryOrderTab);
    const rotaryType = order.rotatyType;
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const v = [];
    doAward(rotaryType, randomMgr, v);
    const count = v[0][1];
    const newitemType = v[0][0];
    if (newitemType === SURPRISE_BRO) {    // 没有抽中奖品
        const time = (new Date()).valueOf().toString();
        const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_ROTARY, time);
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
    }
    const convertInfo = get_convert_info(newitemType);
    if (!convertInfo) {    // 判断奖品是否为虚拟兑换类奖品
        add_itemCount(uid, newitemType, count); // 不是可兑换奖品 作为普通物品添加
        const award =  add_award(uid, newitemType, count, AWARD_SRC_ROTARY);
        if (!award) {
            result.reslutCode = DB_ERROR;
    
            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
    } else {  // 是可兑换奖品 添加兑换码
        const convertAward = get_convert(newitemType);
        if (!convertAward) {
            result.reslutCode = AWARD_NOT_ENOUGH;
    
            return result;
        }
        const award =  add_award(uid, newitemType, count, AWARD_SRC_ROTARY, convertAward.convert, convertInfo.name);
        if (!award) {
            result.reslutCode = DB_ERROR;
    
            return result;
        }
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
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const dbMgr = getEnv().getDbMgr();
    let stCount;
    let hasfree = false;
    switch (treasureboxType) {
        case LEVEL1_TREASUREBOX_AWARD:
            stCount = LEVEL1_TREASUREBOX_STCOST;
            const bucket = new Bucket(WARE_NAME, FreePlay._$info.name, dbMgr);
            const freePlay = bucket.get<number, [FreePlay]>(uid)[0];  // 获取是否还有免费的初级转盘次数
            if (!freePlay) break;
            hasfree = freePlay.freeBox;
            freePlay.freeBox = false;
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
    if (hasfree === true) { // 如果有免费次数使用免费次数
        const v = [];
        doAward(treasureboxType, randomMgr, v);
        const count = v[0][1];
        const newitemType = v[0][0];
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
        // 生成订单
        const time = (new Date()).valueOf();
        const oid = `${time}${uid}${randomInt(10000, 99999)}`;
        const orderBucket = new Bucket(WARE_NAME, BoxOrder._$info.name, dbMgr);
        const order = new BoxOrder(oid, uid, treasureboxType, stCount, time.toString(), NOT_PAY_YET);
        orderBucket.put(oid, order);
        const resultJson = wallet_unifiedorder(oid, stCount, 'TreasureBox');
        if (!resultJson) {
            result.reslutCode = UNIFIEDORDER_API_FAILD;

            return result;
        }
        // 是否是第一次购买
        const userOrderBucket = new Bucket(WARE_NAME, UserBoxOrderTab._$info.name, dbMgr);
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

// 宝箱支付查询
// #[rpc=rpcServer]
export const box_pay_query = (oid: string): Result => {
    console.log('guessing_pay_query in!!!!!!!!!!!!');
    const uid = getUid();
    const result = new Result();
    const dbMgr = getEnv().getDbMgr();
    const orderBucket = new Bucket(WARE_NAME, BoxOrder._$info.name, dbMgr);
    const order = orderBucket.get<string, [BoxOrder]>(oid)[0];
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
    const userOrderBucket = new Bucket(WARE_NAME, UserBoxOrderTab._$info.name, dbMgr);
    let userBoxOrderTab = userOrderBucket.get<number, [UserBoxOrderTab]>(uid)[0];
    if (!userBoxOrderTab) {
        userBoxOrderTab = new UserBoxOrderTab(uid, []);
    }
    userBoxOrderTab.oidList.push(oid);
    userOrderBucket.put(uid, userBoxOrderTab);
    const rotaryType = order.boxType;
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const v = [];
    doAward(rotaryType, randomMgr, v);
    const count = v[0][1];
    const newitemType = v[0][0];
    if (newitemType === SURPRISE_BRO) {    // 没有抽中奖品
        const time = (new Date()).valueOf().toString();
        const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_TREASUREBOX, time);
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
    }
    const convertInfo = get_convert_info(newitemType);
    if (!convertInfo) {    // 判断奖品是否为虚拟兑换类奖品
        add_itemCount(uid, newitemType, count); // 不是可兑换奖品 作为普通物品添加
        const award =  add_award(uid, newitemType, count, AWARD_SRC_TREASUREBOX);
        if (!award) {
            result.reslutCode = DB_ERROR;
    
            return result;
        }
        result.msg = JSON.stringify(award);
        result.reslutCode = RESULT_SUCCESS;
    
        return result;
    } else {  // 是可兑换奖品 添加兑换码
        const convertAward = get_convert(newitemType);
        if (!convertAward) {
            result.reslutCode = AWARD_NOT_ENOUGH;
    
            return result;
        }
        const award =  add_award(uid, newitemType, count, AWARD_SRC_TREASUREBOX, convertAward.convert, convertInfo.name);
        if (!award) {
            result.reslutCode = DB_ERROR;
    
            return result;
        }
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
    const dbMgr = getEnv().getDbMgr(); 
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name, dbMgr);
    const iter = <DBIter>bucket.iter(null);
    const list = [];
    do {
        const iterConvert = iter.nextElem();
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

// ST兑换
// #[rpc=rpcServer]
export const st_convert = (awardType:number):AwardResponse => {
    const uid = getUid();
    const awardResponse = new AwardResponse();
    const dbMgr = getEnv().getDbMgr(); 
    const bucket = new Bucket(MEMORY_NAME, ProductInfo._$info.name, dbMgr);
    const convertCfg = bucket.get<number, [ProductInfo]>(awardType)[0];
    // 从配置中获取具体兑换信息
    if (!convertCfg) {
        awardResponse.resultNum = DB_ERROR;

        return awardResponse;
    }
    const stCount = convertCfg.stCount;
    const desc = convertCfg.desc;
    // 扣除相应ST
    if (!reduce_itemCount(ST_TYPE, stCount)) {
        awardResponse.resultNum = ST_NOT_ENOUGH;
        
        return awardResponse;
    }
    // 从数据库获取兑换码
    const convertAward = get_convert(awardType);
    if (!convertAward) {
        awardResponse.resultNum = AWARD_NOT_ENOUGH;

        return awardResponse;
    }
    convertCfg.leftCount -= 1;
    convertCfg.convertCount += 1;
    bucket.put(awardType, convertCfg);
    const award = add_award(uid, awardType, convertCfg.stCount, AWARD_SRC_CONVERT, convertAward.convert, desc, convertAward.deadTime);
    if (!award) {
        awardResponse.resultNum = DB_ERROR;

        return awardResponse;
    }
    awardResponse.award = award;
    awardResponse.resultNum = RESULT_SUCCESS;
    
    return awardResponse;
};

// 获取可兑换的虚拟物品信息
export const get_convert_info = (id:number):ProductInfo => {
    const dbMgr = getEnv().getDbMgr(); 
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name, dbMgr);
    const iter = <DBIter>bucket.iter(null);
    do {
        const iterConvert = iter.nextElem();
        console.log('elCfg----------------read---------------', iterConvert);
        if (!iterConvert) {
            return;
        }
        const stConvertCfg:ProductInfo = iterConvert[1];
        if (id === stConvertCfg.id) {
            return stConvertCfg;
        }
        
    } while (iter);
   
};

// 添加商品信息
// #[rpc=rpcServer]
export const add_convert_info = (convertAwardList :ConvertAwardList): Result => {
    console.log('add_convert_info in !!!!!!!!!!!!!!!!!!!!!!!', convertAwardList);
    const result = new Result();
    const productInfoList = convertAwardList.list;
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name, dbMgr);
    for (let i = 0 ; i < productInfoList.length; i ++) {
        const pid = productInfoList[i].id;
        console.log('pid !!!!!!!!!!!!!!!!!!!!!!!', pid);
        if (bucket.get(pid)[0]) {
            result.reslutCode = PRODUCT_ALREADY_EXIST;

            return result;
        }
        productInfoList[i].leftCount = 0;
        productInfoList[i].convertCount = 0;
        bucket.put(pid, productInfoList[i]);
    }
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 修改商品信息
// #[rpc=rpcServer]
export const modify_convert_info = (product: ProductInfo): Result => {
    console.log('modify_convert_info in !!!!!!!!!!!!!!!!!!!!!!!', product);
    const result = new Result();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name, dbMgr);
    const pid = product.id;
    console.log('pid !!!!!!!!!!!!!!!!!!!!!!!', pid);
    if (!bucket.get(pid)[0]) {
        result.reslutCode = PRODUCT_NOT_EXIST;

        return result;
    }
    bucket.put(pid, product);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 添加兑换码
// #[rpc=rpcServer]
export const add_convert = (addConvertList: AddConvertList):Result => {
    console.log('add_convert in !!!!!!!!!!!!!!!!!!!!!!!', addConvertList);
    const result = new Result();
    const addList = addConvertList.list;
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, ProductInfo._$info.name, dbMgr);
    const tabBucket = new Bucket(WARE_NAME, ConvertTab._$info.name, dbMgr);
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
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, FreePlay._$info.name, dbMgr);
    
    return bucket.get<number, [FreePlay]>(uid)[0];
};

// 每日首次登陆添加一次免费初级转盘和宝箱次数
export const add_free_rotary = () => {
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, FreePlay._$info.name, dbMgr);
    const freePlay = new FreePlay();
    freePlay.uid = uid;
    freePlay.freeRotary = true;
    freePlay.freeBox = true;
    bucket.put(uid, freePlay);
};

// 从数据库获取兑换码
export const get_convert = (id: number): ConvertTab => {
    const dbMgr = getEnv().getDbMgr(); 
    const convertBucket = new Bucket(WARE_NAME, ConvertTab._$info.name, dbMgr);
    // 从数据库获取兑换码
    const iter = <DBIter>convertBucket.iter(null);
    let convertAward:ConvertTab;
    do {
        const iterConvert = iter.nextElem();
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

    return convertAward;
};