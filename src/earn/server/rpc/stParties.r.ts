/**
 * ST独立活动
 */

import { randomInt } from '../../../pi/util/math';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { AWARD_SRC_ROTARY, GOLD_TICKET_ROTARY, LEVEL1_ROTARY_STCOST, LEVEL2_ROTARY_STCOST, LEVEL3_ROTARY_STCOST, RAINBOW_TICKET_ROTARY, RESULT_SUCCESS, SILVER_TICKET_ROTARY, ST_TYPE, ST_UNIT_NUM, ST_WALLET_TYPE, WALLET_API_QUERY, WARE_NAME } from '../data/constant';
import { AwardResponse, FreeRotary } from '../data/db/item.s';
import { DB_ERROR, REQUEST_WALLET_FAIL, ROTARY_TYPE_ERROR, ST_NOT_ENOUGH } from '../data/errorNum';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, reduce_itemCount } from '../util/item_util.r';
import { oauth_send } from '../util/oauth_lib';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { CoinQueryRes } from './itemQuery.s';
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
            const walletST = json.balance * ST_UNIT_NUM;
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
        case SILVER_TICKET_ROTARY:
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
        case GOLD_TICKET_ROTARY:
            stCount = LEVEL2_ROTARY_STCOST;
            break;
        case RAINBOW_TICKET_ROTARY:
            stCount = LEVEL3_ROTARY_STCOST;
            break;
        default:
            awardResponse.resultNum = ROTARY_TYPE_ERROR;

            return awardResponse;
    }
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
    } else if (!reduce_itemCount(ST_TYPE, stCount)) { // 扣除相应ST
        awardResponse.resultNum = ST_NOT_ENOUGH;

        return awardResponse;
    }
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
};

// ST开宝箱
// #[rpc=rpcServer]
export const st_treasurebox = (treasureboxType:number): AwardResponse => {
    const uid = getUid();
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const awardResponse = new AwardResponse();
    if (!reduce_itemCount(ST_TYPE, LEVEL1_ROTARY_STCOST)) {
        awardResponse.resultNum = ST_NOT_ENOUGH;

        return awardResponse;
    }
    const v = [];
    doAward(treasureboxType, randomMgr, v);
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