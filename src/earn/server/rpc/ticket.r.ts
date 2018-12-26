/**
 * 奖券接口
 */

import { randomInt } from '../../../pi/util/math';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { DBIter } from '../../../pi_pt/rust/pi_serv/js_db';
import { Bucket } from '../../utils/db';
import { TicketConvertCfg } from '../../xlsx/awardCfg.s';
import { AWARD_SRC_CONVERT, AWARD_SRC_ROTARY, AWARD_SRC_TREASUREBOX, COMPOSE_GOLD_TICKET, COMPOSE_RAINBOW_TICKET, GOLD_HOE_TYPE, GOLD_TICKET_ROTARY, GOLD_TICKET_TREASUREBOX, GOLD_TICKET_TYPE, MEMORY_NAME, RAINBOW_TICKET_ROTARY, RAINBOW_TICKET_TREASUREBOX, RAINBOW_TICKET_TYPE, RESULT_SUCCESS, SILVER_TICKET_ROTARY, SILVER_TICKET_TREASUREBOX, SILVER_TICKET_TYPE, TICKET_COMPOSE_COUNT, TICKET_ROTARY_COUNT, TICKET_TREASUREBOX_COUNT, WARE_NAME } from '../data/constant';
import { AwardResponse, ConvertTab, Item, Ticket } from '../data/db/item.s';
import { AWARD_NOT_ENOUGH, DB_ERROR, ITEM_NUM_ERROR, TICKET_NOT_ENOUGH, TICKET_TYPE_ERROR } from '../data/errorNum';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, reduce_itemCount } from '../util/item_util.r';
import { get_enumType } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';

// 合成奖券
// #[rpc=rpcServer]
export const ticket_compose = (itemType:number):Item => {
    console.log('ticket_compose!!!!!!!!!!!!!!!!!!!!', itemType);
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const tickeType = itemType;
    let pid;
    switch (tickeType) {
        case SILVER_TICKET_TYPE:
            pid = COMPOSE_GOLD_TICKET;
            break;
        case GOLD_TICKET_TYPE:
            pid = COMPOSE_RAINBOW_TICKET;
            break;
        default:
            return;
    }
    if (!reduce_itemCount(itemType, TICKET_COMPOSE_COUNT)) return;
    const v = [];
    doAward(pid, randomMgr, v);
    const count = v[0][1] - 1;
    console.log('count!!!!!!!!!!!!!!!!!!!!', count);
    const newitemType = v[0][0];

    return add_itemCount(newitemType, count);
};

// 大转盘
// #[rpc=rpcServer]
export const ticket_rotary = (itemType:number):AwardResponse => {
    console.log('ticket_rotary!!!!!!!!!!!!!!!!!!!!', itemType);
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const tickeType = itemType;
    const awardResponse = new AwardResponse();
    let pid;
    switch (tickeType) {
        case SILVER_TICKET_TYPE:
            pid = SILVER_TICKET_ROTARY;
            break;
        case GOLD_TICKET_TYPE:
            pid = GOLD_TICKET_ROTARY;
            break;
        case RAINBOW_TICKET_TYPE:
            pid = RAINBOW_TICKET_ROTARY;
            break;
        default:
            awardResponse.resultNum = TICKET_TYPE_ERROR;

            return awardResponse;
    }
    console.log('pid!!!!!!!!!!!!!!!!!!!!', pid);
    if (!reduce_itemCount(itemType, TICKET_ROTARY_COUNT)) {
        awardResponse.resultNum = TICKET_NOT_ENOUGH;

        return awardResponse;
    }
    const v = [];
    doAward(pid, randomMgr, v);
    const count = v[0][1];
    const newitemType = v[0][0];
    add_itemCount(newitemType, count);
    const award =  add_award(newitemType, count, AWARD_SRC_ROTARY);
    if (!award) {
        awardResponse.resultNum = DB_ERROR;

        return awardResponse;
    }
    awardResponse.resultNum = RESULT_SUCCESS;
    awardResponse.award = award;

    return awardResponse;
};

