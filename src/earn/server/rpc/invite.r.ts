/**
 * 邀请用户
 */
import { Bucket } from '../../utils/db';
import { AWARD_INVITE, INVITE_AWARD_CIRCLE_LEVEL2, MIN_INVITE_NUM, RESULT_SUCCESS, WALLET_API_CDKEY, WALLET_API_INVITENUM, WALLET_API_INVITENUM_REAL, WARE_NAME } from '../data/constant';
import { Result } from '../data/db/guessing.s';
import { Invite, InviteInfo, InviteKey } from '../data/db/invite.s';
import { InviteAwardRes } from '../data/db/item.s';
import { InviteNumTab, InviteTab, UserAcc, UserAccMap } from '../data/db/user.s';
import { DB_ERROR, INVITE_AWARD_ALREADY_TAKEN, INVITE_CONVERT_REPEAT, INVITE_COUNT_ERROR, INVITE_NOT_ENOUGH, NOT_LOGIN, REQUEST_WALLET_FAIL } from '../data/errorNum';
import { oauth_send } from '../util/oauth_lib';
import { invite_award } from '../util/regularAward';
import { getOpenid, getUid } from './user.r';

// 获取邀请人数(真实用户)
// #[rpc=rpcServer]
export const get_inviteNum = (): InviteNumTab => {
    console.log('get_inviteNum in !!!!!!!!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    if (!uid) return;
    // 获取openid
    const openid = Number(getOpenid());
    // 去钱包服务器获取已邀请人数
    let inviteNum = 0;
    console.log('get_inviteNum 222222222222');
    const r = oauth_send(WALLET_API_INVITENUM_REAL, { openid: openid });
    console.log('get_inviteNum 3333333333333333', r);
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.return_code === 1) {
            inviteNum = <number>json.num;
        }
    }

    const bucket = new Bucket(WARE_NAME, InviteNumTab._$info.name);
    let inviteNumInfo = bucket.get<number, [InviteNumTab]>(uid)[0];
    if (!inviteNumInfo) {
        inviteNumInfo = new InviteNumTab();
        inviteNumInfo.uid = uid;
        inviteNumInfo.inviteNum = 0;
        inviteNumInfo.usedNum = [];
    }

    console.log('get_inviteNum 444444444444444');
    // 更新数据库中的邀请人数
    const length = inviteNumInfo.usedNum.length; // 可领取邀请奖励宝箱的个数
    if (length < inviteNum) {
        for (let i = 0; i < inviteNum - length; i ++) {
            inviteNumInfo.usedNum.push(1);
            continue;
        }
    }
    inviteNumInfo.inviteNum = inviteNum;
    bucket.put(uid, inviteNumInfo);
    console.log('!!!!!!!!!!!!!!!!!!!!invite:', inviteNumInfo);
    
    return inviteNumInfo;
};

