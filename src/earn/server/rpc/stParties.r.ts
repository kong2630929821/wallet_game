/**
 * ST独立活动
 */

import { randomInt } from '../../../pi/util/math';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { DBIter } from '../../../pi_pt/rust/pi_serv/js_db';
import { Bucket } from '../../utils/db';
import { STConvertCfg } from '../../xlsx/awardCfg.s';
import { AWARD_SRC_CONVERT, AWARD_SRC_ROTARY, AWARD_SRC_TREASUREBOX, LEVEL1_ROTARY_AWARD, LEVEL1_ROTARY_STCOST, LEVEL1_TREASUREBOX_AWARD, LEVEL1_TREASUREBOX_STCOST, LEVEL2_ROTARY_AWARD, LEVEL2_ROTARY_STCOST, LEVEL2_TREASUREBOX_AWARD, LEVEL2_TREASUREBOX_STCOST, LEVEL3_ROTARY_AWARD, LEVEL3_ROTARY_STCOST, LEVEL3_TREASUREBOX_AWARD, LEVEL3_TREASUREBOX_STCOST, MEMORY_NAME, NO_AWARD_SORRY, RESULT_SUCCESS, ST_TYPE, ST_UNIT_NUM, ST_WALLET_TYPE, SURPRISE_BRO, WALLET_API_QUERY, WARE_NAME } from '../data/constant';
import { Award, AwardResponse, ConvertTab, FreeRotary } from '../data/db/item.s';
import { AWARD_NOT_ENOUGH, DB_ERROR, REQUEST_WALLET_FAIL, ROTARY_TYPE_ERROR, ST_NOT_ENOUGH, TREASUREBOX_TYPE_ERROR } from '../data/errorNum';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, reduce_itemCount } from '../util/item_util.r';
import { oauth_send } from '../util/oauth_lib';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { CoinQueryRes, ConvertAwardList } from './itemQuery.s';
import { getOpenid, getUid } from './user.r';

// 获取用户账户ST数量
// #[rpc=rpcServer]
export const get_STNum = (): CoinQueryRes => {
    console.log('get_ticket_KTNum!!!!!!!!!!!!!!!!!!!!');
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

// ST转盘
// #[rpc=rpcServer]
export const st_rotary = (rotaryType:number): AwardResponse => {
    const uid = getUid();
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const awardResponse = new AwardResponse();
    let stCount;
    let hasfree = false;
    switch (rotaryType) {
        case LEVEL1_ROTARY_AWARD:
            stCount = LEVEL1_ROTARY_STCOST;
            // 获取是否还有免费的初级转盘次数
            const dbMgr = getEnv().getDbMgr();
            const bucket = new Bucket(WARE_NAME, FreeRotary._$info.name, dbMgr);
            const freeRotary = bucket.get<number, [FreeRotary]>(uid)[0];
            if (!freeRotary) break;
            hasfree = freeRotary.free;
            freeRotary.free = false;
            bucket.put(uid, freeRotary);
            break;
        case LEVEL2_ROTARY_AWARD:
            stCount = LEVEL2_ROTARY_STCOST;
            break;
        case LEVEL3_ROTARY_AWARD:
            stCount = LEVEL3_ROTARY_STCOST;
            break;
        default:
            awardResponse.resultNum = ROTARY_TYPE_ERROR;

            return awardResponse;
    }
    console.log('stCount:!!!!!!!!!!!!!!!', stCount);
    // 如果有免费次数使用免费次数
    if (hasfree === true) {
        const v = [];
        doAward(rotaryType, randomMgr, v);
        const count = v[0][1];
        const newitemType = v[0][0];
        add_itemCount(uid, newitemType, count);
        const award =  add_award(uid, newitemType, count, AWARD_SRC_ROTARY);
        if (!award) {
            awardResponse.resultNum = DB_ERROR;

            return awardResponse;
        }
        awardResponse.resultNum = RESULT_SUCCESS;
        awardResponse.award = award;

        return awardResponse;
    } else if (!reduce_itemCount(ST_TYPE, stCount)) { // 没有免费次数扣除相应ST
        awardResponse.resultNum = ST_NOT_ENOUGH;

        return awardResponse;
    }
    const v = [];
    doAward(rotaryType, randomMgr, v);
    const count = v[0][1];
    const newitemType = v[0][0];
    // 没有抽中奖品
    if (newitemType === SURPRISE_BRO) {
        const time = (new Date()).valueOf().toString();
        const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_ROTARY, time);
        awardResponse.award = award;
        awardResponse.resultNum = RESULT_SUCCESS;
        console.log('awardResponse:!!!!!!!!!!!!!!!', awardResponse);

        return awardResponse;
    }
    // 判断奖品是否为虚拟兑换类奖品
    const convertInfo = get_convert_info(newitemType);
    if (!convertInfo) {
        add_itemCount(uid, newitemType, count); // 不是可兑换奖品 作为普通物品添加
        const award =  add_award(uid, newitemType, count, AWARD_SRC_ROTARY);
        if (!award) {
            awardResponse.resultNum = DB_ERROR;
    
            return awardResponse;
        }
        awardResponse.resultNum = RESULT_SUCCESS;
        awardResponse.award = award;
    } else {
        // 是可兑换奖品 添加兑换码
        const convertAward = get_convert(newitemType);
        if (!convertAward) {
            awardResponse.resultNum = AWARD_NOT_ENOUGH;

            return awardResponse;
        }
        const award =  add_award(uid, newitemType, count, AWARD_SRC_ROTARY, convertAward.convert, convertInfo.name);
        if (!award) {
            awardResponse.resultNum = DB_ERROR;
    
            return awardResponse;
        }
        awardResponse.award = award;
        awardResponse.resultNum = RESULT_SUCCESS;
    }

    return awardResponse;
};

