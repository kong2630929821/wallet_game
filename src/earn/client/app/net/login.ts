/**
 * 登录
 */
import { getStoreData } from '../../../../app/api/walletApi';
import { getOpenId } from '../../../../app/net/pull';
import { logoutWallet } from '../../../../app/utils/tools';
import { Result } from '../../../server/data/db/guessing.s';
import { UserInfo } from '../../../server/data/db/user.s';
import { SeriesDaysRes } from '../../../server/rpc/itemQuery.s';
import { bind_accID, get_loginDays } from '../../../server/rpc/user.p';
import { getStore, initEarnStore, setStore } from '../store/memstore';
import { getSeriesLoginAwards } from '../utils/tools';
import { getCompleteTask } from '../view/home/home';
import { clientRpcFunc, disconnect, initClient } from './init';
import { initReceive } from './receive';
// tslint:disable-next-line:max-line-length
import { initSubscribeInfo } from './subscribedb';

// 登录成功
const loginSuccess = (result:any,res:UserInfo) => {
    console.timeEnd('login');
    console.log('[活动] 登录成功',result);
    const userInfo = getStore('userInfo');
    setStore('userInfo',{ ...userInfo,...res });
    setStore('userInfo/uid',res.uid);
    setStore('userInfo/isLogin',true);
    initReceive(res.uid);
    initSubscribeInfo(); // 监听数据表变化 
    if (res.loginCount === 0) {  // 新用户第一次登录
        setStore('flags/firstLogin',true);
        // 绑定acc_Id
        getStoreData('user').then((r:any) => {
            clientRpcFunc(bind_accID,r.acc_id,(r:Result) => {
                if (r && r.reslutCode) {
                    console.log('绑定AccUID成功，accuid:',r);
                }
            });
        });
    }
    // 获取登录天数
    getLoginDays().then((r:SeriesDaysRes) => {
        setStore('flags/loginAwards',getSeriesLoginAwards(r.days));
        setStore('flags/signInDays',r.days);
    });
    // 判断是否绑定手机号码;
    if (!!result.phoneNumber) {
        getCompleteTask().then(r => {
            if (r.taskList[7].state === 0) {
                setStore('flags/firstBindPhone',true);
            }
        });
    }
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
export const earnLogin = (cb?:Function) => {
    getOpenId('11').then(r => {
        console.log('活动注册成功',r);
        initClient(r,loginSuccess);
        cb && cb();

    }).catch(err => {
        console.log('活动注册失败',err);
    });
};

// 登出
logoutWallet(() => {
    disconnect();
    initEarnStore();   // 清空活动数据
    setStore('flags/logout',true);
});