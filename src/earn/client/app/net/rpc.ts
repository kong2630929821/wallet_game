/**
 * rpc通信
 */
import { Items } from '../../../server/data/db/item.s';
import { UserInfo } from '../../../server/data/db/user.s';
import { db_test } from '../../../server/rpc/test.p';
import { login as loginUser } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { getStore, setStore } from '../store/memstore';
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