// 奖券开宝箱
// #[rpc=rpcServer]
export const ticket_treasurebox = (itemType:number):AwardResponse => {
    console.log('ticket_treasurebox!!!!!!!!!!!!!!!!!!!!', itemType);
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const tickeType = itemType;
    const awardResponse = new AwardResponse();
    let pid;
    switch (tickeType) {
        case SILVER_TICKET_TYPE:
            pid = SILVER_TICKET_TREASUREBOX;
            break;
        case GOLD_TICKET_TYPE:
            pid = GOLD_TICKET_TREASUREBOX;
            break;
        case RAINBOW_TICKET_TYPE:
            pid = RAINBOW_TICKET_TREASUREBOX;
            break;
        default:
            awardResponse.resultNum = TICKET_TYPE_ERROR;

            return awardResponse;
    }
    console.log('pid!!!!!!!!!!!!!!!!!!!!', pid);
    if (!reduce_itemCount(itemType, TICKET_ROTARY_COUNT)) {
        awardResponse.resultNum = TICKET_NOT_ENOUGH;

        return awardResponse;
    }
    const v = [];
    doAward(pid, randomMgr, v);
    const count = v[0][1];
    const newitemType = v[0][0];
    add_itemCount(newitemType, count);
    const award = add_award(newitemType, count, AWARD_SRC_TREASUREBOX);
    if (!award) {
        awardResponse.resultNum = DB_ERROR;

        return awardResponse;
    }
    awardResponse.resultNum = RESULT_SUCCESS;
    awardResponse.award = award;

    return awardResponse;
};

// 奖券兑换
// #[rpc=rpcServer]
export const ticket_convert = (awardType:number):AwardResponse => {
    const awardResponse = new AwardResponse();
    const dbMgr = getEnv().getDbMgr(); 
    const bucket = new Bucket(MEMORY_NAME, TicketConvertCfg._$info.name, dbMgr);
    const convertCfg = bucket.get<number, [TicketConvertCfg]>(awardType)[0];
    // 从配置中获取具体兑换信息
    if (!convertCfg) {
        awardResponse.resultNum = DB_ERROR;

        return awardResponse;
    }
    const silverTicketCount = convertCfg.count[0];
    const goldTicketCount = convertCfg.count[1];
    const rainbowTicketCount = convertCfg.count[2];
    const desc = convertCfg.desc;
    if (silverTicketCount !== 0) {
        if (!reduce_itemCount(SILVER_TICKET_TYPE, silverTicketCount)) {
            awardResponse.resultNum = TICKET_NOT_ENOUGH;
            
            return awardResponse;
        }
    }
    if (goldTicketCount !== 0) {
        if (!reduce_itemCount(GOLD_TICKET_TYPE, goldTicketCount)) {
            awardResponse.resultNum = TICKET_NOT_ENOUGH;
            
            return awardResponse;
        }
    }
    if (rainbowTicketCount !== 0) {
        if (!reduce_itemCount(RAINBOW_TICKET_TYPE, rainbowTicketCount)) {
            awardResponse.resultNum = TICKET_NOT_ENOUGH;
            
            return awardResponse;
        }
    }
    const convertBucket = new Bucket(WARE_NAME, ConvertTab._$info.name, dbMgr);
    // 从数据库获取兑换码
    const iter = <DBIter>convertBucket.iter(null);
    let convertAward:ConvertTab;
    do {
        const iterConvert = iter.nextElem();
        console.log('elCfg----------------read---------------', iterConvert);
        if (!iterConvert) {
            awardResponse.resultNum = AWARD_NOT_ENOUGH;

            return awardResponse;
        }
        const convertTab:ConvertTab = iterConvert[1];
        if ((convertTab.typeNum === awardType) && (convertTab.state === true)) {
            convertAward = convertTab;
            break;
        }
    } while (iter);
    const award = add_award(awardType, convertCfg.num, AWARD_SRC_CONVERT, convertAward.convert, desc);
    if (!award) {
        awardResponse.resultNum = DB_ERROR;

        return awardResponse;
    }
    // 已发出的兑换码数据库状态改为false
    convertAward.state = false;
    convertBucket.put(convertAward.id, convertAward);
    awardResponse.award = award;
    awardResponse.resultNum = RESULT_SUCCESS;
    
    return awardResponse;
};