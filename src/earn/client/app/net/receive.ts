
/**
 * 接受后端推送事件
 */

import { popNew } from '../../../../pi/ui/root';
import { SendMsg } from '../../../server/rpc/send_message.s';
import { MedalType } from '../view/medal/medalShow';
import { subscribe } from './init';

// 监听topic
export const initReceive = (uid: number) => {
    subscribe(`send/${uid}`, SendMsg, (r: any) => {
        console.log('勋章弹窗！！！！！！！',r);
        popNew('earn-client-app-view-medal-newMedalAlert', {
            // tslint:disable-next-line:radix
            medalId:parseInt(r.msg),
            medalType:MedalType.rankMedal
        });
    });
};