/**
 * 邀请用户
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { WALLET_API_CDKEY } from '../data/constant';
import { Invite } from '../data/db/invite.s';
import { getcdkey } from '../data/util';
import { oauth_send } from '../util/oauth_lib';
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
                // TODO 增加邀请奖励
                invite.code = cdkey;
                invite.items = []; // TODO 奖品列表
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