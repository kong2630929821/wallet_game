/**
 * 奖券接口
 */

import { randomInt } from '../../../pi/util/math';
import { COMPOSE_GOLD_TICKET, COMPOSE_RAINBOW_TICKET, GOLD_HOE_TYPE, SILVER_TICKET_TYPE } from '../data/constant';
import { Item, Ticket } from '../data/db/item.s';
import { doAward } from '../util/award.t';
import { add_itemCount, reduce_itemCount } from '../util/item_util.r';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { ItemQuery } from './itemQuery.s';

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
    if (!reduce_itemCount(itemQuery, 3)) return;
    const v = [];
    doAward(pid, randomMgr, v);
    const count = v[0][1] - 1;
    console.log('count!!!!!!!!!!!!!!!!!!!!', count);
    itemQuery.itemType = v[0][0];

    return add_itemCount(itemQuery, count);
};