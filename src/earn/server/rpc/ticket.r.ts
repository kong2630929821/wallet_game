/**
 * 奖券接口
 */

import { randomInt } from '../../../pi/util/math';
import { Bucket } from '../../utils/db';
import { TicketConvertCfg } from '../../xlsx/awardCfg.s';
import { AWARD_SRC_CONVERT, AWARD_SRC_ROTARY, AWARD_SRC_TREASUREBOX, COMPOSE_GOLD_TICKET, COMPOSE_RAINBOW_TICKET, GOLD_HOE_TYPE, GOLD_TICKET_ROTARY, GOLD_TICKET_TREASUREBOX, GOLD_TICKET_TYPE, KT_TYPE, KT_UNIT_NUM, KT_WALLET_TYPE, MEMORY_NAME, RAINBOW_TICKET_ROTARY, RAINBOW_TICKET_TREASUREBOX, RAINBOW_TICKET_TYPE, RESULT_SUCCESS, SILVER_TICKET_ROTARY, SILVER_TICKET_TREASUREBOX, SILVER_TICKET_TYPE, TICKET_COMPOSE_COUNT, TICKET_ROTARY_COUNT, TICKET_TREASUREBOX_COUNT, WALLET_API_QUERY, WARE_NAME } from '../data/constant';
import { AwardResponse, ConvertTab, Item, Ticket, UsedKT } from '../data/db/item.s';
import { AWARD_NOT_ENOUGH, DB_ERROR, ITEM_NUM_ERROR, REQUEST_WALLET_FAIL, TICKET_NOT_ENOUGH, TICKET_TYPE_ERROR } from '../data/errorNum';
import { doAward } from '../util/award.t';
import { add_award, add_itemCount, reduce_itemCount } from '../util/item_util.r';
import { get_enumType } from '../util/mining_util';
import { oauth_send } from '../util/oauth_lib';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { CoinQueryRes } from './itemQuery.s';
import { getOpenid, getUid } from './user.r';

// 获取可领奖券的KT数
// #[rpc=rpcServer]
// export const get_ticket_KTNum = ():CoinQueryRes => {
//     console.log('get_ticket_KTNum!!!!!!!!!!!!!!!!!!!!');
//     const uid = getUid();
//     const kTQueryRes = new CoinQueryRes();
//     kTQueryRes.itemType = KT_TYPE;
//     let walletKT;
//     const openid = Number(getOpenid());
//     const coinType = KT_WALLET_TYPE;
//     const r = oauth_send(WALLET_API_QUERY, { openid: openid, coinType: coinType });
//     console.log('http response!!!!!!!!!!!!!!!!!!!!', r);
//     if (r.ok) {
//         const json = JSON.parse(r.ok);
//         if (json.return_code === 1) {
//             // 根据平台数据库存储的单位进行转换
//             walletKT = json.balance * KT_UNIT_NUM;
//             console.log('http success walletKT!!!!!!!!!!!!!!!!!!!!', json.balance);
//             const dbMgr = getEnv().getDbMgr();
//             const bucket = new Bucket(WARE_NAME, UsedKT._$info.name, dbMgr);
//             let usedKT = bucket.get<number, [UsedKT]>(uid)[0];
//             if (!usedKT) {
//                 const blank = new UsedKT();
//                 blank.uid = uid;
//                 blank.KTNum = 0;
//                 bucket.put(uid, blank);
//                 usedKT = blank;
//             }
//             const usefulKT = walletKT - usedKT.KTNum;
//             kTQueryRes.num = usefulKT;  
//             console.log('kTQueryRes.KTNum!!!!!!!!!!!!!!!!!!!!', kTQueryRes.num);
//         } else {
//             kTQueryRes.resultNum = REQUEST_WALLET_FAIL;
//         }
//     } else {
//         kTQueryRes.resultNum = REQUEST_WALLET_FAIL;
//     }
//     kTQueryRes.resultNum = RESULT_SUCCESS;

//     return kTQueryRes;
// };

// // 合成奖券
// // #[rpc=rpcServer]
// export const ticket_compose = (itemType:number):Item => {
//     const uid = getUid();
//     console.log('ticket_compose!!!!!!!!!!!!!!!!!!!!', itemType);
//     const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
//     const tickeType = itemType;
//     let pid;
//     switch (tickeType) {
//         case SILVER_TICKET_TYPE:
//             pid = COMPOSE_GOLD_TICKET;
//             break;
//         case GOLD_HOE_TYPE:
//             pid = COMPOSE_RAINBOW_TICKET;
//             break;
//         default:
//             return;
//     }
//     if (!reduce_itemCount(itemType, TICKET_COMPOSE_COUNT)) return;
//     const v = [];
//     doAward(pid, randomMgr, v);
//     const count = v[0][1] - 1;
//     console.log('count!!!!!!!!!!!!!!!!!!!!', count);
//     const newitemType = v[0][0];

//     return add_itemCount(uid, newitemType, count);
// };

// // 大转盘
// // #[rpc=rpcServer]
// export const ticket_rotary = (itemType:number):AwardResponse => {
//     console.log('ticket_rotary!!!!!!!!!!!!!!!!!!!!', itemType);
//     const uid = getUid();
//     const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
//     const tickeType = itemType;
//     const awardResponse = new AwardResponse();
//     let pid;
//     switch (tickeType) {
//         case SILVER_TICKET_TYPE:
//             pid = SILVER_TICKET_ROTARY;
//             break;
//         case GOLD_TICKET_TYPE:
//             pid = GOLD_TICKET_ROTARY;
//             break;
//         case RAINBOW_TICKET_TYPE:
//             pid = RAINBOW_TICKET_ROTARY;
//             break;
//         default:
//             awardResponse.resultNum = TICKET_TYPE_ERROR;

