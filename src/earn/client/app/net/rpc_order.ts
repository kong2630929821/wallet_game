
/**
 * 支付下单rpc
 */
import { walletPay } from '../../../../app/utils/pay';
import { ST2st } from '../../../../app/utils/unitTools';
import { GuessingReq, Result } from '../../../server/data/db/guessing.s';
import { FreePlay } from '../../../server/data/db/item.s';
import { start_guessing } from '../../../server/rpc/guessingCompetition.p';
import { box_pay_query, convert_pay_query, get_convert_info, get_convert_list, get_hasFree, rotary_pay_query, st_convert, st_treasurebox, kt_rotary, kt_treasurebox} from '../../../server/rpc/stParties.p';
import { showActError } from '../utils/util';
import { ActivityType } from '../xls/dataEnum.s';
import { clientRpcFunc } from './init';

/**
 * 开宝箱下单
 */
export const openChest = (activityType: ActivityType) => {
    return new Promise((resolve, reject) => {
        const itemType = activityType;
        clientRpcFunc(kt_treasurebox, itemType, (r: Result) => {
            console.log('[活动]rpc-openChest-resData-------------', r);
            if (r.reslutCode === 1) {
                const order = JSON.parse(r.msg);
                if (order.oid) { 
                    walletPay(order,'101','15',(res,msg) => {
                        console.log('chest PAY',res,order);
                        
                        if (!res) {
                            resolve(order);
                        } else {
                            showActError(res);
                            reject(res);
                        }
                    });
                } else { // 免费机会返回
                    resolve(order);
                }
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 转转盘
 */
export const openTurntable = (activityType: ActivityType) => {
    return new Promise((resolve, reject) => {
        const itemType = activityType;

        clientRpcFunc(kt_rotary, itemType, (r: Result) => {
            console.log('[活动]rpc-openTurntable-resData---------------', r);
            if (r.reslutCode === 1) {
                const order = JSON.parse(r.msg);
                if (order.oid) { 
                    walletPay(order,'101','15',(res,msg) => {
                        console.log('chest PAY',res,order);
                        
                        if (!res) {
                            resolve(order);
                        } else {
                            showActError(res);
                            reject(res);
                        }
                    });
                } else { // 免费机会返回
                    resolve(order);
                }
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 兑换虚拟物品下单
 * @param VirtualId 虚拟物品ID
 */
export const exchangeVirtual = (VirtualId:number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(st_convert, VirtualId, (r: Result) => {
            console.log('[活动]rpc-exchangeVirtual---------------', r);
            if (r.reslutCode === 1) {
                const order = JSON.parse(r.msg);
                walletPay(order,'101','15',(res,msg) => {
                    console.log('exchangeVirtual',res,order);
                        
                    if (!res) {
                        resolve(order);
                    } else {
                        showActError(res);
                        reject(res);
                    }
                });
            } else {
                reject(showActError(r.reslutCode));
            }
        });
    });
};

/**
 * 下注竞猜
 */
export const betGuess = (cid:number,num:number,teamSide:number) => {
    return new Promise((resolve, reject) => {
        const guessingReq = new GuessingReq();
        guessingReq.cid = cid;
        guessingReq.num = ST2st(num);
        guessingReq.teamSide = teamSide;
        clientRpcFunc(start_guessing, guessingReq, (r: Result) => {
            console.log('[活动]rpc-betGuess---------------', r);
            if (r.reslutCode === 1) {
                const order = JSON.parse(r.msg);
                walletPay(order,'101','15',(res,msg) => {
                    if (!res) {
                        resolve(order);
                    } else {
                        showActError(res);
                        reject(res);
                    }
                });
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 开宝箱订单查询
 */
export const queryChestOrder = (oid:string) => {
    console.log(oid);
    
    return new Promise((resolve, reject) => {
        clientRpcFunc(box_pay_query, oid, (r: Result) => {
            console.log('[活动]rpc-queryChestOrder---------------', r);
            if (r.reslutCode === 1) {
                const msg = JSON.parse(r.msg);
                resolve(msg);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 兑换订单查询
 */
export const queryExchangeOrder = (oid:string) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(convert_pay_query, oid, (r: Result) => {
            console.log('[活动]rpc-queryExchangeOrder---------------', r);
            if (r.reslutCode === 1) {
                const msg = JSON.parse(r.msg);
                resolve(msg);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 获取虚拟兑换物品信息
 */
export const getConvertInfo = (id:number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_convert_info, id, (r: any) => {
            if (r.reslutCode === 1) {
                const msg = JSON.parse(r.msg);
                console.log('[活动]rpc-getConvertInfo-resData---------------', msg);
                resolve(msg);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 获取虚拟物品兑换列表
 */
export const getExchangeVirtualList = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_convert_list, null, (r: Result) => {
            console.log('[活动]rpc-getExchangeVirtualList--虚拟物品兑换列表---------------', r);
            if (r.reslutCode === 1) {
                const list = JSON.parse(r.msg);
                resolve(list);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};

/**
 * 活动免费次数
 */
export const isFirstFree = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_hasFree, null, (r: FreePlay) => {
            console.log('[活动]rpc-isFirstFree---------------', r);
            resolve(r);
        });
    });
};

/**
 * 大转盘订单查询
 */
export const queryTurntableOrder = (oid:string) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(rotary_pay_query, oid, (r: Result) => {
            console.log('[活动]rpc-queryChestOrder---------------', r);
            if (r.reslutCode === 1) {
                const msg = JSON.parse(r.msg);
                resolve(msg);
            } else {
                showActError(r.reslutCode);
                reject(r);
            }
        });
    });
};