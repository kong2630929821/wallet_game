/**
 * rpc通信
 */
import { getOpenId } from '../../../../app/api/JSAPI';
import { getOneUserInfo } from '../../../../app/net/pull';
import { getStore as getWalletStore } from '../../../../app/store/memstore';
import { popNew } from '../../../../pi/ui/root';
import { GuessingReq, MainPageCompList, Result } from '../../../server/data/db/guessing.s';
import { AwardQuery, AwardResponse, InviteAwardRes, Items, MineKTTop, MineTop, MiningResponse, TodayMineNum } from '../../../server/data/db/item.s';
import { Achievements } from '../../../server/data/db/medal.s';
import { InviteNumTab, UserInfo } from '../../../server/data/db/user.s';
import { get_compJackpots, get_main_competitions, get_user_guessingInfo, start_guessing } from '../../../server/rpc/guessingCompetition.p';
import { get_invite_awards, get_inviteNum } from '../../../server/rpc/invite.p';
import { CoinQueryRes, MiningResult, SeriesDaysRes } from '../../../server/rpc/itemQuery.s';
import { get_miningKTTop, get_todayMineNum, mining, mining_result } from '../../../server/rpc/mining.p';
import { get_hasFree, get_KTNum, get_STNum, st_convert, st_rotary, st_treasurebox } from '../../../server/rpc/stParties.p';
import { bigint_test } from '../../../server/rpc/test.p';
import { Test } from '../../../server/rpc/test.s';
import { get_loginDays, login } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { award_query, get_achievements, get_showMedal, item_query, show_medal } from '../../../server/rpc/user_item.p';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { getStore, Invited, setStore } from '../store/memstore';
import { coinUnitchange, st2ST, ST2st, timestampFormat, timestampFormatWeek } from '../utils/tools';
import { canInviteAward, getPrizeInfo, getTeamCfg, showActError } from '../utils/util';
import { ActivityType, AwardSrcNum, CoinType } from '../xls/dataEnum.s';
import { HoeType } from '../xls/hoeType.s';
import { MineType } from '../xls/mineType.s';
import { UserType as LoginType } from './autologin';
import { clientRpcFunc, login as mqttLogin } from './init';

/**
 * 钱包用户登录活动
 */
export const goLoginActivity = () => {
    console.log('goLoginActivity -----------------');
    getOpenId('101',(r) => {        // 获取openid
        const openid = r.openid.toString();
        if (openid) {
            mqttLogin(LoginType.WALLET,openid,'sign',(res: UserInfo) => {
                setStore('userInfo',{ ...res });
                if (res.loginCount === 0) {  // 新用户第一次登录
                    popNew('earn-client-app-components-newUserLogin-newUserLogin');
                }
                getSTbalance();  // 获取ST余额
                getKTbalance();  // 获取KT余额   
                getUserInfo(parseInt(openid,10), 'self'); // 获取用户信息
                getInvitedNumberOfPerson().then((invite:Invited) => {
                    if (canInviteAward(invite)) {
                        popNew('earn-client-app-view-activity-inviteAward');
                    }
                });  // 获取邀请成功人数
                getTodayMineNum();
                getRankList();
            });
        }
            
    },(err) => {
        console.log('[活动]获取openid失败！！------------', err);
    });
};

/**
 * 用户登录
 */
export const loginActivity = (userid:string,sign:string,cb: (r: UserInfo) => void) => {
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = userid;
    walletLoginReq.sign = sign;
    userType.value = walletLoginReq;
    clientRpcFunc(login, userType,(res: UserInfo) => { // 活动登录
        setStore('userInfo',res);       
        console.log('[活动]登录成功！！--------------', res);
        cb(res);

    });
};

/**
 * 获取用户信息
 */
export const getUserInfo = async (openid: number, self?: string) => {
    const userInfo = await getOneUserInfo([openid], 1);
    if (self) {   // 钱包用户
        const walletUserInfo = getWalletStore('user/info');
        let activityUserInfo = getStore('userInfo');
        console.log('[活动]localUserInfo---------------', walletUserInfo);

        activityUserInfo = {
            ...activityUserInfo,
            avatar: walletUserInfo.avatar,
            name: walletUserInfo.nickName
        };
        setStore('userInfo', activityUserInfo);

        return activityUserInfo;
    } else {    // 其他用户
        return {
            avatar: userInfo.avatar,
            name: userInfo.nickName,
            tel: userInfo.phoneNumber
        };

    }
};