//             return awardResponse;
//     }
//     console.log('pid!!!!!!!!!!!!!!!!!!!!', pid);
//     if (!reduce_itemCount(itemType, TICKET_ROTARY_COUNT)) {
//         awardResponse.resultNum = TICKET_NOT_ENOUGH;

//         return awardResponse;
//     }
//     const v = [];
//     doAward(pid, randomMgr, v);
//     const count = v[0][1];
//     const newitemType = v[0][0];
//     add_itemCount(uid, newitemType, count);
//     const award =  add_award(uid, newitemType, count, AWARD_SRC_ROTARY);
//     if (!award) {
//         awardResponse.resultNum = DB_ERROR;

//         return awardResponse;
//     }
//     awardResponse.resultNum = RESULT_SUCCESS;
//     awardResponse.award = award;

//     return awardResponse;
// };

// // 奖券开宝箱
// // #[rpc=rpcServer]
// export const ticket_treasurebox = (itemType:number):AwardResponse => {
//     console.log('ticket_treasurebox!!!!!!!!!!!!!!!!!!!!', itemType);
//     const uid = getUid();
//     const randomMgr = new RandomSeedMgr(randomInt(1, 10000));
//     const tickeType = itemType;
//     const awardResponse = new AwardResponse();
//     let pid;
//     switch (tickeType) {
//         case SILVER_TICKET_TYPE:
//             pid = SILVER_TICKET_TREASUREBOX;
//             break;
//         case GOLD_TICKET_TYPE:
//             pid = GOLD_TICKET_TREASUREBOX;
//             break;
//         case RAINBOW_TICKET_TYPE:
//             pid = RAINBOW_TICKET_TREASUREBOX;
//             break;
//         default:
//             awardResponse.resultNum = TICKET_TYPE_ERROR;

//             return awardResponse;
//     }
//     console.log('pid!!!!!!!!!!!!!!!!!!!!', pid);
//     if (!reduce_itemCount(itemType, TICKET_ROTARY_COUNT)) {
//         awardResponse.resultNum = TICKET_NOT_ENOUGH;

//         return awardResponse;
//     }
//     const v = [];
//     doAward(pid, randomMgr, v);
//     const count = v[0][1];
//     const newitemType = v[0][0];
//     add_itemCount(uid, newitemType, count);
//     const award = add_award(uid, newitemType, count, AWARD_SRC_TREASUREBOX);
//     if (!award) {
//         awardResponse.resultNum = DB_ERROR;

//         return awardResponse;
//     }
//     awardResponse.resultNum = RESULT_SUCCESS;
//     awardResponse.award = award;

//     return awardResponse;
// };

// // 奖券兑换
// // #[rpc=rpcServer]
// export const ticket_convert = (awardType:number):AwardResponse => {
//     const uid = getUid();
//     const awardResponse = new AwardResponse();
//     const dbMgr = getEnv().getDbMgr(); 
//     const bucket = new Bucket(MEMORY_NAME, TicketConvertCfg._$info.name, dbMgr);
//     const convertCfg = bucket.get<number, [TicketConvertCfg]>(awardType)[0];
//     // 从配置中获取具体兑换信息
//     if (!convertCfg) {
//         awardResponse.resultNum = DB_ERROR;

//         return awardResponse;
//     }
//     const silverTicketCount = convertCfg.count[0];
//     const goldTicketCount = convertCfg.count[1];
//     const rainbowTicketCount = convertCfg.count[2];
//     const desc = convertCfg.desc;
//     if (silverTicketCount !== 0) {
//         if (!reduce_itemCount(SILVER_TICKET_TYPE, silverTicketCount)) {
//             awardResponse.resultNum = TICKET_NOT_ENOUGH;
            
//             return awardResponse;
//         }
//     }
//     if (goldTicketCount !== 0) {
//         if (!reduce_itemCount(GOLD_TICKET_TYPE, goldTicketCount)) {
//             awardResponse.resultNum = TICKET_NOT_ENOUGH;
            
//             return awardResponse;
//         }
//     }
//     if (rainbowTicketCount !== 0) {
//         if (!reduce_itemCount(RAINBOW_TICKET_TYPE, rainbowTicketCount)) {
//             awardResponse.resultNum = TICKET_NOT_ENOUGH;
            
//             return awardResponse;
//         }
//     }
//     const convertBucket = new Bucket(WARE_NAME, ConvertTab._$info.name, dbMgr);
//     // 从数据库获取兑换码
//     const iter = <DBIter>convertBucket.iter(null);
//     let convertAward:ConvertTab;
//     do {
//         const iterConvert = iter.nextElem();
//         console.log('elCfg----------------read---------------', iterConvert);
//         if (!iterConvert) {
//             awardResponse.resultNum = AWARD_NOT_ENOUGH;

//             return awardResponse;
//         }
//         const convertTab:ConvertTab = iterConvert[1];
//         if ((convertTab.typeNum === awardType) && (convertTab.state === true)) {
//             convertAward = convertTab;
//             break;
//         }
//     } while (iter);
//     const award = add_award(uid, awardType, convertCfg.num, AWARD_SRC_CONVERT, convertAward.convert, desc);
//     if (!award) {
//         awardResponse.resultNum = DB_ERROR;

//         return awardResponse;
//     }
//     // 已发出的兑换码数据库状态改为false
//     convertAward.state = false;
//     convertBucket.put(convertAward.id, convertAward);
//     awardResponse.award = award;
//     awardResponse.resultNum = RESULT_SUCCESS;
    
//     return awardResponse;
// };