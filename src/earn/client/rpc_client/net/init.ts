/**
 * RPC， 远程方法调用
 * 采用 mqtt上定义的每会话的$req和$resp主题，来发送请求和接受响应
 * 建立网络响应客户端的
 */
declare var pi_modules;

// ================================================ 导入
// import { activeLogicIp, activeLogicPort } from '../../../../app/public/config';
import { activeLogicIp, activeLogicPort } from '../../../../app/public/config';
import { Client } from '../../../../pi/net/mqtt_c';
import { Struct, StructMgr } from '../../../../pi/struct/struct_mgr';
import { ConMgr } from './con_mgr';
import { handle } from './rpc';

// ================================================ 导出
export const sourceIp = activeLogicIp;
export const sourcePort = activeLogicPort;

/**
 * 客户端初始化
 */
export const initClient = () => {
    if (!rootClient) {
        console.log('initClient -----------');
        mqtt = new ConMgr(sourceIp, sourcePort);
        rootClient = mqtt.connection(() => {
            // 获取红包
            // handle();
        },() => {
            console.log('connection failed');
        });
    } 
    // initPush();
};

/**
 * rpc 调用
 * @param name  method name
 * @param req request
 * @param callback  callback
 * @param timeout  timeout
 */
export const clientRpcFunc = (name: string, req: any, callback: Function, timeout: number = 2000) => {
    if (!clientRpc) {
        if (mqtt && mqtt.getState()) {
            clientRpc = mqtt.getRpc();
        } else {
            callback({});
            
            return;
        }
    }
    if (mqtt && !mqtt.getState()) {
        console.log(`网络连接中！！！！`);
        callback({});

        return;
    }
    clientRpc(name, req, (r: Struct) => {
        if (!r) {
            console.log(`${name} 失败了，返回结果 ${r}`);
            callback({});
        } else {
            return callback(r);
        }
    }, timeout);
};

/**
 * 注册了所有可以rpc调用的结构体
 * @param fileMap file map
 */
export const registerRpcStruct = (fileMap) => {
    if (!(<any>self).__mgr) {
        (<any>self).__mgr = new StructMgr();
    }
    for (const k in fileMap) {
        if (!k.endsWith('.s.js')) {
            continue;
        }
        const filePath = k.slice(0, k.length - pi_modules.butil.exports.fileSuffix(k).length - 1);
        const exp = pi_modules[filePath] && pi_modules[filePath].exports;
        for (const kk in exp) {
            if (Struct.isPrototypeOf(exp[kk]) && exp[kk]._$info && exp[kk]._$info.name) {
                if (!(<any>self).__mgr.lookup(exp[kk]._$info.name_hash)) {
                    (<any>self).__mgr.register(exp[kk]._$info.name_hash, exp[kk], exp[kk]._$info.name);
                }
            }
        }
    }
};

/**
 * 主动断开mqtt连接
 */
export const disconnect = () => {
    mqtt && mqtt.disconnect();
    mqtt = undefined;
    rootClient = undefined;
    clientRpc = undefined;
};

// ================================================ 本地
// MQTT管理
let mqtt: ConMgr;
// 客户端
let rootClient: Client;
// root RPC
let clientRpc: any;
