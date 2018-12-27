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
import { DayliLogin, DayliLoginKey, Online, OnlineMap, SeriesLogin, TotalLogin, UserAcc, UserInfo } from '../data/db/user.s';
import { DB_ERROR } from '../data/errorNum';
import { get_index_id } from '../data/util';
import { get_today } from '../util/item_util.r';
import { firstLogin_award, login_add_mine } from '../util/regularAward';
import { SeriesDaysRes } from './itemQuery.s';
import { LoginReq, UserType, UserType_Enum, WalletLoginReq } from './user.s';

// #[rpc=rpcServer]
export const login = (user: UserType): UserInfo => {
    console.log('new login!!!!!!!!!!!!!!!!!!!!!!user:', user);
    const dbMgr = getEnv().getDbMgr();
    const userInfo = new UserInfo();
    const loginReq = new LoginReq();
    let openid;
    if (user.enum_type === UserType_Enum.WALLET) {
        const walletLoginReq = <WalletLoginReq>user.value;
        openid = walletLoginReq.openid;
        const sign = walletLoginReq.sign;
        // TODO 验证签名
        const userAccountBucket = new Bucket('file', UserAcc._$info.name, dbMgr);
        console.log('------login-------', userAccountBucket.get(openid));
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
        session.set(tr, 'openid', openid);
    });

    // 添加到在线表
    set_user_online(loginReq.uid, session.getId());

    // 判断是否首次登陆
    if (get_totalLoginDays() === 0) {
        // 添加首次登陆奖励
        firstLogin_award();
    }
    // 登陆赠送矿山
    login_add_mine();

    // 添加到每日登陆表
    set_user_login(loginReq.uid);

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

// 本地方法
// 获取用户登陆总天数
export const get_totalLoginDays = ():number => {
    const uid = getUid();
    const totalLogin = new TotalLogin();
    const dbMgr = getEnv().getDbMgr();
    const seriesLoginBucket = new Bucket(CONSTANT.WARE_NAME, TotalLogin._$info.name, dbMgr);
    const seriesLogin = seriesLoginBucket.get<number, [TotalLogin]>(uid)[0];
    if (!seriesLogin) {
        return 0;
    }

    return totalLogin.days;
};

// 本地方法
// 设置每日登陆信息
export const set_user_login = (uid: number) => {
    console.log('set_user_login in !!!!!!!!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const dayliLoginBucket = new Bucket(CONSTANT.WARE_NAME, DayliLogin._$info.name, dbMgr);
    const seriesLoginBucket = new Bucket(CONSTANT.WARE_NAME, SeriesLogin._$info.name, dbMgr);
    const totalLoginBucket = new Bucket(CONSTANT.WARE_NAME, TotalLogin._$info.name, dbMgr);

    const today = get_today();
    const dayliLoginKey = new DayliLoginKey();
    dayliLoginKey.uid = uid;
    dayliLoginKey.date = today;
    
    const dayliLogin = new DayliLogin();
    dayliLogin.index = dayliLoginKey;
    dayliLogin.state = true;
    dayliLoginBucket.put(dayliLoginKey, dayliLogin);

    const totalLogin = new TotalLogin();
    totalLogin.uid = uid;
    totalLogin.days = get_totalLoginDays();
    totalLoginBucket.put(uid, totalLogin);

    // 增加连续登陆天数，验证昨天是否登陆，未登录重置为1
    const seriesLogin = seriesLoginBucket.get<number, [SeriesLogin]>(uid)[0];
    if (!seriesLogin) {
        console.log('blankSeriesLogin in !!!!!!!!!!!!!!!!!!!');
        const blankSeriesLogin = new SeriesLogin();
        blankSeriesLogin.uid = uid;
        blankSeriesLogin.days = 1;
        seriesLoginBucket.put(uid, blankSeriesLogin);
    } else {
        dayliLoginKey.date = today - 1;
        if (!dayliLoginBucket.get(dayliLoginKey)) {
            seriesLogin.days = 1;
        } else {
            seriesLogin.days += 1;
        }
        seriesLoginBucket.put(uid, seriesLogin);
    }
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

// 获取连续登陆天数
// #[rpc=rpcServer]
export const get_loginDays = ():SeriesDaysRes => {
    const uid = getUid();
    const seriesDaysRes = new SeriesDaysRes();
    const dbMgr = getEnv().getDbMgr();
    const seriesLoginBucket = new Bucket(CONSTANT.WARE_NAME, SeriesLogin._$info.name, dbMgr);
    const seriesLogin = seriesLoginBucket.get<number, [SeriesLogin]>(uid)[0];
    if (!seriesLogin) {
        seriesDaysRes.resultNum = DB_ERROR;

        return seriesDaysRes;
    }
    seriesDaysRes.days = seriesLogin.days;

    return seriesDaysRes;
};

// 获取uid
export const getUid = () => {
    const dbMgr = getEnv().getDbMgr();
    const session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, 'uid');
    });

    return parseInt(uid, 10);
};

// 获取openid
export const getOpenid = () => {
    const dbMgr = getEnv().getDbMgr();
    const session = getEnv().getSession();
    let openid;
    read(dbMgr, (tr: Tr) => {
        openid = session.get(tr, 'openid');
    });

    return openid;
};