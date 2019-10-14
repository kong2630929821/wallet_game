/**
 * 登录
 */
import { loginWallet, logoutWallet } from '../../../../app/net/login';
import { UserInfo } from '../../../server/data/db/user.s';
import { SeriesDaysRes } from '../../../server/rpc/itemQuery.s';
import { get_loginDays } from '../../../server/rpc/user.p';
import { getStore, initEarnStore, setStore } from '../store/memstore';
import { getSeriesLoginAwards } from '../utils/tools';
import { clientRpcFunc, disconnect, initClient } from './init';
import { initReceive } from './receive';
// tslint:disable-next-line:max-line-length
import { initSubscribeInfo } from './subscribedb';

// 登录成功
const loginSuccess = (openId:number,res:UserInfo) => {
    console.timeEnd('login');
    console.log('[活动] 登录成功');
    const userInfo = getStore('userInfo');
    setStore('userInfo',{ ...userInfo,...res });
    setStore('userInfo/uid',res.uid);
    setStore('userInfo/isLogin',true);
    initReceive(res.uid);
    initSubscribeInfo(); // 监听数据表变化 
    if (res.loginCount === 0) {  // 新用户第一次登录
        setStore('flags/firstLogin',true);
    }
    // 获取登录天数
    getLoginDays().then((r:SeriesDaysRes) => {
        setStore('flags/loginAwards',getSeriesLoginAwards(r.days));
        setStore('flags/signInDays',r.days);
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
 * 活动登录
 */
export const earnLogin = () => {
    (<any>window).pi_sdk.api.addAuthorizeListener({ appId:'11' },(err, result) => {
        console.log('earn addAuthorizeListener',err,JSON.stringify(result));
        initClient(result.openid,loginSuccess);
    });

    (<any>window).pi_sdk.api.authorize({ appId:'11' },(err, result) => {
        console.log('authorize',err,JSON.stringify(result));
        if (err === -1) {  // 没有账号
            // (<any>window).pi_sdk.api.openSignInPage();
        } else if (err === 0) { // 网络未连接
            console.log('网络未连接');
        } else {
            console.log('活动注册成功',result.openid);
            initClient(result.openid,loginSuccess);
        }
    });
};

// 登出
logoutWallet(() => {
    disconnect();
    initEarnStore();   // 清空活动数据
    setStore('flags/logout',true);
});