// 获取邀请奖励
// index为邀请的人数
// #[rpc=rpcServer]
export const get_invite_awards = (index:number):InviteAwardRes  => {
    console.log('get_invite_awards in !!!!!!!!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    if (!uid) return;
    const bucket = new Bucket(WARE_NAME, InviteNumTab._$info.name);
    const inviteNumTab = get_inviteNum();
    const awardResponse = new InviteAwardRes();
    awardResponse.award = [];
    console.log('get_invite_awards in !!!!!!!!!!!!!!!!!!!!!!!!', inviteNumTab);
    // 验证邀请好友数量是否正确
    if (inviteNumTab.inviteNum < index) {
        awardResponse.resultNum = INVITE_COUNT_ERROR;

        return awardResponse;
    }
    // 判断奖励是否存在
    if (!inviteNumTab.usedNum[index - 1]) {
        awardResponse.resultNum = INVITE_NOT_ENOUGH;

        return awardResponse;
    }
    if (inviteNumTab.usedNum[index - 1] === 0) {
        awardResponse.resultNum = INVITE_AWARD_ALREADY_TAKEN;

        return awardResponse;
    }
    const award = invite_award(uid, index);
    console.log('get_invite_awards in !!!!!!!!!!!!!!!!!!!!!!!!award:', award);
    awardResponse.award.push(award);
    if (!awardResponse.award) {
        awardResponse.resultNum = DB_ERROR;
        
        return awardResponse;
    }
    // 添加已领取记录
    inviteNumTab.usedNum[index - 1] = 0;
    console.log('inviteNumTab.usedNum !!!!!!!!!!!!!!!!!!!!!!!!', inviteNumTab.usedNum);
    bucket.put(uid, inviteNumTab);
    awardResponse.resultNum = RESULT_SUCCESS;
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!awardResponse:', awardResponse);

    return awardResponse;
};

// 获取兑换奖励
// 兑换奖励固定获取一把银锄头(奖励配置中的ID=17)
// #[rpc=rpcServer]
export const getInviteAward = (code: string): InviteAwardRes => {
    const result = new InviteAwardRes();
    const uid = getUid();
    if (!uid) {
        result.resultNum = NOT_LOGIN;

        return result;
    }
    // 判断是否第一次兑换
    const inviteInfoBucket = new Bucket('file', InviteInfo._$info.name);
    const inviteKey = new InviteKey();
    inviteKey.uid = uid;
    inviteKey.invite_type = AWARD_INVITE;
    const awards = inviteInfoBucket.get(inviteKey)[0];
    if (awards) {
        result.resultNum = INVITE_CONVERT_REPEAT;

        return result;
    }
    // 发放奖励(由于限制只兑换一次，并且奖励也不大，所以不去验证兑换码)
    const item = invite_award(uid, INVITE_AWARD_CIRCLE_LEVEL2);
    // 记录已兑换奖励
    const inviteInfov = new InviteInfo();
    inviteInfov.invite = inviteKey;
    inviteInfov.items = [item];
    inviteInfoBucket.put(inviteKey, inviteInfov);
    result.award = [item];
    result.resultNum = RESULT_SUCCESS;
    console.log('!!!!!!!!!!invite_result:', result);

    return result;
};

// 兑换邀请码
// #[rpc=rpcServer]
// export const cdkey = (code: string): Result => {
//     const result = new Result();
//     const uid = getUid();
//     if (!uid) {
//         result.reslutCode = NOT_LOGIN;

//         return result;
//     }
//     // 获取openid
//     const openid = Number(getOpenid());
//     const cdkey = getcdkey(uid, code);
//     const InviteBucket = new Bucket('file', Invite._$info.name);
//     const v = InviteBucket.get(cdkey)[0];
//     const invite = new Invite();
//     if (!v) {
//         // 去钱包服务器兑换邀请码
//         const r = oauth_send(WALLET_API_CDKEY, { openid: openid, code: code });
//         if (r.ok) {
//             const json = JSON.parse(r.ok);
//             if (json.return_code === 1) {
//                 // 增加邀请奖励
//                 const inviteOpenid = <string>json.openid; // 邀请人openid
//                 // 获取邀请人uid
//                 const bucket = new Bucket(WARE_NAME, UserAcc._$info.name);
//                 const iuser = bucket.get<string, [UserAcc]>(inviteOpenid)[0];
//                 let iuid; // 邀请人uid
//                 let friendsNum; // 邀请人已邀请人数
//                 if (!iuser) {
//                     iuid = -1;
//                     friendsNum = 1;
//                 } else {
//                     iuid = iuser.uid;
//                     // 获取邀请人已邀请人数
//                     const invites = get_invite_friends(inviteOpenid, iuid);
//                     console.log('----------------inviteNum--------------', invites.inviteNum);
//                     invites.inviteNum += 1;
//                     friendsNum = invites.inviteNum;
//                     // 添加邀请人邀请记录
//                     const inviteBucket = new Bucket(WARE_NAME, InviteNumTab._$info.name);
//                     inviteBucket.put(iuid, invites);
//                 }
//                 invite.code = cdkey;
//                 invite.items = []; // 奖品列表
//                 const item = invite_award(iuid, friendsNum);
//                 invite.items.push(item);
//                 InviteBucket.put(cdkey, invite);
//                 result.msg = JSON.stringify(invite);
//                 result.reslutCode = RESULT_SUCCESS;

//                 return result;
//             } else {
//                 result.reslutCode = json.return_code;

//                 return result;
//             }
//         } else {
//             result.reslutCode = REQUEST_WALLET_FAIL;

//             return result;
//         }
//     } else {
//         result.reslutCode = INVITE_CONVERT_REPEAT;

//         return result;
//     }
// };

// // 获取已邀请的好友
// export const get_invite_friends = (openid: string, uid: number): InviteNumTab => {
//     // 去钱包服务器获取已邀请人数
//     let inviteNum = 0;
//     const r = oauth_send(WALLET_API_INVITENUM, { openid: openid });
//     if (r.ok) {
//         const json = JSON.parse(r.ok);
//         if (json.return_code === 1) {
//             inviteNum = <number>json.num;
//         }
//     }
//     const bucket = new Bucket(WARE_NAME, InviteNumTab._$info.name);
//     let inviteNumTab = bucket.get<number, [InviteNumTab]>(uid)[0];
//     if (!inviteNumTab) {
//         inviteNumTab = new InviteNumTab();
//         inviteNumTab.uid = uid;
//         inviteNumTab.inviteNum = 0;
//         inviteNumTab.usedNum = [];
//     }
//     // 更新数据库中的邀请人数
//     const length = inviteNumTab.usedNum.length; // 可领取邀请奖励宝箱的个数
//     const awardCount = Math.floor(inviteNum / MIN_INVITE_NUM);  // 每三个邀请人数添加一个可领取宝箱
//     console.log('awardCount!!!!!!!!!!!!!!!!!!!!!!!!', awardCount);
//     if (length < awardCount) {
//         for (let i = 0; i < awardCount - length; i ++) {
//             inviteNumTab.usedNum.push(1);
//             continue;
//         }
//     }
//     inviteNumTab.inviteNum = inviteNum;
//     bucket.put(uid, inviteNumTab);
    
//     return inviteNumTab;
// };