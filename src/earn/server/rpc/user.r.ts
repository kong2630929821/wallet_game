/**
 * 
 */
import { Env } from '../../../pi/lang/env';
import { Session } from '../../../pi/net/session';
import { NetEvent } from '../../../pi_pt/event/event_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../utils/db';
import { SeriesLoginAwardCfg, TaskAwardCfg } from '../../xlsx/awardCfg.s';
import * as CONSTANT from '../data/constant';
import { Result } from '../data/db/guessing.s';
import { ChatIDMap, DayliLogin, DayliLoginKey, Online, OnlineMap, SeriesLogin, Task, TotalLogin, UserAcc, UserAccMap, UserInfo, UserTaskTab } from '../data/db/user.s';
import { CHAT_NOT_REGISTER, DB_ERROR, NOT_LOGIN, NOT_USER_INFO } from '../data/errorNum';
import { get_index_id } from '../data/util';
import { get_today, task_init } from '../util/item_util.r';
import { firstLogin_award, login_add_mine, seriesLogin_award } from '../util/regularAward';
import { send } from '../util/sendMessage';
import { SeriesDaysRes } from './itemQuery.s';
import { getSession, setSession } from './session.r';
import { add_free_rotary } from './stParties.r';
import { LoginReq, UserType, UserType_Enum, WalletLoginReq } from './user.s';
import { get_task_award } from './user_item.r';

declare var env: Env;

// #[rpc=rpcServer]
export const login = (user: UserType): UserInfo => {
    console.log('new login!!!!!!!!!!!!!!!!!!!!!!user:', user);
    const userInfo = new UserInfo();
    const loginReq = new LoginReq();
    let openid;
    if (user.enum_type === UserType_Enum.WALLET) {
        const walletLoginReq = <WalletLoginReq>user.value;
        openid = walletLoginReq.openid;
        const sign = walletLoginReq.sign;
        // TODO 验证签名
        const userAccountBucket = new Bucket(CONSTANT.WARE_NAME, UserAcc._$info.name);
        const userAccountMapBucket = new Bucket(CONSTANT.WARE_NAME, UserAccMap._$info.name);
        console.log('------login-------', userAccountBucket.get(openid));
        const v = userAccountBucket.get(openid)[0];
        if (!v) {
            // 注册用户
            const uid = get_index_id(CONSTANT.INDEX_USER);
            const userAcc = new UserAcc();
            userAcc.uid = uid;
            userAcc.user = openid;
            userAccountBucket.put(openid, userAcc);
            const userAccMap = new UserAccMap(uid, openid);
            userAccountMapBucket.put(uid, userAccMap);
            loginReq.uid = uid;
        } else {
            loginReq.uid = v.uid;
        }
    } else {
        userInfo.uid = -1;
        userInfo.sex = 0;

        return userInfo;
    }
    const mqttServer:ServerNode = env.get('mqttServer');
    setMqttTopic(mqttServer, `send/${loginReq.uid.toString()}`, true, true);

    // save session
    setSession('uid', loginReq.uid.toString(), loginReq.uid.toString());
    setSession('openid', openid, loginReq.uid.toString());
    const session: Session = env.get('session');
    // 添加到在线表
    set_user_online(loginReq.uid, session.getId());

    // 判断是否首次登陆
    userInfo.loginCount = get_totalLoginDays();
    if (userInfo.loginCount === 0) {
        // 添加首次登陆奖励
        firstLogin_award();
        // 初始化任务
        task_init(loginReq.uid);
        // 添加创建钱包奖励
        get_task_award(1);
    }

    // 判断是否当日首次登陆
    if (isToday_firstLogin()) {
        console.log('is today first login!!!!!!!!!!!!!!!!!!!!!!!!');
        // 当日首次登陆赠送矿山
        login_add_mine();
        // 当日首次登陆赠送一次免费初级转盘
        add_free_rotary();
        // 重置每日任务
        reset_dayli_task();
        // 添加到每日登陆表
        set_user_login(loginReq.uid);
        // 添加连续登陆奖励
        const days = getLoginDays().days;
        seriesLogin_award(days);
    }
    userInfo.uid = loginReq.uid;
    userInfo.sex = 0;
    console.log('userInfo!!!!!!!!!!!!!!!!!!!!!!!!', userInfo);

    return userInfo;
};