/**
 * 获取所有物品
 */
export const getAllGoods = () => {
    clientRpcFunc(item_query, null, (r: Items) => {
        console.log('getAllGoods ', r);
        setStore('goods', r.item);
    });
};

// 获取ST数量
export const getSTbalance = () => {
    clientRpcFunc(get_STNum, null, (r: CoinQueryRes) => {
        console.log('rpc-getSTbalance--ST余额---------------', r);
        if (r.resultNum === 1) {
            setStore('balance/ST', st2ST(r.num));
        } else {
            showActError(r.resultNum);
        }
    });
};
/**
 * 获取KT余额
 */
export const getKTbalance = () => {
    clientRpcFunc(get_KTNum, null, (r: CoinQueryRes) => {
        console.log('rpc-getSTbalance--KT余额---------------', r);
        if (r.resultNum === 1) {
            setStore('balance/KT', coinUnitchange(CoinType.KT,r.num));
        } else {
            showActError(r.resultNum);
        }
    });
};

/**
 * 准备挖矿
 */
export const readyMining = (hoeType:HoeType) => {
    return new Promise(resolve => {
        console.log('beginMining hoeType = ',hoeType);
        clientRpcFunc(mining, hoeType, (r: RandomSeedMgr) => {
            console.log('beginMining ',r);
            resolve(r);
        });
    });
};

/**
 * 开始挖矿
 */
export const startMining = (mineType:MineType,mineId:number,diggingCount:number) => {
    return new Promise((resolve,reject) => {
        const result = new MiningResult();
        result.itemType = mineType;
        result.mineNum = mineId;
        result.hit = diggingCount;
        console.log('startMining result = ',result);
        clientRpcFunc(mining_result, result, (r: MiningResponse) => {
            console.log('startMining MiningResponse = ',r);
            resolve(r);
            if (r.resultNum === 1) {
                resolve(r);
            } else {
                // showActError(r.resultNum);TODO
                reject(r);
            }
        });
    });
};

/**
 * 获取今天已挖矿山数
 */
export const getTodayMineNum = () => {
    const uid = getStore('userInfo/uid');
    clientRpcFunc(get_todayMineNum, uid, (r: TodayMineNum) => {
        console.log('getTodayMineNum TodayMineNum = ',r);
        setStore('mine/miningedNumber',r.mineNum);
    });
};
/**
 * 开宝箱
 */
export const openChest = (activityType: ActivityType) => {
    return new Promise((resolve, reject) => {
        const itemType = activityType;
        clientRpcFunc(st_treasurebox, itemType, (r: AwardResponse) => {
            console.log('[活动]rpc-openChest-resData-------------', r);
            if (r.resultNum === 1) {
                getSTbalance();
                resolve(r);
            } else {
                // showActError(r.resultNum);
                reject(r);
            }
        });
    });
};

/**
 * 转转盘
 */
export const openTurntable = (activityType: ActivityType) => {
    return new Promise((resolve, reject) => {
        const itemType = activityType;

        clientRpcFunc(st_rotary, itemType, (r: AwardResponse) => {
            console.log('[活动]rpc-openTurntable-resData---------------', r);
            if (r.resultNum === 1) {
                getSTbalance();
                resolve(r);
            } else {
                showActError(r.resultNum);
                reject(r);
            }
        });
    });
};

/**
 * 查询中奖、兑换记录
 * @param itype 记录种类
 */
export const getAwardHistory = (itype?: number) => {
    return new Promise((resolve, reject) => {
        const awardQuery = new AwardQuery();
        if (itype !== 0) {
            awardQuery.src = AwardSrcNum[itype];
        }

        clientRpcFunc(award_query, awardQuery, (r: any) => {
            console.log('[活动]rpc-getAwardHistory-resData---------------', r);
            const resData = [];
            r.awards.forEach(element => {
                const data = {
                    ...getPrizeInfo(element.awardType),
                    time: timestampFormat(element.time),
                    count: coinUnitchange(element.awardType,element.count)
                };
                resData.push(data);
            });
            resolve(resData);
        });
    });
};

