/**
 * 订阅后端数据库,也是通过mqtt方式实现的
 */

// ================================================================= 导入
import { BonBuffer } from '../../../../pi/util/bon';
import { ab2hex } from '../../../../pi/util/util';
import { Items } from '../../../server/data/db/item.s';
import { watchItemsInfo } from '../../../server/rpc/dbWatcher.p';
import { getStore, setStore } from '../store/memstore';
import { WARE_NAME } from '../utils/constants';
import { clientRpcFunc, subscribe } from './init';

// ================================================================= 导出

/**
 * 初始化需要监听的信息
 */
export const initSubscribeInfo = () => {
    subscribeItemsInfo(getStore('userInfo/uid'),(r:Items) => {
        setStore('goods',r.item);
    });
};

/**
 * 物品信息监听
 */
export const subscribeItemsInfo = (uid: number,cb?:Function) => {
    subscribeTable(watchItemsInfo,uid,Items,cb);
};

// ================================================================= 本地

/**
 * 一个通用的订阅数据结构
 * @param method method Name
 * @param keyName key Name
 * @param keyValue value 
 * @param defaultKeyValue default value 
 * @param struct struct 
 * @param mapName map Name
 * @param cb callback
 */
const subscribeTable = (method:string, keyValue:any, struct:any, cb?:Function) => {
    clientRpcFunc(method, keyValue, (r: any) => {
        updateMap(r);
        const bonKeyValue = ab2hex(new BonBuffer().write(keyValue).getBuffer());
        subscribe(`${WARE_NAME}.${struct._$info.name}.${bonKeyValue}`, struct, (r: any) => {
            updateMap(r);
        });
    });    

    const updateMap = (r:any) => {
        console.log('数据变化监听  ---------- ',r);
        cb && cb(r);
    };
};