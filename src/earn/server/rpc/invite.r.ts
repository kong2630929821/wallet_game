/**
 * 邀请用户
 */
import { randomInt } from '../../../pi/util/math';
import { Bucket } from '../../utils/db';
import { AWARD_INVITE, CODE_MAX_CONFLICTS, CODE_START_LENGTH, INVITE_AWARD_CIRCLE_LEVEL2, MESSAGE_TYPE_CONVERT_INVITE_CODE, MESSAGE_TYPE_INVITE, RESULT_SUCCESS, WALLET_API_INVITENUM_REAL, WARE_NAME } from '../data/constant';
import { Result } from '../data/db/guessing.s';
import { InviteCodeTab, InviteInfo, InviteKey, UserInviteTab } from '../data/db/invite.s';
import { InviteAwardRes } from '../data/db/item.s';
import { InviteNumTab, InviteTab, UserAcc, UserAccMap } from '../data/db/user.s';
import { CANT_INVITE_SELF, DB_ERROR, INVITE_AWARD_ALREADY_TAKEN, INVITE_CODE_ERROR, INVITE_CONVERT_REPEAT, INVITE_COUNT_ERROR, INVITE_NOT_ENOUGH, NOT_LOGIN } from '../data/errorNum';
import { oauth_send } from '../util/oauth_lib';
import { invite_award } from '../util/regularAward';
import { send } from '../util/sendMessage';
import { get_userInfo, getOpenid, getUid } from './user.r';

// 生成邀请码
// #[rpc=rpcServer]
export const getInviteCode = (): Result => {
    const result = new Result();
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    const userInviteBucket = new Bucket(WARE_NAME, UserInviteTab._$info.name);
    let userInvite = userInviteBucket.get<number, UserInviteTab[]>(uid)[0];
    if (!userInvite) {
        userInvite = new UserInviteTab();
        userInvite.uid = uid;
        userInvite.code = createCid(CODE_MAX_CONFLICTS, CODE_START_LENGTH);
        userInvite.inviter = 0;
        userInvite.invited_time = '0';
        userInvite.invite_list = [];
    }
    userInviteBucket.put(uid, userInvite);
    const inviteCodeBucket = new Bucket(WARE_NAME, InviteCodeTab._$info.name);
    const inviteCode = new InviteCodeTab();
    inviteCode.code = userInvite.code;
    inviteCode.uid = uid;
    inviteCodeBucket.put(inviteCode.code, inviteCode);
    result.reslutCode = RESULT_SUCCESS;
    result.msg = userInvite.code;

    return result;
};

// 兑换邀请码
// #[rpc=rpcServer]
export const convertInviteCode = (code: string): Result => {
    const result = new Result();
    const uid = getUid();
    if (!uid) {
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    const userInviteBucket = new Bucket(WARE_NAME, UserInviteTab._$info.name);
    let userInvite = userInviteBucket.get<number, UserInviteTab[]>(uid)[0];
    if (!userInvite) {
        userInvite = new UserInviteTab();
        userInvite.uid = uid;
        userInvite.code = createCid(CODE_MAX_CONFLICTS, CODE_START_LENGTH);
        userInvite.inviter = 0;
        userInvite.invited_time = '0';
        userInvite.invite_list = [];
    }
    // 该用户已兑换过邀请码
    if (userInvite.inviter !== 0) {
        result.reslutCode = INVITE_CONVERT_REPEAT;

        return result;
    }
    // 获取邀请人邀请信息
    const inviteCodeBucket = new Bucket(WARE_NAME, InviteCodeTab._$info.name);
    const inviteCode = inviteCodeBucket.get<string, InviteCodeTab[]>(code)[0];
    if (!inviteCode) {  // 邀请码错误
        result.reslutCode = INVITE_CODE_ERROR;

        return result;
    }
    // 无法兑换自己的邀请码
    if (inviteCode.uid === uid) {
        result.reslutCode = CANT_INVITE_SELF;

        return result;
    }
    const inviter = inviteCode.uid;
    const inviterUserInvite = userInviteBucket.get<number, UserInviteTab[]>(inviter)[0];
    if (!inviterUserInvite) {  // 邀请码错误
        result.reslutCode = INVITE_CODE_ERROR;

        return result;
    }
    // 更新邀请人信息 
    inviterUserInvite.invite_list.push(uid);
    userInviteBucket.put(inviter, inviterUserInvite);
    // 更新被邀请人邀请信息
    userInvite.inviter = inviter;
    userInvite.invited_time = Date.now().toString();
    userInviteBucket.put(uid, userInvite);
    // 分别向邀请人和被邀请人推送对方的AccId
    result.reslutCode = RESULT_SUCCESS;
    if (!get_userInfo(inviter).accID || !get_userInfo(uid).accID) return result;
    send(uid, MESSAGE_TYPE_CONVERT_INVITE_CODE, get_userInfo(uid).accID);
    send(inviter, MESSAGE_TYPE_INVITE, get_userInfo(uid).accID);

    return result;
};

// 获取邀请人数(真实用户)
// #[rpc=rpcServer]
export const get_inviteNum = (): InviteNumTab => {
    console.log('get_inviteNum in !!!!!!!!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    if (!uid) return;
    let inviteNum = 0;
    const userInviteBucket = new Bucket(WARE_NAME, UserInviteTab._$info.name);
    const userInvite = userInviteBucket.get<number, UserInviteTab[]>(uid)[0];
    if (userInvite) {
        inviteNum = userInvite.invite_list.length;
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

// =====================本地方法==============================

// 生成邀请码
export const createCid = (count: number, length: number): string => {
    const inviteCodeBucket = new Bucket(WARE_NAME, InviteCodeTab._$info.name);
    const chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I',
        'J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let cid = '';
    for (let i = 0; i < length; i++) {
        cid += chars[randomInt(0, chars.length - 1)];
    }
    console.log('!!!!!!!!!!!!!!!!!cid:', cid);
    const inviteCode = inviteCodeBucket.get<string, InviteCodeTab[]>(cid)[0];
    if (!inviteCode) {
        return cid;
    } else {
        if (count > 0) {
            return createCid(count - 1, length);
        } else {
            return createCid(CODE_MAX_CONFLICTS, length + 1);
        }
    }
};