/**
 * 登录
 */
import { loginWallet, logoutWallet } from '../../../../app/net/login';
import { UserInfo } from '../../../server/data/db/user.s';
import { getStore, initEarnStore, setStore } from '../store/memstore';
import { disconnect, initClient } from './init';
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
};

// 登录
loginWallet('11',(openid:number) => {
    console.log('获取到openId ====',openid);
    initClient(openid,loginSuccess);
});

// 登出
logoutWallet(() => {
    disconnect();
    initEarnStore();   // 清空活动数据
    setStore('flags/logout',true);
});