/**
 * 获取挖矿排名
 */
export const getRankList = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_miningKTTop, 50, (r: MineKTTop) => {
            console.log('[活动]rpc-getRankList-resData---------------', r);
            if (r.resultNum === 1) {
                const mine = getStore('mine');
                mine.miningRank = r.myNum || 0;
                mine.miningKTnum = r.myKTNum || 0;
                setStore('mine',mine);
                resolve(r);
            } else {
                showActError(r.resultNum);
                reject(r);
            }
        });
    });
};

/**
 * 获取连续登录天数
 */
export const getLoginDays = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_loginDays, null, (r: SeriesDaysRes) => {
            console.log('[活动]rpc-getLoginDays---------------', r);
            if (r.resultNum === 1) {
                resolve(r);
            } else {
                // showActError(r.resultNum);TODO
                reject(r);
            }
        });
    });
};

/**
 * 获取拥有的成就勋章
 */
export const getACHVmedal = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_achievements, null, (r: Achievements) => {
            console.log('[活动]rpc-getACHVmedal--成就勋章---------------', r);
            // if (r.resultNum === 1) {
            setStore('ACHVmedals', r.achievements);
            resolve(r);
            // } else {
            //     showActError(r.resultNum);
            //     reject(r);
            // }
        });
    });
};

/**
 * 展示勋章
 * @param medalId 需要展示勋章的id 
 */
export const showMedal = (medalId:number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(show_medal, medalId, (r: Achievements) => {
            console.log('[活动]rpc-show_medal--挂出勋章---------------', r);
            // if (r.resultNum === 1) {
            resolve(r);
            // } else {
            //     showActError(r.resultNum);
            //     reject(r);
            // }
        });
    });
};

/**
 * 获取展示勋章
 */
export const getShowMedal = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_showMedal, null, (r: Achievements) => {
            console.log('[活动]rpc-show_medal--挂出勋章---------------', r);
            // if (r.resultNum === 1) {
            resolve(r);
            // } else {
            //     showActError(r.resultNum);
            //     reject(r);
            // }
        });
    });
};

/**
 * 兑换虚拟物品 
 * @param VirtualId 虚拟物品ID
 */
export const exchangeVirtual = (VirtualId:number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(st_convert, VirtualId, (r: SeriesDaysRes) => {
            console.log('[活动]rpc-exchangeVirtual---------------', r);
            if (r.resultNum === 1) {
                resolve(r);
            } else {
                showActError(r.resultNum);
                reject(r);
            }
        });
    });
};

/**
 * 获取兑换记录列表
 */
export const getExchangeHistory = () => {    // TODO
    return new Promise((resolve, reject) => {
        const awardQuery = new AwardQuery();
        awardQuery.src = AwardSrcNum[4];
        
        clientRpcFunc(award_query, awardQuery, (r: any) => {
            console.log('[活动]rpc-getExchangeHistory-resData---------------', r);
            resolve(r);
        });
    });
};

export const addST = () => {
    clientRpcFunc(bigint_test, null, (r: Test) => {
        console.log('[活动]rpc-bigint_test---------------', r);
        getSTbalance();
    });
};

/**
 * 获取已经邀请的人数
 */
export const getInvitedNumberOfPerson = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_inviteNum, null, (r: InviteNumTab) => {
            console.log('[活动]rpc-getInvitedNumberOfPerson---------------', r);
            const invite: Invited = {
                invitedNumberOfPerson: r.inviteNum,
                convertedInvitedAward: r.usedNum
            };
            setStore('invited',invite);
            resolve(invite);
        });
    }); 
};

/**
 * 兑换邀请奖励
 */
export const converInviteAwards = (index:number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_invite_awards, index, (r: InviteAwardRes) => {
            console.log('[活动]rpc-converInviteAwards---------------', r);
            resolve(r);
            getInvitedNumberOfPerson();
        });
    });
};

