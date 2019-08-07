
/**
 * 接受后端推送事件
 */

import { popNewMessage } from '../../../../app/utils/tools';
import { registerStoreData } from '../../../../app/viewLogic/common';
import { popModalBoxs } from '../../../../pi/ui/root';
import { SendMsg } from '../../../server/rpc/send_message.s';
import { getStore, register, setStore, unregister } from '../store/memstore';
import { subscribe } from './init';
import { getInviteAwards } from './rpc';

// 监听topic
export const initReceive = (uid: number) => {
    subscribe(`send/${uid}`, SendMsg, (r) => {
        // console.log('后端推送事件！！！！！！！！',r);
        switch (r.cmd) {
            case 'add_medal':   // 勋章提醒
                const func = ((res) => {
                    return () => {
                        // tslint:disable-next-line:radix
                        const medalId = parseInt(res.msg);
                        const mine = getStore('mine',{});
                        mine.miningMedalId = medalId;
                        setStore('mine',mine);
                        popModalBoxs('earn-client-app-view-components-newMedalAlert', {
                            medalId
                        });
                    };
                })(r);
                const startMining = getStore('flags').startMining;
                if (!startMining) {
                    func();
                } else {
                    delayFun = func;
                }
                console.log('勋章成就',r);
                break;
            case 'daily_first_login':
                const mess = JSON.parse(r.msg);
                // if (!getStore('flags').firstLogin) { // 注册账号第一天签到不从此处弹窗
                //     popModalBoxs('earn-client-app-components-noviceTaskAward-noviceTaskAward',{
                //         title:'签到奖励',
                //         awardType:mess.prop,
                //         awardNum:mess.count
                //     });
                // }
                break;
            default:
        }
    });
};

// 延迟弹框
let delayFun;

register('flags/startMining',(startMining:boolean) => {
    if (!startMining) {
        delayFun && delayFun();
        delayFun = undefined;
    }
});
// 邀请的好友成为真实用户的个数
registerStoreData('flags/invite_realUser',(r) => {
    console.log('邀请好友成为真实用户',r);
    const isLogin = getStore('userInfo/uid', 0) > 0;
    if (isLogin) {
        getInviteAwardsPop(r);
    } else {
        const isLogin = () => {
            getInviteAwardsPop(r);
            unregister('userInfo/uid',isLogin);
        };
        register('userInfo/uid',isLogin);
    }
    
});

const getInviteAwardsPop = (r) => {
    getInviteAwards(r).then((res:any) => {
        if (res && res.award.length > 0) {
            const awa = res.award[0];
            popModalBoxs('earn-client-app-components-noviceTaskAward-noviceTaskAward',{
                title: '邀请奖励',
                awardType: awa.awardType,
                awardNum: awa.count
            });
        } else {
            popNewMessage('获取奖励失败');
        }
    });
};