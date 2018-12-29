/**
 * 邀请用户
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { MIN_INVITE_NUM, RESULT_SUCCESS, WALLET_API_CDKEY, WALLET_API_INVITENUM, WARE_NAME } from '../data/constant';
import { Invite } from '../data/db/invite.s';
import { InviteAwardRes } from '../data/db/item.s';
import { InviteNumTab, InviteTab, UserAcc } from '../data/db/user.s';
import { DB_ERROR, INVITE_NOT_ENOUGH } from '../data/errorNum';
import { getcdkey } from '../data/util';
import { oauth_send } from '../util/oauth_lib';
import { invite_award } from '../util/regularAward';
import { getOpenid, getUid } from './user.r';

// 获取邀请人数
// #[rpc=rpcServer]
export const get_inviteNum = (): InviteNumTab => {
    console.log('get_inviteNum in !!!!!!!!!!!!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const uid = getUid();
    // 获取openid
    const openid = Number(getOpenid());
    // 去钱包服务器获取已邀请人数
    let inviteNum = 0;
    const r = oauth_send(WALLET_API_INVITENUM, { openid: openid });
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.return_code === 1) {
            inviteNum = <number>json.num;
        }
    }

    const bucket = new Bucket(WARE_NAME, InviteNumTab._$info.name, dbMgr);
    let inviteNumTab = bucket.get<number, [InviteNumTab]>(uid)[0];
    if (!inviteNumTab) {
        inviteNumTab = new InviteNumTab();
        inviteNumTab.uid = uid;
        inviteNumTab.inviteNum = 0;
        inviteNumTab.usedNum = 0;
    }
    // 更新数据库中的邀请人数
    inviteNumTab.inviteNum = inviteNum;
    bucket.put(uid, inviteNumTab);
    
    return inviteNumTab;
};

// 获取邀请奖励
// #[rpc=rpcServer]
export const get_invite_awards = ():InviteAwardRes  => {
    console.log('get_invite_awards in !!!!!!!!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, InviteNumTab._$info.name, dbMgr);
    const inviteNumTab = get_inviteNum();
    const awardResponse = new InviteAwardRes();
    awardResponse.award = [];
    const usefulNum = inviteNumTab.inviteNum - inviteNumTab.usedNum;
    console.log('usefulNum !!!!!!!!!!!!!!!!!!!!!!!!', usefulNum);
    if (usefulNum < MIN_INVITE_NUM) {
        awardResponse.resultNum = INVITE_NOT_ENOUGH;

        return awardResponse;
    }
    
    for (let i = inviteNumTab.usedNum + 1; i < MIN_INVITE_NUM + inviteNumTab.usedNum + 1; i ++) {
        console.log('i !!!!!!!!!!!!!!!!!!!!!!!!', i);
        const award = invite_award(uid, i);
        awardResponse.award.push(award);
    }
    if (!awardResponse.award) {
        awardResponse.resultNum = DB_ERROR;
        
        return awardResponse;
    }
    // 添加已领取记录
    inviteNumTab.usedNum += MIN_INVITE_NUM;
    console.log('inviteNumTab.usedNum !!!!!!!!!!!!!!!!!!!!!!!!', inviteNumTab.usedNum);
    bucket.put(uid, inviteNumTab);
    awardResponse.resultNum = RESULT_SUCCESS;

    return awardResponse;
};

// 兑换邀请码
// export const cdkey = (code: string): Invite => {
//     const dbMgr = getEnv().getDbMgr();
//     const uid = getUid();
//     // 获取openid
//     const openid = Number(getOpenid());
//     const cdkey = getcdkey(uid, code);
//     const InviteBucket = new Bucket('file', Invite._$info.name, dbMgr);
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
//                 const bucket = new Bucket(WARE_NAME, UserAcc._$info.name, dbMgr);
//                 const iuser = bucket.get<string, [UserAcc]>(inviteOpenid)[0];
//                 let iuid; // 邀请人uid
//                 let friendsNum; // 邀请人已邀请人数
//                 if (!iuser) {
//                     iuid = -1;
//                     friendsNum = 1;
//                 } else {
//                     iuid = iuser.uid;
//                     // 获取邀请人已邀请人数
//                     const invites = get_invite_friends(iuid);
//                     invites.fuid.push(uid);
//                     friendsNum = invites.fuid.length;
//                     // 添加邀请人邀请记录
//                     const inviteBucket = new Bucket(WARE_NAME, InviteTab._$info.name, dbMgr);
//                     inviteBucket.put(iuid, invites);
//                 }
//                 invite.code = cdkey;
//                 invite.items = []; // 奖品列表
//                 const item = invite_award(iuid, friendsNum);
//                 invite.items.push(item);
//                 InviteBucket.put(cdkey, invite);

//                 return invite;
//             }
//         } else {
//             invite.code = '-1';
//             invite.items = [];

//             return invite;
//         }
//     } else {
//         invite.code = '-1';
//         invite.items = [];

//         return invite;
//     }
// };

// // 获取已邀请的好友
// export const get_invite_friends = (uid: number): InviteTab => {
//     const dbMgr = getEnv().getDbMgr();
//     const inviteBucket = new Bucket(WARE_NAME, InviteTab._$info.name, dbMgr);
//     const invites = inviteBucket.get<number, [InviteTab]>(uid)[0];
//     if (!invites) {
//         const blank = new InviteTab();
//         blank.uid = uid;
//         blank.fuid = [];

//         return blank;
//     }

//     return invites;
// };