// 获取连续登陆天数
export const getLoginDays = (): SeriesDaysRes => {
    const uid = getUid();
    if (!uid) return;
    const seriesDaysRes = new SeriesDaysRes();
    const seriesLoginBucket = new Bucket(CONSTANT.WARE_NAME, SeriesLogin._$info.name);
    const seriesLogin = seriesLoginBucket.get<number, [SeriesLogin]>(uid)[0];
    if (!seriesLogin) {
        seriesDaysRes.resultNum = DB_ERROR;

        return seriesDaysRes;
    }
    seriesDaysRes.days = seriesLogin.days;
    seriesDaysRes.resultNum = CONSTANT.RESULT_SUCCESS;

    return seriesDaysRes;
};

// 绑定聊天ID
// #[rpc=rpcServer]
export const bind_chatID = (chatID: number): Result => {
    console.log('bind_chatID:', chatID);
    const result = new Result();
    if (!chatID) {
        console.log('!!!!!!!!!!!!!!!!1111111111111111111111111');
        result.reslutCode = CHAT_NOT_REGISTER;

        return result;
    }
    const uid = getUid();
    console.log('!!!!!!!!!!!!!!!!222222222222222222', uid);
    if (!uid) {
        console.log('!!!!!!!!!!!!!!!!33333333333333333333333333');
        result.reslutCode = NOT_LOGIN;

        return result;
    }
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserInfo._$info.name);
    const chatIDMapBucket = new Bucket(CONSTANT.WARE_NAME, ChatIDMap._$info.name);
    console.log('!!!!!!!!!!!!!!!!4444444444444444444444');
    const userInfo = userInfoBucket.get<number, UserInfo>(uid)[0];
    console.log('userInfo:', userInfo);
    if (!userInfo) {
        result.reslutCode = NOT_USER_INFO;

        return result;
    }
    userInfo.chatID = chatID;
    userInfoBucket.put(uid, userInfo);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!566666666666666666666666');
    chatIDMapBucket.put(chatID, uid);
    result.reslutCode = CONSTANT.RESULT_SUCCESS;
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!7777777777777777777777result:', result);

    return result;
};

