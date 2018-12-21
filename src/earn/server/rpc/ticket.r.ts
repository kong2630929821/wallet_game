/**
 * 奖券接口
 */

import { randomInt } from '../../../pi/util/math';
import { AWARD_SRC_ROTARY, AWARD_SRC_TREASUREBOX, COMPOSE_GOLD_TICKET, COMPOSE_RAINBOW_TICKET, GOLD_HOE_TYPE, GOLD_TICKET_ROTARY, GOLD_TICKET_TREASUREBOX, RAINBOW_TICKET_ROTARY, RAINBOW_TICKET_TREASUREBOX, RAINBOW_TICKET_TYPE, SILVER_TICKET_ROTARY, SILVER_TICKET_TREASUREBOX, SILVER_TICKET_TYPE, TICKET_COMPOSE_COUNT, TICKET_ROTARY_COUNT, TICKET_TREASUREBOX_COUNT } from '../data/constant';
import { Item, Ticket } from '../data/db/item.s';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, reduce_itemCount } from '../util/item_util.r';
import { get_enumType } from '../util/mining_util';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { ItemQuery } from './itemQuery.s';

// 合成奖券
// #[rpc=rpcServer]
export const ticket_compose = (itemQuery:ItemQuery):Item => {
    console.log('ticket_compose!!!!!!!!!!!!!!!!!!!!', itemQuery);
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const tickeType = itemQuery.itemType;
    let pid;
    switch (tickeType) {
        case SILVER_TICKET_TYPE:
            pid = COMPOSE_GOLD_TICKET;
            break;
        case GOLD_HOE_TYPE:
            pid = COMPOSE_RAINBOW_TICKET;
            break;
        default:
            return;
    }
    if (!reduce_itemCount(itemQuery, TICKET_COMPOSE_COUNT)) return;
    const v = [];
    doAward(pid, randomMgr, v);
    const count = v[0][1] - 1;
    console.log('count!!!!!!!!!!!!!!!!!!!!', count);
    itemQuery.itemType = v[0][0];

    return add_itemCount(itemQuery, count);
};

// 大转盘
// #[rpc=rpcServer]
export const ticket_rotary = (itemQuery:ItemQuery):Item => {
    console.log('ticket_rotary!!!!!!!!!!!!!!!!!!!!', itemQuery);
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const tickeType = itemQuery.itemType;
    let pid;
    switch (tickeType) {
        case SILVER_TICKET_TYPE:
            pid = SILVER_TICKET_ROTARY;
            break;
        case GOLD_HOE_TYPE:
            pid = GOLD_TICKET_ROTARY;
            break;
        case RAINBOW_TICKET_TYPE:
            pid = RAINBOW_TICKET_ROTARY;
        default:
            return;
    }
    if (!reduce_itemCount(itemQuery, TICKET_ROTARY_COUNT)) return;
    const v = [];
    doAward(pid, randomMgr, v);
    const count = v[0][1];
    const awardItemQuery = new ItemQuery();
    awardItemQuery.uid = itemQuery.uid;
    awardItemQuery.itemType = v[0][0];
    awardItemQuery.enumType = get_enumType(awardItemQuery.itemType);

    return add_award(awardItemQuery, count, AWARD_SRC_ROTARY);
};

// 奖券开宝箱
// #[rpc=rpcServer]
export const ticket_treasurebox = (itemQuery:ItemQuery):Item => {
    console.log('ticket_treasurebox!!!!!!!!!!!!!!!!!!!!', itemQuery);
    const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
    const tickeType = itemQuery.itemType;
    let pid;
    switch (tickeType) {
        case SILVER_TICKET_TYPE:
            pid = SILVER_TICKET_TREASUREBOX;
            break;
        case GOLD_HOE_TYPE:
            pid = GOLD_TICKET_TREASUREBOX;
            break;
        case RAINBOW_TICKET_TYPE:
            pid = RAINBOW_TICKET_TREASUREBOX;
        default:
            return;
    }
    if (!reduce_itemCount(itemQuery, TICKET_TREASUREBOX_COUNT)) return;
    const v = [];
    doAward(pid, randomMgr, v);
    const count = v[0][1];
    const awardItemQuery = new ItemQuery();
    awardItemQuery.uid = itemQuery.uid;
    awardItemQuery.itemType = v[0][0];
    awardItemQuery.enumType = get_enumType(awardItemQuery.itemType);

    return add_award(awardItemQuery, count, AWARD_SRC_TREASUREBOX);
};