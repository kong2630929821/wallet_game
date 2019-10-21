/**
 * rpc通信
 */

import { Result } from '../../../server/data/db/guessing.s';
import { OutgetRedBagConvert, queryRedBagDetail } from '../../../server/rpc/redBag.p';
import { clientRpcFunc } from './init';

/**
 * 获取红包兑换码
 */
export const getRedBagConvert = (rid: string) => {
    return new Promise((resolve,reject) => {
        clientRpcFunc(OutgetRedBagConvert,rid,(res:Result) => {
            console.log('[获取红包兑换码]OutgetRedBagConvert---------------', res);
            if (res && res.reslutCode === 1) {
                resolve(res);
            } else {
                reject(res);
            }
        });
    });
};

/**
 * 获取红包详情
 */
export const getQueryRedBagDetail = (rid:string) => {
    return new Promise((resolve,reject) => {
        clientRpcFunc(queryRedBagDetail,rid,(res:Result) => {
            console.log('[获取红包详情]queryRedBagDetail---------------', res);
            if (res && res.reslutCode === 1) {
                resolve(res);
            } else {
                reject(res);
            }
        });
    });
};