// 本地方法
// 设置在线信息
export const set_user_online = (uid: number, sessionId: number) => {
    const onlineUsersBucket = new Bucket('memory', Online._$info.name);
    const onlineUsersMapBucket = new Bucket('memory', Online._$info.name);

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
export const get_totalLoginDays = (): number => {
    console.log('get_totalLoginDays in!!!!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    const totalLoginBucket = new Bucket(CONSTANT.WARE_NAME, TotalLogin._$info.name);
    let totalLogin = totalLoginBucket.get<number, [TotalLogin]>(uid)[0];
    if (!totalLogin) {
        console.log('blank get_totalLoginDays in!!!!!!!!!!!!!!!!!!!!');
        totalLogin = new TotalLogin();
        totalLogin.uid = uid;
        totalLogin.days = 0;
        totalLoginBucket.put(uid, totalLogin);
    }

    return totalLogin.days;
};

// 本地方法
// 设置每日登陆信息
export const set_user_login = (uid: number) => {
    console.log('set_user_login in !!!!!!!!!!!!!!!!!!!');
    const dayliLoginBucket = new Bucket(CONSTANT.WARE_NAME, DayliLogin._$info.name);
    const seriesLoginBucket = new Bucket(CONSTANT.WARE_NAME, SeriesLogin._$info.name);
    const totalLoginBucket = new Bucket(CONSTANT.WARE_NAME, TotalLogin._$info.name);

    const today = get_today();
    const dayliLoginKey = new DayliLoginKey();
    dayliLoginKey.uid = uid;
    dayliLoginKey.date = today;

    const totalLogin = new TotalLogin();
    totalLogin.uid = uid;
    totalLogin.days = get_totalLoginDays() + 1;
    console.log('totalLogin.days !!!!!!!!!!!!!!!!!!!', totalLogin.days);
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
        const yestodayLogin = dayliLoginBucket.get<DayliLoginKey, [DayliLogin]>(dayliLoginKey)[0];
        if (!yestodayLogin) {
            // 如果昨天没有登陆 连续登陆天数重置为1
            seriesLogin.days = 1;
        } else {
            seriesLogin.days += 1;
        }
        seriesLoginBucket.put(uid, seriesLogin);
    }
};

// 本地方法
// 验证是否当日首次登陆
export const isToday_firstLogin = (): boolean => {
    console.log('isToday_firstLogin in!!!!!!!!!!!!!!!!!!!!');
    const uid = getUid();
    const today = get_today();
    console.log('today is :!!!!!!!!!!!!!!!!!!!!', today);
    const dayliLoginKey = new DayliLoginKey();
    dayliLoginKey.uid = uid;
    dayliLoginKey.date = today;

    const dayliLoginBucket = new Bucket(CONSTANT.WARE_NAME, DayliLogin._$info.name);
    let dayliLogin = dayliLoginBucket.get<DayliLoginKey, [DayliLogin]>(dayliLoginKey)[0];
    if (!dayliLogin) {
        dayliLogin = new DayliLogin();
        dayliLogin.index = dayliLoginKey;
        dayliLogin.state = true;
        dayliLoginBucket.put(dayliLoginKey, dayliLogin);

        return true;
    }

    return false;
};

// 离线设置
// #[event=net_connect_close]
export const close_connect = (e: NetEvent) => {
    const sessionId = e.connect_id;

    const onlineUsersBucket = new Bucket('memory', Online._$info.name);
    const onlineUsersMapBucket = new Bucket('memory', OnlineMap._$info.name);
    const r = onlineUsersMapBucket.get<number, [OnlineMap]>(sessionId)[0];
    if (r && r.uid !== -1) {
        onlineUsersMapBucket.delete(r.session_id);
        const onlineUser = onlineUsersBucket.get<number, [Online]>(r.uid)[0];
        if (onlineUser.session_id !== -1) {
            onlineUsersBucket.delete(r.uid);
        }

    }
};

// 获取连续登陆天数
// #[rpc=rpcServer]
export const get_loginDays = (): SeriesDaysRes => {
    const uid = getUid();
    if (!uid) return;
    const seriesDaysRes = new SeriesDaysRes();
    const seriesLoginBucket = new Bucket(CONSTANT.WARE_NAME, SeriesLogin._$info.name);
    const seriesLogin = seriesLoginBucket.get<number, [SeriesLogin]>(uid)[0];
    if (!seriesLogin) {
        seriesDaysRes.resultNum = DB_ERROR;

        return seriesDaysRes;
    }
    const cfgBucket = new Bucket(CONSTANT.MEMORY_NAME, SeriesLoginAwardCfg._$info.name);
    const awardCfg = cfgBucket.get<number, [SeriesLoginAwardCfg]>(seriesLogin.days)[0];
    const dayliLoginBucket = new Bucket(CONSTANT.WARE_NAME, DayliLogin._$info.name);
    const today = get_today();
    const dayliLoginKey = new DayliLoginKey();
    dayliLoginKey.uid = uid;
    dayliLoginKey.date = today;
    const dayliLogin = dayliLoginBucket.get<DayliLoginKey, [DayliLogin]>(dayliLoginKey)[0];
    if (!dayliLogin.sendCount || dayliLogin.sendCount === 0) {
        // 推送签到奖励信息
        send(uid, CONSTANT.MESSAGE_TYPE_DAILY_FIREST_LOGIN, JSON.stringify(awardCfg));
        console.log('send!!!!!!!!!!!!', dayliLogin);

        dayliLogin.sendCount = 1;
        dayliLoginBucket.put(dayliLoginKey, dayliLogin);
    }
    seriesDaysRes.days = seriesLogin.days;
    seriesDaysRes.resultNum = CONSTANT.RESULT_SUCCESS;

    return seriesDaysRes;
};

// 本地方法
// 重置每日任务
export const reset_dayli_task = () => {
    const uid = getUid();
    const userTaskBucket = new Bucket(CONSTANT.WARE_NAME, UserTaskTab._$info.name);
    const taskCfgBucket = new Bucket(CONSTANT.MEMORY_NAME, TaskAwardCfg._$info.name);
    const iter = taskCfgBucket.iter(null);
    // 获取每日任务id
    const taskList = [];
    do {
        const iterEle = iter.next();
        console.log('elCfg----------------read---------------', iterEle);
        if (!iterEle) break;
        const taskCfg: TaskAwardCfg = iterEle[1];
        if (taskCfg.isDayli === true) taskList.push(taskCfg.id);
    } while (iter);
    const userTask = userTaskBucket.get<number, [UserTaskTab]>(uid)[0];
    console.log('-------------taskList!------------', taskList);
    // 任务较少 算法比较暴力
    for (let i = 0; i < taskList.length; i++) {
        for (let j = 0; j < userTask.taskList.length; j++) {
            if (userTask.taskList[j].id === taskList[i]) {
                // 重置任务状态
                userTask.taskList[j].state = 0;
                break;
            }
        }
    }
    userTaskBucket.put(uid, userTask);
};

// 获取用户信息
export const get_userInfo = (uid: number): UserInfo => {
    const bucket = new Bucket(CONSTANT.WARE_NAME, UserInfo._$info.name);
    console.log('before get_uname!!!!!!!!!!!!!!!!!');

    return bucket.get<number, [UserInfo]>(uid)[0];
};

// 获取uid
export const getUid = () => {

    return parseInt(getSession('uid'), 10);
};

// 获取openid
export const getOpenid = () => {

    return getSession('openid');
};