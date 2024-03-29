/**
 * 日常奖励
 */

import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../utils/db';
import { InviteAwardCfg, RegularAwardCfg, SeriesLoginAwardCfg } from '../../xlsx/awardCfg.s';
import { AWARD_SRC_INVITE, AWARD_SRC_LOGIN, FIRST_LOGIN_AWARD, INVITE_AWARD_CIRCLE, INVITE_AWARD_CIRCLE_LENGTH, INVITE_AWARD_CIRCLE_LEVEL1, INVITE_AWARD_CIRCLE_LEVEL2, INVITE_AWARD_CIRCLE_LEVEL3, MAX_ONEDAY_MINING, MEMORY_NAME, MESSAGE_TYPE_DAILY_FIREST_LOGIN, SERIES_LOGIN_CIRCLE, WARE_NAME } from '../data/constant';
import { Award, Item, Items, Mine } from '../data/db/item.s';
import { DayliLogin, DayliLoginKey } from '../data/db/user.s';
import { getUid } from '../rpc/user.r';
import { add_mine } from '../rpc/user_item.r';
import { add_award, add_itemCount, get_mine_total, get_today } from './item_util.r';
import { send } from './sendMessage';

// 首次登陆奖励
export const firstLogin_award = ():Items => {
    console.log('firstLogin_award in !!!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    const cfgBucket = new Bucket(MEMORY_NAME, RegularAwardCfg._$info.name);
    const cfgs:RegularAwardCfg[] = [];
    const items:Item[] = [];
    const iter = cfgBucket.iter(FIRST_LOGIN_AWARD);
    let maxCount = 0;
    do {
        const iterEle = iter.next();
        if (!iterEle) return;
        console.log('elCfg----------------read---------------', iterEle);
        const regularCfg:RegularAwardCfg = iterEle[1];
        if (maxCount <= 0) maxCount = regularCfg.count;
        cfgs.push(regularCfg);
        maxCount --;
    } while (maxCount > 0);
    for (const cfg of cfgs) {
        const item = add_itemCount(uid, cfg.prop, cfg.num);
        add_award(uid, cfg.prop, cfg.num, AWARD_SRC_LOGIN, null, cfg.desc);
        items.push(item);
    }
    const awards = new Items();
    awards.item = items;
    awards.uid = uid;
    
    return awards;
};

// 连续登陆奖励
export const seriesLogin_award = (days:number):Item => {
    console.log('--------------seriesLogin_award in-----------------');
    const uid = getUid();
    const date = get_today();
    const dayliLoginKey = new DayliLoginKey();
    dayliLoginKey.uid = uid;
    dayliLoginKey.date = date;
    const dayliLoginBucket = new Bucket(WARE_NAME, DayliLogin._$info.name);
    const dayliLogin = dayliLoginBucket.get<DayliLoginKey, [DayliLogin]>(dayliLoginKey)[0];
    // 如果当天登陆记录不存在或者状态不为true，则不发放登陆奖励
    if (!dayliLogin || (dayliLogin.state !== true)) return;
    const cfgBucket = new Bucket(MEMORY_NAME, SeriesLoginAwardCfg._$info.name);
    let id;
    if (days <= SERIES_LOGIN_CIRCLE) {
        id = days;
    } else {
        id = days % SERIES_LOGIN_CIRCLE;
    }
    const awardCfg = cfgBucket.get<number, [SeriesLoginAwardCfg]>(id)[0];
    if (!awardCfg) return;

    const item = add_itemCount(uid, awardCfg.prop, awardCfg.num);
    add_award(uid, awardCfg.prop, awardCfg.num, AWARD_SRC_LOGIN, null, awardCfg.desc);
    // 发放奖励成功 将当天登陆记录的状态改为false
    dayliLogin.state = false;
    dayliLoginBucket.put(dayliLoginKey, dayliLogin);

    return item;
};

/**
 * 添加邀请奖励
 * @param uid 邀请人uid
 * @param num 被邀请的人数
 */
export const invite_award = (uid:number, num:number):Award => {
    console.log('invite_award in !!!!!!!!!!!!!!!!!!!!!!!!');
    const cfgBucket = new Bucket(MEMORY_NAME, InviteAwardCfg._$info.name);
    let id;
    if (num <= INVITE_AWARD_CIRCLE) {
        id = num;
    } else {
        const r = (num - INVITE_AWARD_CIRCLE) % INVITE_AWARD_CIRCLE_LENGTH;
        switch (r) {
            case 1:
                id = INVITE_AWARD_CIRCLE_LEVEL1;
                break;
            case 2:
                id = INVITE_AWARD_CIRCLE_LEVEL2;
                break;
            case 0:
                id = INVITE_AWARD_CIRCLE_LEVEL3;
                break;
            default:
                return;
        }
    }
    const awardCfg = cfgBucket.get<number, [InviteAwardCfg]>(id)[0];
    if (!awardCfg) return;
    // 发放奖励给邀请人
    add_itemCount(uid, awardCfg.prop, awardCfg.num);

    return add_award(uid, awardCfg.prop, awardCfg.num, AWARD_SRC_INVITE, null, awardCfg.desc);
};

// 登陆赠送矿山
export const login_add_mine = ():Mine => {
    if (get_mine_total() < MAX_ONEDAY_MINING) {
        return add_mine();
    }

    return;
};
// export const invite_award = (iuid:number, num:number):Item => {
//     const uid = getUid();
//     const dbMgr = getEnv().getDbMgr();
//     const cfgBucket = new Bucket(MEMORY_NAME, InviteAwardCfg._$info.name, dbMgr);
//     let id;
//     if (num <= INVITE_AWARD_CIRCLE) {
//         id = num;
//     } else {
//         const r = (num - INVITE_AWARD_CIRCLE) % INVITE_AWARD_CIRCLE_LENGTH;
//         switch (r) {
//             case 1:
//                 id = INVITE_AWARD_CIRCLE_LEVEL1;
//                 break;
//             case 2:
//                 id = INVITE_AWARD_CIRCLE_LEVEL2;
//                 break;
//             case 0:
//                 id = INVITE_AWARD_CIRCLE_LEVEL3;
//                 break;
//             default:
//                 return;
//         }
//     }
//     const awardCfg = cfgBucket.get<number, [InviteAwardCfg]>(id)[0];
//     if (!awardCfg) return;
//     // 发放奖励给被邀请人
//     const item = add_itemCount(uid, awardCfg.prop, awardCfg.num);
//     add_award(uid, awardCfg.prop, awardCfg.num, AWARD_SRC_INVITE, null, awardCfg.desc);
//     // 邀请人未登陆过平台 则不予发放平台奖励给邀请人
//     if (iuid === -1) return item;
//     add_itemCount(iuid, awardCfg.prop, awardCfg.num);
//     add_award(iuid, awardCfg.prop, awardCfg.num, AWARD_SRC_INVITE, null, awardCfg.desc);

//     return item;
// };

// // 登陆赠送矿山
// export const login_add_mine = ():Mine => {
//     if (get_mine_total() < MAX_ONEDAY_MINING) {
//         return add_mine();
//     }

//     return;
// };