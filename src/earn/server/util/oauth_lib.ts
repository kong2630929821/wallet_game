
/**
 * 连接钱包服务器封装
 */
import { BigNumber } from '../../../pi/bigint/biginteger';
import { randomInt } from '../../../pi/util/math';
import { ab2hex } from '../../../pi/util/util';
import { digest, DigestAlgorithm } from '../../../pi_pt/rust/pi_crypto/digest';
import { ECDSASecp256k1 } from '../../../pi_pt/rust/pi_crypto/signature';
import { BTC_TYPE, BTC_UNIT_NUM, BTC_WALLET_TYPE, ETH_TYPE, ETH_UNIT_NUM, ETH_WALLET_TYPE, KT_TYPE, KT_UNIT_NUM, KT_WALLET_TYPE, ST_TYPE, ST_UNIT_NUM, ST_WALLET_TYPE, WALLET_API_ALTER, WALLET_API_UNIFIEDORDER, WALLET_APPID, WALLET_GET_ACCID, WALLET_MCH_ID, WALLET_ORDER_QUERY, WALLET_SERVER_KEY, WALLET_SERVER_URL } from '../data/constant';
import { getOpenid } from '../rpc/user.r';
import * as http from './http_client';

// 签名
export const sign = (msg: string, privateKey: string) => {
    const secp = ECDSASecp256k1.new();
    const data = str2ab(msg);
    // 消息的sha256哈希，哈希算法可以自己选择
    const hash = digest(DigestAlgorithm.SHA256, data).asSliceU8();
    // 私钥， 32字节
    const skAb = DecodeHexStringToByteArray(privateKey);

    // 签名结果
    const sig = secp.sign(hash, skAb).asSliceU8();
    console.log('oauth_lib!!!!!!!!!!!!sign!!!!msg:', msg, 'sign:', ab2hex(sig), 'key:', privateKey);
    return ab2hex(sig);

};

const str2ab = (str):Uint8Array => {
    const arr = [];
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        arr[i] = str.charCodeAt(i);
    }

    console.log(arr);

    return new Uint8Array(arr);
};

// json转字符串为uri并按照字典排序
export const json_uri_sort = (json) => {
    const keys = Object.keys(json).sort();
    let msg = '';
    for (const index in keys) {
        const key = keys[index];
        if (msg === '') {
            // msg += key + '=' + json[key];
            msg = `${msg}${key}=${json[key]}`;
        } else {
            // msg += '&' + key + '=' + json[key];
            msg = `${msg}&${key}=${json[key]}`;
        }
    }

    console.log('!!!!!!!!!!!!!!!msg:', msg);
    return msg;
};

const DecodeHexStringToByteArray = (hexString:string) => {
    const result = [];
    while (hexString.length >= 2) { 
        result.push(parseInt(hexString.substring(0, 2), 16));
        hexString = hexString.substring(2, hexString.length);
    }
    
    return new Uint8Array(result);
};

// 根据openid获取acc_id
export const getAccIds = (openid_list: number[]) => {
    const url = `${WALLET_SERVER_URL}${WALLET_GET_ACCID}`;
    const body:any = { openid_list: openid_list };
    const client = http.createClient();
    console.log('11111111111111111111');
    http.addHeader(client, 'content-type', 'application/json');
    const r = http.post(client, url, body);
    let accidList = [];
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.return_code === 1) {
            accidList = json.accid_list;
            
            return accidList;
        } else {
            return accidList;
        }
    } else {
        return accidList;
    }
};

export const oauth_send = (uri: string, body) => {
    console.log('oauth_send!!!!!!!', uri, body);
    // 增加时间戳
    body.timestamp = new Date().getTime();
    // 签名
    const signStr = sign(json_uri_sort(body), WALLET_SERVER_KEY);
    console.log('!!!!!!!!!!!!key:', WALLET_SERVER_KEY, 'sign:', signStr);
    body.sign = signStr;
    const url = `${WALLET_SERVER_URL}${uri}`;
    console.log('!!!!!!!!!url:', url);
    const client = http.createClient();
    console.log('11111111111111111111');
    http.addHeader(client, 'content-type', 'application/json');
    console.log('2222222222222222');

    return http.post(client, url, body);
};

