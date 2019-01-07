
/**
 * 接受后端推送事件
 */

import { SendMsg } from '../../../server/rpc/send_message.s';
import { subscribe } from './init';

// 监听topic
export const initReceive = (uid: number) => {
    subscribe(`send/${uid}`, SendMsg, (r: any) => {
        console.log('勋章弹窗！！！！！！！',r);
    });
};
