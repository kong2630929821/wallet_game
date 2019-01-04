/**
 * @file store
 * @author donghr
 */
// ============================================ 导入
import { HandlerMap } from '../../../../pi/util/event';
import { Item } from '../../../server/data/db/item.s';

// ============================================ 导出

/**
 * 判断是否是对象
 */
const isObject = (value: any) => {
    const vtype = typeof value;

    return value !== null && (vtype === 'object' || vtype === 'function');
};

/**
 * 数据深拷贝
 */
export const deepCopy = (v: any): any => {
    if (!v || v instanceof Promise || !isObject(v)) return v;
    if (v instanceof Map) {
        return new Map(JSON.parse(JSON.stringify(v)));
    }

    const newobj = v.constructor === Array ? [] : {};
    for (const i in v) {
        newobj[i] = isObject(v[i]) ? deepCopy(v[i]) : v[i];
    }

    return newobj;
};

/**
 * 根据路径获取数据
 */
export const getStore = (path: string, defaultValue = undefined) => {
    let ret = store;
    for (const key of path.split('/')) {
        if (key in ret) {
            ret = ret[key];
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('getStore Failed, path = ' + path);
        }
    }
    const deepRet = deepCopy(ret);

    return (typeof deepRet === 'boolean' || typeof deepRet === 'number') ? deepRet : (deepRet || defaultValue);
};

/**
 * 更新store并通知
 */
export const setStore = (path: string, data: any, notified = true) => {
    const keyArr = path.split('/');

    const notifyPath = [];
    for (let i = 0; i < keyArr.length; i++) {
        // tslint:disable-next-line:prefer-template
        const path = i === 0 ? keyArr[i] : notifyPath[i - 1] + '/' + keyArr[i];
        notifyPath.push(path);
    }
    // console.log(notifyPath);
    // 原有的最后一个键
    const lastKey = keyArr.pop();

    let parent = store;
    for (const key of keyArr) {
        if (key in parent) {
            parent = parent[key];
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('setStore Failed, path = ' + path);
        }
    }
    parent[lastKey] = deepCopy(data);

    if (notified) {
        for (let i = notifyPath.length - 1; i >= 0; i--) {
            handlerMap.notify(notifyPath[i], getStore(notifyPath[i]));
        }
    }
};

/**
 * 注册消息处理器
 */
export const register = (keyName: string, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

/**
 * 取消注册消息处理器
 */
export const unregister = (keyName: string, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

// ======================================================== 本地

// ============================================ 立即执行

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

// 全局内存数据库
const store:Store = {
    userInfo:{
        uid:-1,
        name:'',
        avator:'',
        note:'',
        sex:0,
        tel:''
    },
    mine:{
        miningedNumber:0
    },
    goods:[],
    balance:{
        ST:0,
        KT:0
    },
    ACHVmedals:[]
    
};

export interface Mine {
    miningedNumber:0;  // 今天已挖矿山数量
}
/**
 * Store的声明
 */
export interface Store {
    userInfo:UserInfo; // 用户信息相关
    mine:Mine;      // 矿山相关
    goods:Item[];   // 拥有的物品
    balance:Balance;  // 账户余额 
    ACHVmedals:any;   // 拥有成就勋章
}

export interface Balance {
    KT:number;
    ST:number;
}

/**
 * 用户基本信息
 */
export interface UserInfo {
    uid:number;  // user uid
    name:string; // user name
    avator:string; // user avator
    note:string;  // user note
    sex:number; // user sex
    tel:string;  // user tel
}