// 向钱包账户发起余额更改请求
export const oauth_alter_balance = (itemType:number, oid:string, count:number) => {
    console.log('挖矿测试 oid-------------------',oid);
    
    let coinType;
    let num;
    switch (itemType) {
        case BTC_TYPE:
            coinType = BTC_WALLET_TYPE;
            num = (count * BTC_UNIT_NUM).toString();
            break;
        case ETH_TYPE:
            coinType = ETH_WALLET_TYPE;
            const coinNum:BigNumber = (count * ETH_UNIT_NUM);
            num = coinNum.toString();
            console.log('ETH_NUM!!!!!!!!!!!!!!!!!:', num);
            break;
        case ST_TYPE:
            coinType = ST_WALLET_TYPE;
            num = (count * ST_UNIT_NUM).toString();
            break;
        case KT_TYPE:
            coinType = KT_WALLET_TYPE;
            num = (count * KT_UNIT_NUM).toString();
            break;
        default:
    }
    const openid = Number(getOpenid());
    console.log('coinType!!!!!!!!!!!!!!!!!!!!', coinType);
    const r = oauth_send(WALLET_API_ALTER, { openid: openid, coinType: coinType, num: num, oid: oid });
    console.log('http response!!!!!!!!!!!!!!!!!!!!', r);
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.return_code === 1) {
            num = json.num;
            
            return num;
        } else {
            return;
        }
    } else {
        return;
    }
};

// 第三方应用生成订单
export const wallet_unifiedorder = (oid:string, coinNum: number, body: string, coin_type: number) => {
    const appid = WALLET_APPID;
    const mch_id = WALLET_MCH_ID;
    const total_fee = coin_unit_transform(coin_type, coinNum);
    const out_trade_no = oid;
    const nonce_str = `${randomInt(100000, 999999)}`;
    const signBody = { appid: appid, mch_id: mch_id, body: body, out_trade_no: out_trade_no, fee_type: coin_type, total_fee: total_fee, nonce_str: nonce_str };
    const signStr = sign(json_uri_sort(signBody), WALLET_SERVER_KEY);
    const requestBody:any = { appid: appid, mch_id: mch_id, sign: signStr, body: body, out_trade_no: out_trade_no, fee_type: coin_type, total_fee: total_fee, nonce_str: nonce_str };
    const url = `${WALLET_SERVER_URL}${WALLET_API_UNIFIEDORDER}`;
    const client = http.createClient();
    http.addHeader(client, 'content-type', 'application/json');
    const r = http.post(client, url, requestBody);
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.return_code === 1) {
            console.log('returnJson!!!!!!!!!!!!', json);

            return json;
        } else {
            return;
        }
    } else {
        return;
    }
};

// 第三方应用查询订单
export const wallet_order_query = (oid:string) => {
    const appid = WALLET_APPID;
    const mch_id = WALLET_MCH_ID;
    const out_trade_no = oid;
    const nonce_str = `${randomInt(100000, 999999)}`;
    const signBody = { appid: appid, mch_id: mch_id, out_trade_no: out_trade_no, nonce_str: nonce_str };
    const signStr = sign(json_uri_sort(signBody), WALLET_SERVER_KEY);
    const requestBody:any = { appid: appid, mch_id: mch_id, sign: signStr, out_trade_no: out_trade_no, nonce_str: nonce_str };
    const url = `${WALLET_SERVER_URL}${WALLET_ORDER_QUERY}`;
    const client = http.createClient();
    http.addHeader(client, 'content-type', 'application/json');
    const r = http.post(client, url, requestBody);
    console.log('wallet_response !!!!!!!!!!!!!!!!!!!', r);
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.return_code === 1) {
            return json;
        } else {
            return;
        }
    } else {
        return;
    }
};

// 平台到钱包的币种单位转换
export const coin_unit_transform = (coin_type: number, coin_num: number): string => {
    let coinNum: string;
    switch (coin_type) {
        case ST_WALLET_TYPE:
            coinNum = (coin_num * ST_UNIT_NUM).toString();
            break;
        case KT_WALLET_TYPE:
            coinNum = (coin_num * KT_UNIT_NUM).toString();
            break;
        case BTC_WALLET_TYPE:
            coinNum = (coin_num * BTC_UNIT_NUM).toString();
            break;
        case ETH_WALLET_TYPE:
            coinNum = (coin_num * ETH_UNIT_NUM).toString();
        default:
            coinNum = coin_num.toString();
    }

    return coinNum;
};