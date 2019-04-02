/**
 * 登录
 */
import { loginWallet, logoutWallet } from '../../../../app/net/login';
import { popModalBoxs } from '../../../../pi/ui/root';
import { UserInfo } from '../../../server/data/db/user.s';
import { getStore, initEarnStore, setStore } from '../store/memstore';
import { disconnect, initClient } from './init';
import { initReceive } from './receive';
import { getInviteAwards, getInvitedNumberOfPerson, getKTbalance, getMiningCoinNum, getRankList, getSTbalance, getTodayMineNum, getUserInfo, redemptionList } from './rpc';
import { initSubscribeInfo } from './subscribedb';

// 登录成功
const loginSuccess = (openId:number,res:UserInfo) => {
    console.timeEnd('login');
    console.log('[活动] 登录成功');
    setStore('userInfo/isLogin',true);
    const userInfo = getStore('userInfo');
    setStore('userInfo',{ ...userInfo,...res });
    setStore('userInfo/uid',res.uid);
    initReceive(res.uid);
    initSubscribeInfo(); // 监听数据表变化 
    if (res.loginCount === 0) {  // 新用户第一次登录
        setStore('flags/firstLogin',true);
    }
    getSTbalance();  // 获取ST余额
    getKTbalance();  // 获取KT余额   
    getUserInfo(openId, 'self'); // 获取用户信息
    getInvitedNumberOfPerson();  // 获取邀请成功人数
    getTodayMineNum();  // 获取今天已挖矿山数
    getRankList();   // 获取挖矿排名
    getMiningCoinNum(); // 获取累积挖矿
    redemptionList();
};

// 登录
loginWallet('11',(openid:number) => {
    console.log('获取到openId ====',openid);
    initClient(openid,loginSuccess);
});

// 登出
logoutWallet(() => {
    disconnect();
    initEarnStore();
    setStore('flags/logout',true);
});