/**
 * 活动是否能每日第一次免费
 */
export const isFirstFree = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_hasFree, null, (r: any) => {
            console.log('[活动]rpc-isFirstFree---------------', r);
            // if (r.resultNum === 1) {
            resolve(r);
            // } else {
            //     showActError(r.resultNum);
            //     reject(r);
            // }
        });
    });
};

// ----------------------------------------------------------------------------------------------------------------------------------------
// 竞猜rpc通信;

/**
 * 获取所有比赛信息
 */
export const getAllGuess = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_main_competitions, null, (r: Result) => {
            console.log('[活动]rpc-getAllGuess---------------', r);
            if (r.reslutCode === 1) {
                const compList: MainPageCompList = JSON.parse(r.msg);
                const resData = [];
                compList.list.forEach(element => {
                    const data = {
                        cid: element.comp.cid,
                        matchType:element.comp.matchType,
                        matchName:element.comp.matchType,
                        team1: getTeamCfg(element.comp.team1).teamName,
                        team2: getTeamCfg(element.comp.team2).teamName,
                        time: timestampFormat(element.comp.time),
                        week: timestampFormatWeek(element.comp.time),
                        result: element.comp.result,
                        state: element.comp.state,
                        team1Num: coinUnitchange(CoinType.ST,element.team1num),
                        team2Num: coinUnitchange(CoinType.ST,element.team2num)
                    };
                    resData.push(data);
                });
                console.log('比赛信息!!!!!!!!：', resData);
                resolve(resData);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 下注竞猜
 */
export const betGuess = (cid:number,num:number,teamSide:number) => {
    return new Promise((resolve, reject) => {
        const guessingReq = new GuessingReq();
        guessingReq.cid = cid;
        guessingReq.num = ST2st(num);
        guessingReq.teamSide = teamSide;
        clientRpcFunc(start_guessing, guessingReq, (r: Result) => {
            console.log('[活动]rpc-betGuess---------------', r);
            if (r.reslutCode === 1) {
                console.log('下注成功!!!!!!!!：', r);
                resolve(r);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 获取我的竞猜
 */
export const getMyGuess = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_user_guessingInfo, null, (r: Result) => {
            console.log('[活动]rpc-getMyGuess---------------', r);
            if (r.reslutCode === 1) {
                const compList = JSON.parse(r.msg);
                const resData = [];
                compList.list.forEach(element => {
                    const data = {
                        guessData:{
                            cid: element.competition.cid,
                            team1: getTeamCfg(element.competition.team1).teamName,
                            team2: getTeamCfg(element.competition.team2).teamName,
                            time: timestampFormat(element.competition.time),
                            week: timestampFormatWeek(element.competition.time),
                            result: element.competition.result,
                            state: element.competition.state,
                            team1Num: coinUnitchange(CoinType.ST,element.team1num),
                            team2Num: coinUnitchange(CoinType.ST,element.team2num)
                        },
                        guessing:{
                            time:timestampFormat(element.guessing.time),
                            guessTeam:getTeamCfg(element.competition[`team${element.guessing.teamSide}`]).teamName,
                            guessSide:element.guessing.teamSide,
                            benefit:coinUnitchange(CoinType.ST,element.guessing.benefit),
                            guessSTnum:coinUnitchange(CoinType.ST,element.guessing.num)
                        }
                    };
                    resData.push(data);
                });
                console.log('获取我的竞猜成功!!!!!!!!：', compList);
                resolve(resData);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 获取单个竞猜奖池信息
 */
export const getOneGuessInfo = (cid:number) => {
    return new Promise((resolve, reject) => {

        clientRpcFunc(get_compJackpots, cid, (r: Result) => {
            console.log('[活动]rpc-getOneGuessInfo---------------', r);
            if (r.reslutCode === 1) {
                const data = JSON.parse(r.msg);
                const reaData = {
                    uid: data.uid,
                    team1Num : coinUnitchange(CoinType.ST,data.jackpot1),
                    team2Num : coinUnitchange(CoinType.ST,data.jackpot2)
                };
                resolve(reaData);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};
