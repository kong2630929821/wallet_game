/**
 * rpc通信
 */
import { Item_Enum, Items, MiningResponse, Item, AwardQuery } from '../../../server/data/db/item.s';
import { ItemQuery, MiningResult } from '../../../server/rpc/itemQuery.s';
import { mining, mining_result } from '../../../server/rpc/mining.p';
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

/**
 * 获取所有物品
 */
export const getAllGoods = () => {
    const uid = getStore('uid');
    clientRpcFunc(item_query, uid, (r: Items) => {
        console.log('getAllGoods ', r);
        setStore('goods', r.item);
    });
};

/**
 * 准备挖矿
 */
export const readyMining = (hoeType: HoeType) => {
    return new Promise(resolve => {
        const itemQuery = new ItemQuery();
        itemQuery.uid = getStore('uid');
        itemQuery.enumType = Item_Enum.HOE;
        itemQuery.itemType = hoeType;
        console.log('beginMining itemQuery = ', itemQuery);
        clientRpcFunc(mining, itemQuery, (r: RandomSeedMgr) => {
            console.log('beginMining ', r);
            resolve(r);
        });
    });
};

/**
 * 开始挖矿
 */
export const startMining = (mineType: MineType, mineIndex: number, diggingCount: number) => {
    return new Promise(resolve => {
        const result = new MiningResult();
        const itemQuery = new ItemQuery();
        itemQuery.uid = getStore('uid');
        itemQuery.enumType = Item_Enum.MINE;
        itemQuery.itemType = mineType;
        result.itemQuery = itemQuery;
        result.mineNum = mineIndex;
        result.hit = diggingCount;
        console.log('startMining result = ', result);
        clientRpcFunc(mining_result, result, (r: MiningResponse) => {
            console.log('startMining MiningResponse = ', r);
            resolve(r);
        });
    });
};


/**
 * 开宝箱
 */
export const openChest = (ticketType: TicketType) => {
    return new Promise((resolve, reject) => {
        const itemQuery = new ItemQuery();
        itemQuery.uid = getStore('uid');
        itemQuery.enumType = Item_Enum.TICKET;
        itemQuery.itemType = ticketType;

        clientRpcFunc(ticket_treasurebox, itemQuery, (r: Item) => {
            console.log('rpc-openChest-resData-------------', r);

            if (r) {
                getAllGoods();
                resolve(r);
            } else {
                reject(r);
            }
        });
    })
}


/**
 * 转转盘
 */
export const openTurntable = (ticketType: TicketType) => {
    return new Promise(resolve => {
        const itemQuery = new ItemQuery();
        itemQuery.uid = getStore('uid');
        itemQuery.enumType = Item_Enum.TICKET;
        itemQuery.itemType = ticketType;

        clientRpcFunc(ticket_rotary, itemQuery, (r: Item) => {
            console.log('openTurntable =', r);
            resolve(r);
        });
    })
}

/**
 * 合成奖券
 */
export const compoundTicket = (ticketType: TicketType) => {
    return new Promise((resolve, reject) => {
        const itemQuery = new ItemQuery();
        itemQuery.uid = getStore('uid');
        itemQuery.enumType = Item_Enum.TICKET;
        itemQuery.itemType = ticketType;
        console.log(itemQuery);

        clientRpcFunc(ticket_compose, itemQuery, (r: Item) => {
            console.log('compoundTicket =', r);
            resolve(r);
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
        awardQuery.uid = getStore('uid');
        if(type!==0){
            awardQuery.src = AwardSrcNum[type];
        }

        clientRpcFunc(award_query, awardQuery, (r: any) => {
            const resData = [];
            r.awards.forEach(element => {
                let data = {
                    ...getPrizeInfo(element.prize.value.num),
                    time:timestampFormat(element.time),
                    count:element.prize.value.count
                }
                resData.push(data);
            });
            resolve(resData);
        });
    })
}


