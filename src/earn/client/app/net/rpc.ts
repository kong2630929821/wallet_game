/**
 * rpc通信
 */
import { getOneUserInfo } from '../../../../app/net/pull';
import { getStore as walletGetStore } from '../../../../app/store/memstore';
import { MainPageCompList, Result } from '../../../server/data/db/guessing.s';
import { Award, AwardQuery, InviteAwardRes, Items, MineKTTop, MiningResponse, TodayMineNum } from '../../../server/data/db/item.s';
import { Achievements, getShowMedals, ShowMedalResArr } from '../../../server/data/db/medal.s';
import { InviteNumTab, UserInfo } from '../../../server/data/db/user.s';
// tslint:disable-next-line:max-line-length
import { get_compJackpots, get_main_competitions, get_user_guessingInfo, guessing_pay_query } from '../../../server/rpc/guessingCompetition.p';
import { get_invite_awards, get_inviteNum, getInviteAward } from '../../../server/rpc/invite.p';
import { ChatIDs, CoinQueryRes, MiningResult, SeriesDaysRes } from '../../../server/rpc/itemQuery.s';
// tslint:disable-next-line:max-line-length
import { get_friends_KTTop, get_miningCoinNum, get_miningKTTop, get_todayMineNum, mining, mining_result } from '../../../server/rpc/mining.p';
import { get_convert_list, get_KTNum, get_STNum } from '../../../server/rpc/stParties.p';
import { bigint_test } from '../../../server/rpc/test.p';
import { get_loginDays, login } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
// tslint:disable-next-line:max-line-length
import { award_query, get_achievements, get_ad_award, get_medals, get_showMedal, get_showMedals, item_query, show_medal, task_query } from '../../../server/rpc/user_item.p';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { getStore, Invited, setStore } from '../store/memstore';
import { st2ST, timestampFormat, timestampFormatWeek } from '../utils/tools';
import { coinUnitchange, getMacthTypeCfg, getPrizeInfo, getTeamCfg, showActError } from '../utils/util';
import { AwardSrcNum, CoinType } from '../xls/dataEnum.s';
import { HoeType } from '../xls/hoeType.s';
import { MineType } from '../xls/mineType.s';
import { clientRpcFunc } from './init';

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
        cb(res);
    });
};

/**
 * 获取用户信息
 */
export const getUserInfo = async (openid: number, self?: string) => {
    const userInfo = await getOneUserInfo([openid], 1);
    if (self) {   // 钱包用户
        const walletUserInfo = await walletGetStore('user/info');
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

// 获取兑换列表
export const redemptionList = () => {
    clientRpcFunc(get_convert_list,null,(r:any) => {
        
        const list = JSON.parse(r.msg).list;
        console.log('兑换物品的列表--------------',r);
        if (r.reslutCode === 1) {
            setStore('redemption',list);
        }
    });
};
// 获取ST数量
export const getSTbalance = () => {
    clientRpcFunc(get_STNum, null, (r: CoinQueryRes) => {
        console.log('rpc-getSTbalance--ST余额---------------', r);
        if (r.resultNum === 1) {
            setStore('balance/ST', st2ST(r.num) || 0);
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
            setStore('balance/KT', coinUnitchange(CoinType.KT,r.num) || 0);
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
            if (r.awards) {
                r.awards.forEach(element => {
                    const data = {
                        ...element,
                        ...getPrizeInfo(element.awardType),
                        time: timestampFormat(element.time),
                        count: coinUnitchange(element.awardType,element.count)
                    };
                    resData.push(data);
                });
            }
           
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
                mine.miningMedalId = r.myMedal;
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
 * 获取挖矿排名
 */
export const getFriendsKTTop = (chatIDs:ChatIDs) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_friends_KTTop, chatIDs, (r: MineKTTop) => {
            console.log('[活动]rpc-getFriendsKTTop-resData---------------', r);
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
    clientRpcFunc(bigint_test, null, (r) => {
        console.log('[活动]rpc-bigint_test---------------', r);
        getSTbalance();
    });
};

/**
 * 获取已经邀请成功的人数
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
 * 邀请好友成功的奖励
 */
export const getInviteAwards = (index:number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_invite_awards, Number(index), (r: InviteAwardRes) => {
            console.log('[活动]rpc-getInviteAwards---------------',index, r);
            resolve(r);
            getInvitedNumberOfPerson();
        });
    });
};

/**
 * 输入兑换码获得奖励
 */
export const convertAwards = (code:string) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(getInviteAward, code, (r: InviteAwardRes) => {
            console.log('[活动]rpc-convertAwards---------------', r);
            resolve(r);
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
                        matchName: getMacthTypeCfg(element.comp.matchType).season + getMacthTypeCfg(element.comp.matchType).name,
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
 * 竞猜下注成功后查询
 * @param order 订单信息
 */
export const queryBetGuess = (oid:string) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(guessing_pay_query, oid, (r: Result) => {
            console.log('[活动]rpc-queryBetGuess---------------', r);
            if (r.reslutCode === 1) {
                const msg = JSON.parse(r.msg);
                resolve(msg);
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
                            matchType:element.competition.matchType,
                            matchName: getMacthTypeCfg(element.competition.matchType).season + getMacthTypeCfg(element.competition.matchType).name,
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
                            benefit:element.guessing.benefit,
                            guessSTnum:element.guessing.num
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

/**
 * 获取广告奖励
 */
export const getAdRewards = (adType:number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_ad_award, adType, (r: Result) => {
            console.log('[活动]rpc-getAdRewards---------------', r);
            if (r.reslutCode === 1) {
                const award:Award = JSON.parse(r.msg);
                resolve(award);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 获取累计挖矿数
 */
export const getMiningCoinNum = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_miningCoinNum, null, (r: Result) => {
            console.log('[活动]rpc-getMiningCoinNum---------------', r);
            if (r.reslutCode === 1) {
                const numbers = JSON.parse(r.msg);
                const mine = getStore('mine');
                mine.miningBTCnum = coinUnitchange(CoinType.BTC,numbers[0]);
                mine.miningETHnum = coinUnitchange(CoinType.ETH,numbers[1]);
                mine.miningSTnum = coinUnitchange(CoinType.ST,numbers[2]);
                // mine.miningKTnum = coinUnitchange(CoinType.KT,numbers[3]);
                setStore('mine',mine);
                resolve(numbers);
            } else {
                reject(r);
            }
        });
    });
};

/**
 * 获取勋章列表
 * @param arr acc_id数组
 */
export const getMedalest = (arr:any) => {
    const getShowArr = new getShowMedals();
    getShowArr.arr = arr;

    // tslint:disable-next-line:promise-must-complete
    return new Promise((resolve,reject) => {
        clientRpcFunc(get_showMedals,getShowArr,(res:ShowMedalResArr) => {
            console.log('[最高勋章]get_showMedals---------------', res);
            if (res && res.resultNum === 1) {
                resolve(res);
            } else {
                reject(res);
            }
            
        });
    });
};

// 获取全部勋章
export const getAllMedal = () => {
    return new Promise((resolve,reject) => {
        clientRpcFunc(get_medals,'',(r:any) => {
            console.log('全部勋章',r);
            resolve(r);
        });
    });
};
