/**
 * rpc通信
 */
import { getOpenId } from '../../../../app/api/JSAPI';
import { getOneUserInfo } from '../../../../app/net/pull';
import { getStore as getWalletStore } from '../../../../app/store/memstore';
import { popNew } from '../../../../pi/ui/root';
import { AwardQuery, AwardResponse, InviteAwardRes, Items, MineTop, MiningResponse, TodayMineNum } from '../../../server/data/db/item.s';
import { Achievements } from '../../../server/data/db/medal.s';
import { InviteNumTab, UserInfo } from '../../../server/data/db/user.s';
import { get_invite_awards, get_inviteNum } from '../../../server/rpc/invite.p';
import { CoinQueryRes, MiningResult, SeriesDaysRes } from '../../../server/rpc/itemQuery.s';
import { get_miningKTTop, get_todayMineNum, mining, mining_result } from '../../../server/rpc/mining.p';
import { get_hasFree, get_STNum, st_convert, st_rotary, st_treasurebox } from '../../../server/rpc/stParties.p';
import { bigint_test } from '../../../server/rpc/test.p';
import { Test } from '../../../server/rpc/test.s';
import { get_loginDays, login } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { award_query, get_achievements, item_query } from '../../../server/rpc/user_item.p';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { getStore, Invited, setStore } from '../store/memstore';
import { coinUnitchange, st2ST, timestampFormat } from '../utils/tools';
import { getPrizeInfo, showActError } from '../utils/util';
import { ActivityType, AwardSrcNum } from '../xls/dataEnum.s';
import { HoeType } from '../xls/hoeType.s';
import { MineType } from '../xls/mineType.s';
import { UserType as LoginType } from './autologin';
import { clientRpcFunc, login as mqttLogin } from './init';

/**
 * 钱包用户登录活动
 */
export const goLoginActivity = () => {
    getOpenId('101', (r) => {        // 获取openid
        const openid = r.openid.toString();
        if (openid) {
            mqttLogin(LoginType.WALLET, openid, 'sign', (res: UserInfo) => {
                if (res.loginCount === 0) {  // 新用户第一次登录
                    popNew('earn-client-app-view-components-newUserLogin');
                }
                getSTbalance();  // 获取ST余额   
                // tslint:disable-next-line:radix
                getUserInfo(parseInt(openid), 'self'); // 获取用户信息
            });
        }

    }, (err) => {
        console.log('[活动]获取openid失败！！------------', err);
    });
};

export const loginActivity = (userid: string, sign: string, cb: (r: UserInfo) => void) => {
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = userid;
    walletLoginReq.sign = sign;
    userType.value = walletLoginReq;
    clientRpcFunc(login, userType, (res: UserInfo) => { // 活动登录
        setStore('userInfo', res);
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
 * 准备挖矿
 */
export const readyMining = (hoeType: HoeType) => {
    return new Promise(resolve => {
        console.log('beginMining hoeType = ', hoeType);
        clientRpcFunc(mining, hoeType, (r: RandomSeedMgr) => {
            console.log('beginMining ', r);
            resolve(r);
        });
    });
};

/**
 * 开始挖矿
 */
export const startMining = (mineType: MineType, mineId: number, diggingCount: number) => {
    return new Promise((resolve, reject) => {
        const result = new MiningResult();
        result.itemType = mineType;
        result.mineNum = mineId;
        result.hit = diggingCount;
        console.log('startMining result = ', result);
        clientRpcFunc(mining_result, result, (r: MiningResponse) => {
            console.log('startMining MiningResponse = ', r);
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
        console.log('getTodayMineNum TodayMineNum = ', r);
        setStore('mine/miningedNumber', r.mineNum);
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
                showActError(r.resultNum);
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
                    count: coinUnitchange(element.awardType, element.count)
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
        clientRpcFunc(get_miningKTTop, 50, (r: MineTop) => {
            console.log('[活动]rpc-getRankList-resData---------------', r);
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
 * 兑换虚拟物品 
 * @param VirtualId 虚拟物品ID
 */
export const exchangeVirtual = (VirtualId: number) => {
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
    clientRpcFunc(get_inviteNum, null, (r: InviteNumTab) => {
        console.log('[活动]rpc-getInvitedNumberOfPerson---------------', r);
        const invite: Invited = {
            invitedNumberOfPerson: r.inviteNum,
            convertedInvitedAward: r.usedNum
        };
        setStore('invited', invite);
    });
};

/**
 * 兑换邀请奖励
 */
export const converInviteAwards = (index: number) => {
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