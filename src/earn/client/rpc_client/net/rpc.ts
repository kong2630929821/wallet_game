/**
 * rpc通信
 */

import { Result } from '../../../server/data/db/guessing.s';
import { OutgetRedBagConvert } from '../../../server/rpc/redBag.p';
import { clientRpcFunc } from './init';

/**
 * 
 */
export const handle = () => {
    console.log('!!!!!!!!!!!!!!!!handle!!!!!!');
    // 获取uri参数
    const uri = window.location.search;
    // 获取参数 TODO
    getRedBagConvert('xxxx');
};

/**
 * 获取红包兑换码
 */
export const getRedBagConvert = (rid: string) => {
    clientRpcFunc(OutgetRedBagConvert , rid, (res: Result) => {
        console.log('!!!!!!!!!!!!!!!redBagConvert:', res);

        return res;
    });
};