/**
 * rpc通信
 */

import { erlangLogicIp, erlangLogicPayPort, sourceIp } from '../../../../app/public/config';
import { piFetch } from '../../../../app/utils/pureUtils';
import { Result } from '../../../server/data/db/guessing.s';
import { OutgetRedBagConvert, queryRedBagDetail } from '../../../server/rpc/redBag.p';
import { clientRpcFunc } from './init';
// 上传的文件url前缀
export const uploadFileUrlPrefix = `http://${sourceIp}/service/get_file?sid=`;
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
            }
        });
    });
};

/**
 * 批量获取用户信息
 */
export const getUserList = async (uid: any[], isOpenid?: number) => {
    let src = null;
    const uids = [];
    let max = 0;
    uid.forEach((v,i) => {
        uids.push(v.openid);
        if (v.sum >= max) {
            max = i;
        }
    });
    if (isOpenid) {
        src = `http://${erlangLogicIp}:${erlangLogicPayPort}/user/get_infos?list=${JSON.stringify(uids)}&isOpenid=${isOpenid}`;
    } else {
        src = `http://${erlangLogicIp}:${erlangLogicPayPort}/user/get_infos?list=${JSON.stringify(uids)}`;
    }

    return piFetch(src).then(res => {
        const userInfo = [];
        r.value.forEach((v,i) => {
            const item = JSON.parse(v);
            let avatar = '';
            if (item.avatar && item.avatar.indexOf('data:image') < 0) {
                if (item.avatar.slice(0,4) === 'http') {
                    avatar = item.avatar;   
                } else {
                    avatar = `${uploadFileUrlPrefix}${item.avatar}`;
                }
                
            } else {
                avatar = '../icon/img_avatar1.png';
            }
            const data = {
                nickName:item.nickName ? item.nickName :'昵称未设置',
                avatar,
                time:uid[i].time,
                sum:uid[i].sum,
                fg:i === max ? true :false
            };
            userInfo.push(data);
        });

        return userInfo;
    });
};