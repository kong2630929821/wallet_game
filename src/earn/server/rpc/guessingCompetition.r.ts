/**
 * 竞猜
 */

import { randomInt } from '../../../pi/util/math';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { DBIter } from '../../../pi_pt/rust/pi_serv/js_db';
import { Bucket } from '../../utils/db';
import { RESULT_SUCCESS, ST_TYPE, ST_UNIT_NUM, ST_WALLET_TYPE, WALLET_API_ALTER, WARE_NAME } from '../data/constant';
import { AddCompetition, Competition, CompetitionList, CompJackpots, CompResult, Guessing, GuessingKey, GuessingKeyList, GuessingReq, MainPageComp, MainPageCompList, PreCompetitionList, Result, UserGuessing, UserGuessingInfo, UserGuessingList } from '../data/db/guessing.s';
import { UserAcc, UserAccMap } from '../data/db/user.s';
import { COMPETITION_ALREADY_CLOSE, COMPETITION_NOT_EXIST, COMPETITION_RESULT_EXIST, COMPETITION_RESULT_NOT_EXIST, DB_ERROR, GUESSING_ALREADY_SETTLED, GUESSINGNUM_BEYOUND_LIMIT, REQUEST_WALLET_FAIL, ST_NUM_ERROR, UNIFIEDORDER_API_FAILD } from '../data/errorNum';
import { EACH_COMPETITION_LIMIT, EACH_GUESSING_LIMIT, EACH_GUESSING_MIN, GUESSING_HAS_SETTLED, GUESSING_IS_SETTLING, GUEST_TEAM_NUM, HOST_TEAM_NUM, INIT_JACKPOTS_MAX, NOT_PAY_YET, RESULT_NOT_EXIST, RESULT_TEAM1_WIN, RESULT_TEAM2_WIN } from '../data/guessingConstant';
import { get_index_id } from '../data/util';
import { oauth_alter_balance, oauth_send, wallet_unifiedorder } from '../util/oauth_lib';
import { getUid } from './user.r';

// 获取主页面比赛信息
// #[rpc=rpcServer]
export const get_main_competitions = (): Result => {
    console.log('get_main_competitions in!!!!!!!!!!!!');
    const result = new Result();
    const mainPageList = [];
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Competition._$info.name, dbMgr);
    const jackpotBucket = new Bucket(WARE_NAME, CompJackpots._$info.name, dbMgr);
    const date = (new Date()).valueOf();
    const iter = <DBIter>bucket.iter(null, true);
    do {
        console.log('iterEle in!!!!!!!!!!!!');
        const iterEle = iter.nextElem();
        console.log('iterEle in!!!!!!!!!!!!', iterEle);
        if (!iterEle) break;
        const competition:Competition = iterEle[1];
        if ((date - parseInt(competition.time, 10)) > get_oneday_ms() && competition.result !== 0) break;
        const mainPageComp = new MainPageComp();
        const jackpots:CompJackpots = jackpotBucket.get(competition.cid)[0];
        console.log('jackpots in!!!!!!!!!!!!', jackpots);
        if (!jackpots) {
            result.reslutCode = DB_ERROR;

            return result;
        }
        mainPageComp.comp = competition;
        // mainPageComp.team1num = jackpots.guessings1.length;
        // mainPageComp.team2num = jackpots.guessings2.length;
        mainPageComp.team1num = jackpots.jackpot1;
        mainPageComp.team2num = jackpots.jackpot2;
        mainPageList.push(mainPageComp);
    } while (iter);
    const mainPageCompList = new MainPageCompList();
    mainPageCompList.list = mainPageList;
    result.msg = JSON.stringify(mainPageCompList);
    result.reslutCode = RESULT_SUCCESS;
    console.log('result in!!!!!!!!!!!!', result);

    return result;
};

