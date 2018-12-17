/**
 * 
 */
import { read, write } from '../../../pi_pt/db';
import { NetEvent } from '../../../pi_pt/event/event_server';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../utils/db';
import * as CONSTANT from '../data/constant';
import { Online, OnlineMap, UserAcc, UserInfo } from '../data/db/user.s';
import { get_index_id } from '../data/util';
import { LoginReq, UserType, UserType_Enum, WalletLoginReq } from './user.s';

// #[rpc=rpcServer]
export const login = (user: UserType): UserInfo => {
    console.log('new login!!!!!!!!!!!!!!!!!!!!!!user:', user);
    const dbMgr = getEnv().getDbMgr();
    const userInfo = new UserInfo();
    const loginReq = new LoginReq();
    if (user.enum_type === UserType_Enum.WALLET) {
        const walletLoginReq = <WalletLoginReq>user.value;
        const openid = walletLoginReq.openid;
        const sign = walletLoginReq.sign;
        // TODO 验证签名
        const userAccountBucket = new Bucket('file', UserAcc._$info.name, dbMgr);
        console.log('------login-------',userAccountBucket.get(openid));
        const v = userAccountBucket.get(openid)[0];
        if (!v) {
            // 注册用户
            const uid = get_index_id(CONSTANT.INDEX_USER);
            const userAcc = new UserAcc();
            userAcc.uid = uid;
            userAcc.user = openid;
            userAccountBucket.put(openid, userAcc);
            loginReq.uid = uid;
        } else {
            loginReq.uid = v.uid;
        }
    } else {
        userInfo.uid = -1;
        userInfo.sex = 0;

        return userInfo;
    }
    const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
    setMqttTopic(mqttServer, loginReq.uid.toString(), true, true);

    // save session
    const session = getEnv().getSession();
    write(dbMgr, (tr: Tr) => {
        session.set(tr, 'uid', loginReq.uid.toString());
    });

    // 添加到在线表
    set_user_online(loginReq.uid, session.getId());

    userInfo.uid = loginReq.uid;
    userInfo.sex = 0;
    console.log('userInfo!!!!!!!!!!!!!!!!!!!!!!!!', userInfo);

    return userInfo;
};

// 本地方法
// 设置在线信息
export const set_user_online = (uid: number, sessionId: number) => {
    const dbMgr = getEnv().getDbMgr();
    const onlineUsersBucket = new Bucket('memory', Online._$info.name, dbMgr);
    const onlineUsersMapBucket = new Bucket('memory', Online._$info.name, dbMgr);

    const online = new Online();
    online.uid = uid;
    online.session_id = sessionId;
    onlineUsersBucket.put(online.uid, online);

    const onlineMap = new OnlineMap();
    onlineMap.session_id = sessionId;
    onlineMap.uid = uid;
    onlineUsersMapBucket.put(onlineMap.session_id, onlineMap);
};

// 离线设置
// #[event=net_connect_close]
export const close_connect = (e: NetEvent) => {
    const sessionId = e.connect_id;
    const dbMgr = getEnv().getDbMgr();

    const onlineUsersBucket = new Bucket('memory', Online._$info.name, dbMgr);
    const onlineUsersMapBucket = new Bucket('memory', OnlineMap._$info.name, dbMgr);
    const r = onlineUsersMapBucket.get<number, [OnlineMap]>(sessionId)[0];
    if (r.uid !== -1) {
        onlineUsersMapBucket.delete(r.session_id);
        const onlineUser = onlineUsersBucket.get<number, [Online]>(r.uid)[0];
        if (onlineUser.session_id !== -1) {
            onlineUsersBucket.delete(r.uid);
        }

    }
};