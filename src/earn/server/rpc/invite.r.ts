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
    const openid = getOpenid();
    const cdkey = getcdkey(uid, code);
    const InviteBucket = new Bucket('file', Invite._$info.name, dbMgr);
    const v = InviteBucket.get(cdkey)[0];
    const r = new Invite();
    if (!v) {
        // 去钱包服务器兑换邀请码
        oauth_send(WALLET_API_CDKEY, { openid: openid, code: code });
        // TODO 解析返回值
    } else {
        return r;
    }

    return r;
};