// 获取竞猜奖池信息
// #[rpc=rpcServer]
export const get_compJackpots = (cid: number): Result => {
    console.log('get_compJackpots in!!!!!!!!!!!!');
    const result = new Result();
    const dbMgr = getEnv().getDbMgr(); 
    const bucket = new Bucket(WARE_NAME, CompJackpots._$info.name, dbMgr);
    const jackpots:CompJackpots = bucket.get(cid)[0];
    if (!jackpots) {
        result.reslutCode = DB_ERROR;

        return result;
    }
    result.msg = JSON.stringify(jackpots);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 竞猜投注
// #[rpc=rpcServer]
export const start_guessing = (guessingReq: GuessingReq): Result => {
    const result = new Result();
    const cid = guessingReq.cid;
    const num = guessingReq.num;
    if (!num || num < EACH_GUESSING_MIN || num > EACH_GUESSING_LIMIT || (num % EACH_GUESSING_MIN !== 0)) {
        result.reslutCode = ST_NUM_ERROR;

        return result;
    }
    const teamSide = guessingReq.teamSide;
    const date = (new Date()).valueOf();
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr(); 
    const compBucket = new Bucket(WARE_NAME, Competition._$info.name, dbMgr);
    const competition = compBucket.get<number, [Competition]>(cid)[0];
    if (!competition) {
        result.reslutCode = COMPETITION_NOT_EXIST;
        
        return result;
    }
    // 验证该场比赛是否封盘
    if (date >= parseInt(competition.time, 10) || competition.result !== 0) {
        result.reslutCode = COMPETITION_ALREADY_CLOSE;

        return result;
    }
    // 获取该场比赛奖金池信息
    const jackpotsBucket = new Bucket(WARE_NAME, CompJackpots._$info.name, dbMgr);
    const jackpots:CompJackpots = jackpotsBucket.get(cid)[0];
    if (!jackpots) {
        result.reslutCode = DB_ERROR;

        return result;
    }
    const guessingKey = new GuessingKey();
    guessingKey.uid = uid;
    guessingKey.cid = cid;
    // 验证用户单场比赛的竞猜金额是否达到上限
    const userGuessBucket = new Bucket(WARE_NAME, UserGuessing._$info.name, dbMgr);
    let userGuessing = userGuessBucket.get<GuessingKey, [UserGuessing]>(guessingKey)[0];
    if (!userGuessing) userGuessing = new UserGuessing(guessingKey, 0);
    userGuessing.total += num;
    if (userGuessing.total > EACH_COMPETITION_LIMIT) {
        result.reslutCode = GUESSINGNUM_BEYOUND_LIMIT;

        return result;
    }
    userGuessBucket.put(guessingKey, userGuessing);
    guessingKey.index = get_index_id(`${uid}${cid}`);
    let rate;
    let benefit;
    // 生成竞猜对象
    const time = (new Date()).valueOf();
    const oid = `${time}${uid}${randomInt(10000, 99999)}`;
    const guessingBucket = new Bucket(WARE_NAME, Guessing._$info.name, dbMgr);
    const guessing = new Guessing(guessingKey, teamSide, rate, num, oid, NOT_PAY_YET, benefit, date.toString());
    guessingBucket.put(guessingKey, guessing);
    // 生成订单
    const resultJson = wallet_unifiedorder(oid, num);
    if (!resultJson) {
        result.reslutCode = UNIFIEDORDER_API_FAILD;

        return result;
    }
    result.msg = JSON.stringify(resultJson);
    result.reslutCode = RESULT_SUCCESS;

    return result;
    // const oid = `${(new Date()).valueOf()}${uid}${randomInt(10000, 99999)}`;
    // if (!oauth_alter_balance(ST_TYPE, oid, -num)) {
    //     result.reslutCode = REQUEST_WALLET_FAIL;

    //     return result;
    // }
    // 根据用户选择的队伍增加相应奖金池的数量
    if (guessingReq.teamSide === HOST_TEAM_NUM) {
        jackpots.jackpot1 += num;
        rate = (jackpots.jackpot2 / jackpots.jackpot1) + 1;
        benefit = rate * num;
        jackpots.guessings1.push(guessingKey);
    }
    if (guessingReq.teamSide === GUEST_TEAM_NUM) {
        jackpots.jackpot2 += num;
        rate = (jackpots.jackpot1 / jackpots.jackpot2) + 1;
        benefit = rate * num;
        jackpots.guessings2.push(guessingKey);
    }
    jackpotsBucket.put(cid, jackpots);
    const guessingKeyListBucket = new Bucket(WARE_NAME, GuessingKeyList._$info.name, dbMgr);
    let guessingKeyList = guessingKeyListBucket.get<number, [GuessingKeyList]>(uid)[0];
    if (!guessingKeyList) guessingKeyList = new GuessingKeyList(uid, []);
    guessingKeyList.list.push(guessingKey);
    guessingKeyListBucket.put(uid, guessingKeyList);
    // 返回竞猜结果
    result.msg = JSON.stringify(guessing);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 竞猜支付回调
// export const guessing_callback = () => {

// };

// 竞猜支付查询
// #[rpc=rpcServer]
// export const guessing_pay_query = (guessingKey:GuessingKey) => {

// };

// 获取用户已参与的竞猜信息
// #[rpc=rpcServer]
export const get_user_guessingInfo = ():Result => {
    console.log('get_user_guessingInfo in!!!!!!!!!!!!');
    const result = new Result();
    const userGuessingList = new UserGuessingList();
    userGuessingList.list = [];
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr(); 
    const compBucket = new Bucket(WARE_NAME, Competition._$info.name, dbMgr);
    const jackpotBucket = new Bucket(WARE_NAME, CompJackpots._$info.name, dbMgr);
    const guessingBucket = new Bucket(WARE_NAME, Guessing._$info.name, dbMgr);
    const guessingKeyListBucket = new Bucket(WARE_NAME, GuessingKeyList._$info.name, dbMgr);
    const guessingKeyList = guessingKeyListBucket.get<number, [GuessingKeyList]>(uid)[0];
    if (!guessingKeyList) {
        result.reslutCode = RESULT_SUCCESS;
        result.msg = JSON.stringify(userGuessingList);
        
        return result;
    }
    console.log('guessingKeyList !!!!!!!!!!!!!', guessingKeyList);
    for (let i = guessingKeyList.list.length - 1; i >= 0 ; i --) {
        const guessingKey = guessingKeyList.list[i];
        console.log('guessingKey !!!!!!!!!!!!!', guessingKey);
        const cid = guessingKey.cid;
        const guessing:Guessing = guessingBucket.get(guessingKey)[0];
        const competition:Competition = compBucket.get(cid)[0];
        const jackpots:CompJackpots = jackpotBucket.get(cid)[0];
        // const team1num = jackpots.guessings1.length;
        // const team2num = jackpots.guessings2.length;
        const team1num = jackpots.jackpot1;
        const team2num = jackpots.jackpot2;
        const userGuessingInfo = new UserGuessingInfo(competition, team1num, team2num, guessing);
        userGuessingList.list.push(userGuessingInfo);
    }
    result.msg = JSON.stringify(userGuessingList);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 获取可参与竞猜的比赛信息
// #[rpc=rpcServer]
export const get_competitions = (compType: number): CompetitionList => {
    const competitionList = new CompetitionList();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, PreCompetitionList._$info.name, dbMgr);
    const preCompetitionList = bucket.get<number, [PreCompetitionList]>(compType)[0];
    if (!preCompetitionList) {
        competitionList.list = [];

        return competitionList;
    }
    const keyList = preCompetitionList.list;
    const CompetitionBucket = new Bucket(WARE_NAME, Competition._$info.name, dbMgr);
    const list = CompetitionBucket.get<number[], [Competition]>(keyList);
    competitionList.list = list;

    return competitionList;
};

// 新增比赛
// #[rpc=rpcServer]
export const add_competitions = (addComp: AddCompetition): Result => {
    console.log('add_competitions in !!!!!!!!!!!!!!', addComp);
    const result = new Result();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Competition._$info.name, dbMgr);
    const cid = get_index_id(`competiton`);
    const time = get_timestamps(addComp.time).toString();
    console.log('time in !!!!!!!!!!!!!!', time);
    const competition = new Competition(cid, addComp.team1, addComp.team2, time, addComp.matchType, 0, 0);
    if (addComp.team1num > INIT_JACKPOTS_MAX || addComp.team2num > INIT_JACKPOTS_MAX) {
        result.reslutCode = GUESSINGNUM_BEYOUND_LIMIT;

        return result;
    }
    const jackpotBucket = new Bucket(WARE_NAME, CompJackpots._$info.name, dbMgr);
    const jackpots = new CompJackpots(cid, addComp.team1num, addComp.team2num, [], []);
    if (bucket.put(cid, competition) && jackpotBucket.put(cid, jackpots)) {
        result.reslutCode = RESULT_SUCCESS;
    } else {
        result.reslutCode = DB_ERROR;
    }

    return result;
};

// 输入比赛结果
// #[rpc=rpcServer]
export const input_competition_result = (compResult:CompResult): Result => {
    console.log('input_competition_result in !!!!!!!!!!!!!!', compResult);
    const result = new Result();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Competition._$info.name, dbMgr); 
    const competition = bucket.get<number, [Competition]>(compResult.cid)[0];
    if (!competition) {
        result.reslutCode = COMPETITION_NOT_EXIST;

        return result;
    }
    if (competition.result !== RESULT_NOT_EXIST) {
        result.reslutCode = COMPETITION_RESULT_EXIST;

        return result;
    }
    competition.result = compResult.result;
    bucket.put(compResult.cid, competition);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 结算奖励
// #[rpc=rpcServer]
export const settle_guessing_award = (cid: number): Result => {
    console.log('settle_guessing_award in', cid);
    const result = new Result();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Competition._$info.name, dbMgr);
    const competition = bucket.get<number, [Competition]>(cid)[0];
    if (!competition) {
        result.reslutCode = COMPETITION_NOT_EXIST;

        return result;
    }
    if (competition.result === RESULT_NOT_EXIST) {
        result.reslutCode = COMPETITION_RESULT_NOT_EXIST;

        return result;
    }
    if (competition.state !== 0) {
        result.reslutCode = GUESSING_ALREADY_SETTLED;

        return result;
    }
    // 开始结算 竞猜结算状态更新为结算中
    competition.state = GUESSING_IS_SETTLING;
    bucket.put(cid, competition);
    const jackpotBucket = new Bucket(WARE_NAME, CompJackpots._$info.name, dbMgr);
    const jackpots = jackpotBucket.get<number, [CompJackpots]>(cid)[0];
    if (!jackpots) {
        result.reslutCode = DB_ERROR;

        return result;
    }
    let guessings: GuessingKey[];
    let loserguessings: GuessingKey[];
    let winnersJackpots: number;
    let losersJackpot: number;
    if (competition.result === RESULT_TEAM1_WIN) {
        guessings = jackpots.guessings1;
        loserguessings = jackpots.guessings2;
        winnersJackpots = jackpots.jackpot1;
        losersJackpot = jackpots.jackpot2;
    }
    if (competition.result === RESULT_TEAM2_WIN) {
        guessings = jackpots.guessings2;
        loserguessings = jackpots.guessings1;
        winnersJackpots = jackpots.jackpot2;
        losersJackpot = jackpots.jackpot1;
    }
    const guessingBucket = new Bucket(WARE_NAME, Guessing._$info.name, dbMgr);
    for (const guessingKey of guessings) {
        const guessing = guessingBucket.get<GuessingKey, [Guessing]>(guessingKey)[0];
        if (!guessing) continue;
        // 竞猜获胜的一方根据投注比例瓜分对方的奖金池
        const awardNum = Math.floor((guessing.num / winnersJackpots) * losersJackpot + guessing.num);
        const uid = guessingKey.uid;
        const accountMapBucket = new Bucket(WARE_NAME, UserAccMap._$info.name, dbMgr);
        const accountMap: UserAccMap = accountMapBucket.get(uid)[0];
        if (!accountMap) continue;
        const openid = Number(accountMap.openid);
        // 向钱包发放奖励
        add_guessing_st(openid, awardNum);
        // 写入用户竞猜的实际收益
        guessing.benefit = awardNum;
        guessingBucket.put(guessingKey, guessing);
    }
    for (const loserguessingKey of loserguessings) {
        const guessing = guessingBucket.get<GuessingKey, [Guessing]>(loserguessingKey)[0];
        if (!guessing) continue;
        // 写入用户竞猜的实际收益
        guessing.benefit = 0;
        guessingBucket.put(loserguessingKey, guessing);
    }
    // 竞猜结算状态更新为已结算
    competition.state = GUESSING_HAS_SETTLED;
    bucket.put(cid, competition);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};

// 获取一天的毫秒数
export const get_oneday_ms = ():number => {
    return (1000 * 60 * 60 * 24); 
};

// 时间戳转换
export const get_timestamps = (timeStr: string):number => {
    return ((new Date(timeStr)).valueOf() - 28800000);
};

// 向钱包账户添加竞猜奖励的ST
const add_guessing_st = (openid: number, stnum: number) => {
    const coinType = ST_WALLET_TYPE;
    const num = (stnum * ST_UNIT_NUM).toString();
    const time = (new Date()).valueOf();
    const oid = `${time}${openid}${randomInt(10000, 99999)}`;
    const r = oauth_send(WALLET_API_ALTER, { openid: openid, coinType: coinType, num: num, oid: oid });
    console.log('http response!!!!!!!!!!!!!!!!!!!!', r);
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.return_code === 1) {

            return json.num;
        } else {
            return;
        }
    } else {
        return;
    }
};