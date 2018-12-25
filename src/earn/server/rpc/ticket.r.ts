/**
 * 奖券接口
 */

import { randomInt } from '../../../pi/util/math';
import { AWARD_SRC_ROTARY, AWARD_SRC_TREASUREBOX, COMPOSE_GOLD_TICKET, COMPOSE_RAINBOW_TICKET, GOLD_HOE_TYPE, GOLD_TICKET_ROTARY, GOLD_TICKET_TREASUREBOX, GOLD_TICKET_TYPE, RAINBOW_TICKET_ROTARY, RAINBOW_TICKET_TREASUREBOX, RAINBOW_TICKET_TYPE, SILVER_TICKET_ROTARY, SILVER_TICKET_TREASUREBOX, SILVER_TICKET_TYPE, TICKET_COMPOSE_COUNT, TICKET_ROTARY_COUNT, TICKET_TREASUREBOX_COUNT } from '../data/constant';
import { Item, Ticket } from '../data/db/item.s';
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
export const ticket_rotary = (itemType:number):Item => {
    console.log('ticket_rotary!!!!!!!!!!!!!!!!!!!!', itemType);
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const tickeType = itemType;
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
            return;
    }
    console.log('pid!!!!!!!!!!!!!!!!!!!!', pid);
    if (!reduce_itemCount(itemType, TICKET_ROTARY_COUNT)) return;
    const v = [];
    doAward(pid, randomMgr, v);
    const count = v[0][1];
    const newitemType = v[0][0];

    return add_award(newitemType, count, AWARD_SRC_ROTARY);
};

// 奖券开宝箱
// #[rpc=rpcServer]
export const ticket_treasurebox = (itemType:number):Item => {
    console.log('ticket_treasurebox!!!!!!!!!!!!!!!!!!!!', itemType);
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const tickeType = itemType;
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
            return;
    }
    if (!reduce_itemCount(itemType, TICKET_TREASUREBOX_COUNT)) return;
    const v = [];
    doAward(pid, randomMgr, v);
    const count = v[0][1];
    const newitemType = v[0][0];

    return add_award(newitemType, count, AWARD_SRC_TREASUREBOX);
};