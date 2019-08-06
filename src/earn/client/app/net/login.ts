/**
 * 登录
 */
import { callGetHighTop, getStoreData } from '../../../../app/middleLayer/wrap';
import { CloudCurrencyType } from '../../../../app/publicLib/interface';
import { getCloudBalances } from '../../../../app/viewLogic/common';
import { loginWallet, logoutWallet } from '../../../../app/viewLogic/login';
import { UserInfo } from '../../../server/data/db/user.s';
import { SeriesDaysRes } from '../../../server/rpc/itemQuery.s';
import { getStore, initEarnStore, setStore } from '../store/memstore';
import { getSeriesLoginAwards } from '../utils/util';
import { disconnect, initClient } from './init';
import { initReceive } from './receive';
// tslint:disable-next-line:max-line-length
import { getAllGoods, getInvitedNumberOfPerson, getKTbalance, getLoginDays, getMedalest, getMiningCoinNum, getSTbalance, getTodayMineNum, getUserInfo, redemptionList } from './rpc';
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
    getAllGoods();
    getSTbalance();  // 获取ST余额
    getKTbalance();  // 获取KT余额   
    getUserInfo(openId, 'self'); // 获取用户信息
    getInvitedNumberOfPerson();  // 获取邀请成功人数
    getTodayMineNum();  // 获取今天已挖矿山数
    callGetHighTop(100).then((data) => {
        const mine = getStore('mine',{});
        mine.miningRank = data.miningRank;
        setStore('mine',mine);
    });
    getCloudBalances().then(cloudBalances => {
        const mine = getStore('mine',{});
        mine.miningKTnum = cloudBalances.get(CloudCurrencyType.KT);
        setStore('mine',mine);
    });
    // 获取签到奖励
    getLoginDays().then((r:SeriesDaysRes) => {
        setStore('flags/loginAwards',getSeriesLoginAwards(r.days));
        setStore('flags/signInDays',r.days);
    });
    getMiningCoinNum(); // 获取累积挖矿
    redemptionList();
    getStoreData('user/info').then(userInfo => {
        const medalest = []; 
        medalest.push(userInfo.acc_id);
        // 获取最高勋章
        getMedalest(medalest).then((medal:any) => {
            const data = medal.arr[0].medalType || '8001';
            const mine = getStore('mine',{});
            mine.miningMedalId = data;
            setStore('mine',mine);
        });
    });
   
    // // TODO 测试
    // const getShowArr = new getShowMedals();
    // const arr = ['807017', '425391'];
    // getShowArr.arr = arr;
    // clientRpcFunc(get_showMedals,getShowArr,(r:ShowMedalResArr) => {
    //     console.log('!!!!!!!!!!!!!!!!!test111r:', r);
    // });
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