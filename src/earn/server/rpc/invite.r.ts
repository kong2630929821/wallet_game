/**
 * 邀请用户
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { invite } from '../../client/app/test/test';
import { Bucket } from '../../utils/db';
import { WALLET_API_CDKEY, WARE_NAME } from '../data/constant';
import { Invite } from '../data/db/invite.s';
import { InviteTab, UserAcc } from '../data/db/user.s';
import { getcdkey } from '../data/util';
import { oauth_send } from '../util/oauth_lib';
import { invite_award } from '../util/regularAward';
import { getOpenid, getUid } from './user.r';

// 兑换邀请码
// #[rpc=rpcServer]
export const cdkey = (code: string): Invite => {
    const dbMgr = getEnv().getDbMgr();
    const uid = getUid();
    // 获取openid
    const openid = Number(getOpenid());
    const cdkey = getcdkey(uid, code);
    const InviteBucket = new Bucket('file', Invite._$info.name, dbMgr);
    const v = InviteBucket.get(cdkey)[0];
    const invite = new Invite();
    if (!v) {
        // 去钱包服务器兑换邀请码
        const r = oauth_send(WALLET_API_CDKEY, { openid: openid, code: code });
        if (r.ok) {
            const json = JSON.parse(r.ok);
            if (json.return_code === 1) {
                // 增加邀请奖励
                const inviteOpenid = <string>json.openid; // 邀请人openid
                // 获取邀请人uid
                const bucket = new Bucket(WARE_NAME, UserAcc._$info.name, dbMgr);
                const iuser = bucket.get<string, [UserAcc]>(inviteOpenid)[0];
                let iuid; // 邀请人uid
                let friendsNum; // 邀请人已邀请人数
                if (!iuser) {
                    iuid = -1;
                    friendsNum = 1;
                } else {
                    iuid = iuser.uid;
                    // 获取邀请人已邀请人数
                    const invites = get_invite_friends(iuid);
                    invites.fuid.push(uid);
                    friendsNum = invites.fuid.length;
                    // 添加邀请人邀请记录
                    const inviteBucket = new Bucket(WARE_NAME, InviteTab._$info.name, dbMgr);
                    inviteBucket.put(iuid, invites);
                }
                invite.code = cdkey;
                invite.items = []; // 奖品列表
                const item = invite_award(iuid, friendsNum);
                invite.items.push(item);
                InviteBucket.put(cdkey, invite);

                return invite;
            }
        } else {
            invite.code = '-1';
            invite.items = [];

            return invite;
        }
    } else {
        invite.code = '-1';
        invite.items = [];

        return invite;
    }
};

// 获取已邀请的好友
// #[rpc=rpcServer]
export const get_invite_friends = (uid: number): InviteTab => {
    const dbMgr = getEnv().getDbMgr();
    const inviteBucket = new Bucket(WARE_NAME, InviteTab._$info.name, dbMgr);
    const invites = inviteBucket.get<number, [InviteTab]>(uid)[0];
    if (!invites) {
        const blank = new InviteTab();
        blank.uid = uid;
        blank.fuid = [];

        return blank;
    }

    return invites;
};