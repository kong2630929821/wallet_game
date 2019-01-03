/**
 * rpc通信
 */
import { getOpenId } from '../../../../app/api/JSAPI';
import { popNew } from '../../../../pi/ui/root';
import { AwardQuery, AwardResponse, Item, Items, MineTop, MiningResponse, TodayMineNum } from '../../../server/data/db/item.s';
import { Achievements } from '../../../server/data/db/medal.s';
import { UserInfo } from '../../../server/data/db/user.s';
import { MiningResult, SeriesDaysRes } from '../../../server/rpc/itemQuery.s';
import { get_miningKTTop, get_todayMineNum, mining, mining_result } from '../../../server/rpc/mining.p';
import { item_addticket } from '../../../server/rpc/test.p';
import { ticket_compose, ticket_rotary, ticket_treasurebox } from '../../../server/rpc/ticket.p';
import { get_loginDays, login } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { award_query, get_achievements, item_query } from '../../../server/rpc/user_item.p';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { getStore, setStore } from '../store/memstore';
import { timestampFormat } from '../utils/tools';
import { getPrizeInfo, showActError } from '../utils/util';
import { AwardSrcNum, TicketType } from '../xls/dataEnum.s';
import { HoeType } from '../xls/hoeType.s';
import { MineType } from '../xls/mineType.s';
import { clientRpcFunc } from './init';

/**
 * 钱包用户登录活动
 */
export const loginActivity = () => {
    return new Promise((resolve, reject) => {
        const userType = new UserType();
        userType.enum_type = UserType_Enum.WALLET;
        const walletLoginReq = new WalletLoginReq();
        getOpenId('1001',(r) => {
            walletLoginReq.openid = r.openid;
            walletLoginReq.sign = '';
            userType.value = walletLoginReq;
            clientRpcFunc(login, userType, (r: UserInfo) => {
                console.log('活动登录成功！！--------------', r);
                if (r.loginCount === 0) {
                    popNew('earn-client-app-view-component-newUserLogin');
                }
                setStore('userInfo',r);
                resolve(r);
            });
        },(err) => {
            console.log('活动登录失败！！--------------', err);
        });
    });
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
export const openChest = (ticketType: TicketType) => {
    return new Promise((resolve, reject) => {
        const itemType = ticketType;
        clientRpcFunc(ticket_treasurebox, itemType, (r: AwardResponse) => {
            console.log('rpc-openChest-resData-------------', r);
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
 * 转转盘
 */
export const openTurntable = (ticketType: TicketType) => {
    return new Promise((resolve, reject) => {
        const itemType = ticketType;

        clientRpcFunc(ticket_rotary, itemType, (r: AwardResponse) => {
            console.log('rpc-openTurntable-resData---------------', r);
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
 * 合成奖券
 */
export const compoundTicket = (ticketType: TicketType) => {
    return new Promise((resolve, reject) => {
        const itemType = ticketType;

        clientRpcFunc(ticket_compose, itemType, (r: AwardResponse) => {
            console.log('rpc-compoundTicket-resData---------------', r);
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
 * 增加奖券
 * @param num 增加数量
 */
export const addTicket = (num: number) => {
    clientRpcFunc(item_addticket, num, (r: Item) => {
        console.log('addTicket',r);
        
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
            console.log('rpc-getAwardHistory-resData---------------', r);
            const resData = [];
            r.awards.forEach(element => {
                const data = {
                    ...getPrizeInfo(element.awardType),
                    time: timestampFormat(element.time),
                    count: element.count
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
            console.log('rpc-getRankList-resData---------------', r);
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
            console.log('rpc-getLoginDays---------------', r);
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
            console.log('rpc-getACHVmedal--成就勋章---------------', r);
            // if (r.resultNum === 1) {
            setStore('ACHVmedals',r.achievements);
            resolve(r);
            // } else {
            //     showActError(r.resultNum);
            //     reject(r);
            // }
        });
    });
};