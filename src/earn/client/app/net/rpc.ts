/**
 * rpc通信
 */
import { Item_Enum, Items, MiningResponse, Item, AwardQuery, AwardResponse } from '../../../server/data/db/item.s';
import { MiningResult } from '../../../server/rpc/itemQuery.s';
import { mining, mining_result, get_miningKTTop } from '../../../server/rpc/mining.p';
import { item_query, award_query } from '../../../server/rpc/user_item.p';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { getStore, setStore } from '../store/memstore';
import { HoeType } from '../xls/hoeType.s';
import { MineType } from '../xls/mineType.s';
import { clientRpcFunc } from './init';
import { ticket_treasurebox, ticket_rotary, ticket_compose } from '../../../server/rpc/ticket.p';
import { TicketType, AwardSrcNum } from '../xls/dataEnum.s';
import { item_addticket } from '../../../server/rpc/test.p';
import { getPrizeInfo } from '../utils/util';
import { timestampFormat } from '../utils/tools';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { login } from '../../../server/rpc/user.p';
import { UserInfo } from '../../../server/data/db/user.s';
import { showError } from '../../../../app/utils/toolMessages';


/**
 * 钱包用户登录活动
 */
export const loginActivity = () => {
    return new Promise((resolve, reject) => {
        const userType = new UserType();
        userType.enum_type = UserType_Enum.WALLET;
        const walletLoginReq = new WalletLoginReq();
        walletLoginReq.openid = 'zx';
        walletLoginReq.sign = '';
        userType.value = walletLoginReq;

        clientRpcFunc(login, userType, (r: UserInfo) => {
            console.log('活动登录成功！！--------------', r);
            resolve(r);
        });
    })
}


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
        const itemQuery = new ItemQuery();
        itemQuery.uid = getStore('uid');
        itemQuery.enumType = Item_Enum.HOE;
        itemQuery.itemType = hoeType;
        console.log('beginMining itemQuery = ',itemQuery);
        clientRpcFunc(mining, itemQuery, (r: RandomSeedMgr) => {
            console.log('beginMining ',r);
            getAllGoods();
            resolve(r);
        });
    });
};

/**
 * 开始挖矿
 */
export const startMining = (mineType:MineType,mineIndex:number,diggingCount:number) => {
    return new Promise(resolve => {
        const result = new MiningResult();
        const itemQuery = new ItemQuery();
        itemQuery.uid = getStore('uid');
        itemQuery.enumType = Item_Enum.MINE;
        itemQuery.itemType = mineType;
        result.itemQuery = itemQuery;
        result.mineNum = mineIndex;
        result.hit = diggingCount;
        console.log('startMining result = ',result);
        clientRpcFunc(mining_result, result, (r: MiningResponse) => {
            console.log('startMining MiningResponse = ',r);
            resolve(r);
        });
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
                getAllGoods();
                resolve(r);
            } else {
                // showActError(r.resultNum);TODO
                reject(r);
            }
        });
    })
}


/**
 * 转转盘
 */
export const openTurntable = (ticketType: TicketType) => {
    return new Promise((resolve, reject) => {
        const itemType = ticketType;

        clientRpcFunc(ticket_rotary, itemType, (r: AwardResponse) => {
            console.log('rpc-openTurntable-resData---------------', r);
            if (r.resultNum === 1) {
                getAllGoods();
                resolve(r);
            } else {
                // showActError(r.resultNum);TODO
                reject(r);
            }
        });
    })
}

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
    })
}

/**
 * 增加奖券
 * @param num 增加数量
 */
export const addTicket = (num: number) => {
    clientRpcFunc(item_addticket, num, (r: Item) => {
        getAllGoods();
    });
}

/**
 * 查询中奖、兑换记录
 * @param type 记录种类
 */
export const getAwardHistory = (type?: number) => {
    return new Promise((resolve, reject) => {
        const awardQuery = new AwardQuery();
        if (type !== 0) {
            awardQuery.src = AwardSrcNum[type];
        }

        clientRpcFunc(award_query, awardQuery, (r: any) => {
            console.log('rpc-getAwardHistory-resData---------------', r);
            const resData = [];
            r.awards.forEach(element => {
                let data = {
                    ...getPrizeInfo(element.awardType),
                    time: timestampFormat(element.time),
                    count: element.count
                }
                resData.push(data);
            });
            resolve(resData);
        });
    })
}

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
                // showActError(r.resultNum);TODO
                reject(r);
            }
        });
    })
}




