/**
 * 服务器统一消息推送
 */

import { BonBuffer } from '../../../pi/util/bon';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { mqttPublish, QoS } from '../../../pi_pt/rust/pi_serv/js_net';
import { Logger } from '../../utils/logger';
import { SendMsg } from '../rpc/send_message.s';
import { Env } from '../../../pi/lang/env';

declare var env: Env;

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export const send = (uid: number, cmd: string, msg: string) => {
    const topic = `send/${uid}`;
    const mqttServer = env.get('mqttServer');
    const sendMsg = new SendMsg();
    sendMsg.cmd = cmd;
    sendMsg.msg = msg;
    const buf = new BonBuffer();
    sendMsg.bonEncode(buf);
    logger.debug(`the topic is : ${topic}`);
    mqttPublish(mqttServer, true, QoS.AtMostOnce, topic, buf.getBuffer());
};