// ST开宝箱
// #[rpc=rpcServer]
export const st_treasurebox = (treasureboxType:number): AwardResponse => {
    const uid = getUid();
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const awardResponse = new AwardResponse();
    let stCount;
    switch (treasureboxType) {
        case LEVEL1_TREASUREBOX_AWARD:
            stCount = LEVEL1_TREASUREBOX_STCOST;
            break;
        case LEVEL2_TREASUREBOX_AWARD:
            stCount = LEVEL2_TREASUREBOX_STCOST;
            break;
        case LEVEL3_TREASUREBOX_AWARD:
            stCount = LEVEL3_TREASUREBOX_STCOST;
            break;
        default:
            awardResponse.resultNum = TREASUREBOX_TYPE_ERROR;

            return awardResponse;
    }
    if (!reduce_itemCount(ST_TYPE, stCount)) {
        awardResponse.resultNum = ST_NOT_ENOUGH;

        return awardResponse;
    }
    const v = [];
    doAward(treasureboxType, randomMgr, v);
    const count = v[0][1];
    const newitemType = v[0][0];
    // 没有抽中奖品
    if (newitemType === SURPRISE_BRO) {
        const time = (new Date()).valueOf().toString();
        const award = new Award(NO_AWARD_SORRY, newitemType, 1, uid, AWARD_SRC_ROTARY, time);
        awardResponse.award = award;
        awardResponse.resultNum = RESULT_SUCCESS;

        return awardResponse;
    }
    // 判断奖品是否为虚拟兑换类奖品
    const convertInfo = get_convert_info(newitemType);
    if (!convertInfo) {
        // 不是可兑换奖品 作为普通物品添加
        add_itemCount(uid, newitemType, count);
        const award =  add_award(uid, newitemType, count, AWARD_SRC_TREASUREBOX);
        if (!award) {
            awardResponse.resultNum = DB_ERROR;
    
            return awardResponse;
        }
        awardResponse.resultNum = RESULT_SUCCESS;
        awardResponse.award = award;
    } else {
        // 是可兑换奖品 添加兑换码
        const convertAward = get_convert(newitemType);
        if (!convertAward) {
            awardResponse.resultNum = AWARD_NOT_ENOUGH;

            return awardResponse;
        }
        const award =  add_award(uid, newitemType, count, AWARD_SRC_TREASUREBOX, convertAward.convert, convertInfo.name);
        if (!award) {
            awardResponse.resultNum = DB_ERROR;
    
            return awardResponse;
        }
        awardResponse.award = award;
        awardResponse.resultNum = RESULT_SUCCESS;
    }

    return awardResponse;
};

