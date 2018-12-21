/**
 * rpc通信
 */
import { Item_Enum, Items, MiningResponse, TodayMineNum } from '../../../server/data/db/item.s';
import { ItemQuery, MiningResult } from '../../../server/rpc/itemQuery.s';
import { mining, mining_result } from '../../../server/rpc/mining.p';
import { get_todayMineNum, item_query } from '../../../server/rpc/user_item.p';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { getStore, setStore } from '../store/memstore';
import { HoeType } from '../xls/hoeType.s';
import { MineType } from '../xls/mineType.s';
import { clientRpcFunc } from './init';

/**
 * 获取所有物品
 */
export const getAllGoods = () => {
    const uid = getStore('uid');
    clientRpcFunc(item_query, uid, (r: Items) => {
        console.log('getAllGoods ',r);
        setStore('mine/goods',r.item);
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

export const getTodayMineNum = () => {
    const uid = getStore('uid');
    clientRpcFunc(get_todayMineNum, uid, (r: TodayMineNum) => {
        console.log('getTodayMineNum TodayMineNum = ',r);
        setStore('mine/miningedNumber',r.mineNum);
    });
};