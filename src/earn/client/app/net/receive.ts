
/**
 * 接受后端推送事件
 */

import { popNew } from '../../../../pi/ui/root';
import { SendMsg } from '../../../server/rpc/send_message.s';
import { getStore, register } from '../store/memstore';
import { MedalType } from '../view/medal/medalShow';
import { subscribe } from './init';

// 监听topic
export const initReceive = (uid: number) => {
    subscribe(`send/${uid}`, SendMsg, (r) => {
        console.log('后端推送事件！！！！！！！！',r);
        switch (r.cmd) {
            case 'add_medal':   // 勋章提醒
                const func = ((res) => {
                    return () => {
                        popNew('earn-client-app-view-components-newMedalAlert', {
                            // tslint:disable-next-line:radix
                            medalId:parseInt(res.msg),
                            medalType:MedalType.rankMedal
                        });
                    };
                })(r);
                const startMining = getStore('flags').startMining;
                if (!startMining) {
                    func();
                } else {
                    delayFun = func;
                }
                
                break;
            case 'daily_first_login':
                console.log('!!!!!!!!!!!!!!!!!!!!!!daily_first_login',r);
                let name = '铁镐';
                if (r.msg.props === 2002) name = '银镐';
                if (r.msg.props === 2003) name = '金镐';
                
                popNew('earn-client-app-components-noviceTaskAward-noviceTaskAward',{
                    title:'签到奖励',
                    awardImg:`${r.msg.prop}.jpg`,
                    awardName:name,
                    awardNum:1
                });
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