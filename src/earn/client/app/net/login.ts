/**
 * 登录
 */
import { loginWallet, logoutWallet } from '../../../../app/net/login';
import { piRequire } from '../../../../app/utils/commonjsTools';
import { popNew } from '../../../../pi/ui/root';
import { UserInfo } from '../../../server/data/db/user.s';
import { getStore, initEarnStore, Invited, setStore } from '../store/memstore';
import { disconnect, initClient } from './init';
import { initReceive } from './receive';

// 登录成功
const loginSuccess = (openId:number,res:UserInfo) => {
    console.log('[活动] 登录成功');
    setStore('userInfo/isLogin',true);
    const userInfo = getStore('userInfo');
    setStore('userInfo',{ ...userInfo,...res });
    setStore('userInfo/uid',res.uid);
    if (res.loginCount === 0) {  // 新用户第一次登录
        setStore('flags/firstLogin',true);
    }

    initReceive(res.uid);

    // 监听数据表变化 
    piRequire(['earn/client/app/net/subscribedb']).then(mods => {
        mods[0].initSubscribeInfo(); 
    });
    
    piRequire(['earn/client/app/net/rpc']).then(mods => {
        const rpcMod = mods[0];
        rpcMod.getSTbalance();  // 获取ST余额
        rpcMod.getKTbalance();  // 获取KT余额   
        rpcMod.getUserInfo(openId, 'self'); // 获取用户信息
        rpcMod.getInvitedNumberOfPerson().then((invite:Invited) => {
            piRequire(['earn/client/app/utils/util']).then(mods => {
                if (mods[0].canInviteAward(invite)) {
                    popNew('earn-client-app-view-activity-inviteAward');
                }
            });
            
        });  // 获取邀请成功人数
        rpcMod.getTodayMineNum();  // 获取今天已挖矿山数
        rpcMod.getRankList();   // 获取挖矿排名
        rpcMod.getMiningCoinNum(); // 获取累积挖矿
    });
    
};

// 登录
loginWallet('101',(openid:number) => {
    console.log('获取到openId ====',openid);
    initClient(openid,loginSuccess);
});

// 登出
logoutWallet(() => {
    disconnect();
    initEarnStore();
    setStore('flags/logout',true);
});