// 查看兑换列表
// #[rpc=rpcServer]
export const get_convert_list = (): ConvertAwardList => {
    const convertAwardList = new ConvertAwardList();
    const dbMgr = getEnv().getDbMgr(); 
    const bucket = new Bucket(MEMORY_NAME, STConvertCfg._$info.name, dbMgr);
    const iter = <DBIter>bucket.iter(null);
    const list = [];
    do {
        const iterConvert = iter.nextElem();
        console.log('elCfg----------------read---------------', iterConvert);
        if (!iterConvert) {
            break;
        }
        const stConvertCfg:STConvertCfg = iterConvert[1];
        list.push(stConvertCfg);
        
    } while (iter);
    convertAwardList.list = list;
    
    return convertAwardList;
};

// ST兑换
// #[rpc=rpcServer]
export const st_convert = (awardType:number):AwardResponse => {
    const uid = getUid();
    const awardResponse = new AwardResponse();
    const dbMgr = getEnv().getDbMgr(); 
    const bucket = new Bucket(MEMORY_NAME, STConvertCfg._$info.name, dbMgr);
    const convertCfg = bucket.get<number, [STConvertCfg]>(awardType)[0];
    // 从配置中获取具体兑换信息
    if (!convertCfg) {
        awardResponse.resultNum = DB_ERROR;

        return awardResponse;
    }
    const stCount = convertCfg.count;
    const desc = convertCfg.desc;
    // 从数据库获取兑换码
    const convertAward = get_convert(awardType);
    if (!convertAward) {
        awardResponse.resultNum = AWARD_NOT_ENOUGH;

        return awardResponse;
    }
    // 扣除相应ST
    if (!reduce_itemCount(ST_TYPE, stCount)) {
        awardResponse.resultNum = ST_NOT_ENOUGH;
        
        return awardResponse;
    }
    const award = add_award(uid, awardType, convertCfg.num, AWARD_SRC_CONVERT, convertAward.convert, desc, convertAward.deadTime);
    if (!award) {
        awardResponse.resultNum = DB_ERROR;

        return awardResponse;
    }
    awardResponse.award = award;
    awardResponse.resultNum = RESULT_SUCCESS;
    
    return awardResponse;
};

// 获取可兑换的虚拟物品信息
export const get_convert_info = (id:number):STConvertCfg => {
    const dbMgr = getEnv().getDbMgr(); 
    const bucket = new Bucket(MEMORY_NAME, STConvertCfg._$info.name, dbMgr);
    const iter = <DBIter>bucket.iter(null);
    do {
        const iterConvert = iter.nextElem();
        console.log('elCfg----------------read---------------', iterConvert);
        if (!iterConvert) {
            return;
        }
        const stConvertCfg:STConvertCfg = iterConvert[1];
        if (id === stConvertCfg.id) {
            return stConvertCfg;
        }
        
    } while (iter);
   
};

// 查询是否有初级转盘免费次数
// #[rpc=rpcServer]
export const get_hasFree_rotary = ():FreeRotary => {
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, FreeRotary._$info.name, dbMgr);
    
    return bucket.get<number, [FreeRotary]>(uid)[0];
};

// 每日首次登陆添加一次免费初级转盘次数
export const add_free_rotary = () => {
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, FreeRotary._$info.name, dbMgr);
    const freeRotary = new FreeRotary();
    freeRotary.uid = uid;
    freeRotary.free = true;
    bucket.put(uid, freeRotary);
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
    // 已发出的兑换码数据库状态改为false
    convertAward.state = false;
    convertBucket.put(convertAward.id, convertAward);

    return convertAward;
};