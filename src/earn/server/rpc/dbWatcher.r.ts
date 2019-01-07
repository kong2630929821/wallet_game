/**
 * 前端主动监听后端数据库的变化
 */
import { BonBuffer } from '../../../pi/util/bon';
import { ab2hex } from '../../../pi/util/util';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { mqttPublish, QoS, setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../utils/db';
import { Logger } from '../../utils/logger';
import { WARE_NAME } from '../data/constant';
import { Items, MiningKTNum, SpecialAward } from '../data/db/item.s';
import { SendMessage } from './user.s';

// ================================================================= 导入

/** 
 * 物品信息 
 * @param gid group id
 */
// #[rpc=rpcServer]
export const watchItemsInfo = (uid:number): Items => {
    return watchInfo('uid', uid, Items, {});
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
 * @param id string
 */
// #[rpc=rpcServer]
export const watchSpecialAward = (id: string): SpecialAward => {
    return watchInfo('id', id, SpecialAward, -1);
};

// 指定用户消息推送
export const mqtt_send = (uid:number, msgType:number, msg:number) => {
    console.log('mqtt_send in !!!!!!!!!!!!!!!!!!!!');
    const mqttServer = <ServerNode>getMqttServer();
    const message = new SendMessage();
    message.uid = uid;
    message.msg = msg;
    message.msgType = msgType;
    const buf = new BonBuffer();
    message.bonEncode(buf);
    console.log('QoS.AtMostOnce !!!!!!!!!!!!!!!!!!!!', QoS.AtMostOnce);
    mqttPublish(mqttServer, true, QoS.AtMostOnce, uid.toString(), buf.getBuffer());
};

// ================================================================= 本地

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);
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
const watchInfo = (keyName:string, keyValue:any, tableStruct:any, keyDefaultValue:any):any => {    
    // 监听数据库
    const mqttServer = getMqttServer();
    const bonKeyValue = ab2hex(new BonBuffer().write(keyValue).getBuffer());
    console.log('setMqttTopic ==== ',`${WARE_NAME}.${tableStruct._$info.name}.${bonKeyValue}`);
    setMqttTopic(<any>mqttServer, `${WARE_NAME}.${tableStruct._$info.name}.${bonKeyValue}`, true, true); 
    // 返回当前值
    const dbMgr = getEnv().getDbMgr();
    
    const infoBucket = new Bucket(WARE_NAME, tableStruct._$info.name, dbMgr); 
    console.log('infoBucket  ==== ',infoBucket);
    logger.debug(`${tableStruct._$info.name} iter`);
    logger.debug(`keyName is : ${keyName}, keyValue is : ${keyValue}, info is : ${infoBucket.get(keyValue)[0]}`);  
    const info = infoBucket.get(keyValue)[0] || new tableStruct();
    logger.debug(tableStruct._$info.name);
    info[keyName] = info[keyName] || keyDefaultValue;

    return info;
};