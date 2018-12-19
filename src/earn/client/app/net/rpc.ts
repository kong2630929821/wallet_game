/**
 * rpc通信
 */
import { Item_Enum, Items } from '../../../server/data/db/item.s';
import { UserInfo } from '../../../server/data/db/user.s';
import { ItemQuery } from '../../../server/rpc/itemQuery.s';
import { mining } from '../../../server/rpc/mining.p';
import { db_test } from '../../../server/rpc/test.p';
import { login as loginUser } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { getStore, setStore } from '../store/memstore';
import { HoeType } from '../xls/hoeType.s';
import { clientRpcFunc } from './init';

/**
 * 用户登录
 */
export const login = () => {
    // 钱包登录
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = 'test';
    walletLoginReq.sign = '';
    userType.value = walletLoginReq;

    clientRpcFunc(loginUser, userType, (r: UserInfo) => {
        console.log('login ',r);
    });
};

/**
 * 获取所有物品
 */
export const getAllGoods = () => {
    const uid = getStore('uid');
    clientRpcFunc(db_test, uid, (r: Items) => {
        console.log('getAllGoods ',r);
        setStore('goods',r.item);
    });
};

/**
 * 开始挖矿
 */
export const beginMining = (hoeType:HoeType) => {
    const itemQuery = new ItemQuery();
    itemQuery.uid = getStore('uid');
    itemQuery.enumType = Item_Enum.HOE;
    itemQuery.itemType = hoeType;
    console.log('beginMining itemQuery = ',itemQuery);
    clientRpcFunc(mining, itemQuery, (r: RandomSeedMgr) => {
        console.log('beginMining ',r);
    });
};