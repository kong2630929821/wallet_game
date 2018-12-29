/**
 * 前端主动监听后端数据库的变化
 */
// ================================================================= 导入
import { BonBuffer } from '../../../pi/util/bon';
import { ab2hex } from '../../../pi/util/util';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../utils/db';
import { Logger } from '../../utils/logger';
import { WARE_NAME } from '../data/constant';
import { Items, MiningKTNum, SpecialAward } from '../data/db/item.s';
import { UserInfo } from '../data/db/user.s';
// ================================================================= 导出
/**
 * 用户本人的基本信息
 * @param uid user id
 */
// #[rpc=rpcServer]
export const watchUserInfo = (uid: number): UserInfo => {
    return watchInfo('uid', uid, UserInfo, -1);
};

/**
 * 用户的所有物品
 * @param uid user id
 */
// #[rpc=rpcServer]
export const watchUserItems = (uid: number): Items => {
    return watchInfo('uid', uid, Items, -1);
};

/**
 * 用户挖矿得到的KT数
 * @param uid user id
 */
// #[rpc=rpcServer]
export const watchMiningKTNum = (uid: number): MiningKTNum => {
    return watchInfo('uid', uid, MiningKTNum, -1);
};

/**
 * 用户挖矿得到的特别奖品
 * @param uid user id
 */
// #[rpc=rpcServer]
export const watchSpecialAward = (id: string): SpecialAward => {
    return watchInfo('id', id, SpecialAward, -1);
};

// ================================================================= 本地
/**
 * 获取mqttServer
 */
const getMqttServer = () => {
    return  getEnv().getNativeObject('mqttServer');
};
/**
 * 一个通用的数据库监听器函数
 * @param keyName key name
 * @param keyValue key value 
 * @param tableStruct struct
 * @param defaultValue  default value
 */

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);
export const watchInfo = (keyName:string, keyValue:any, tableStruct:any, keyDefaultValue:any):any => {    
    // 监听数据库
    const mqttServer = getMqttServer();
    const bonKeyValue = ab2hex(new BonBuffer().write(keyValue).getBuffer());
    setMqttTopic(<any>mqttServer, `${WARE_NAME}.${tableStruct._$info.name}.${bonKeyValue}`, true, true); 
    // 返回当前值
    const dbMgr = getEnv().getDbMgr();
    const infoBucket = new Bucket(WARE_NAME, tableStruct._$info.name, dbMgr); 
    logger.debug(`${tableStruct._$info.name} iter`);
    infoBucket.iter(null);
    logger.debug(`keyName is : ${keyName}, keyValue is : ${keyValue}, info is : ${infoBucket.get(keyValue)[0]}`);  
    const info = infoBucket.get(keyValue)[0] || new tableStruct();
    logger.debug(tableStruct._$info.name);
    info[keyName] = info[keyName] || keyDefaultValue;

    return info;
};