
/**
 * 连接钱包服务器封装
 */
import { BigNumber } from '../../../pi/bigint/biginteger';
import { randomInt } from '../../../pi/util/math';
import { BTC_TYPE, BTC_UNIT_NUM, BTC_WALLET_TYPE, ETH_TYPE, ETH_UNIT_NUM, ETH_WALLET_TYPE, KT_TYPE, KT_UNIT_NUM, KT_WALLET_TYPE, ST_TYPE, ST_UNIT_NUM, ST_WALLET_TYPE, WALLET_API_ALTER, WALLET_API_UNIFIEDORDER, WALLET_APPID, WALLET_MCH_ID, WALLET_SERVER_KEY, WALLET_SERVER_URL } from '../data/constant';
import { getOpenid } from '../rpc/user.r';
import * as http from './http_client';

// 签名
export const sign = (msg: string, privateKey: string) => {
    // const sig = new KJUR.crypto.Signature({ alg: KJUR.jws.JWS.jwsalg2sigalg.ES256 });
    // sig.init({ d: privateKey, curve: 'secp256k1' });
    // sig.updateString(msg);

    // return sig.sign();

    return 'testsign';
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

    return msg;
};

export const oauth_send = (uri: string, body) => {
    console.log('oauth_send!!!!!!!', uri, body);
    // 增加时间戳
    body.timestamp = new Date().getTime();
    // 签名
    const signStr = sign(json_uri_sort(body), WALLET_SERVER_KEY);
    body.sign = signStr;
    const url = `${WALLET_SERVER_URL}${uri}`;
    console.log('!!!!!!!!!url:', url);
    const client = http.createClient();
    http.addHeader(client, 'content-type', 'application/json');

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
export const wallet_unifiedorder = (stNum: number) => {
    const openid = Number(getOpenid());
    const appid = WALLET_APPID;
    const mch_id = WALLET_MCH_ID;
    const key = WALLET_SERVER_KEY;
    const total_fee = (stNum * ST_UNIT_NUM).toString();
    const time = (new Date()).valueOf();
    const out_trade_no = `${time}${openid}${randomInt(10000, 99999)}`;
    const nonce_str = `${randomInt(100000, 999999)}`;
    const r = oauth_send(WALLET_API_UNIFIEDORDER, { openid: openid, appid: appid, mch_id: mch_id, total_fee: total_fee, out_trade_no: out_trade_no, nonce_str: nonce_str });
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