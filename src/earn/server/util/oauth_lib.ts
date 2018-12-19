
/**
 * 连接钱包服务器封装
 */
import { WALLET_SERVER_KEY, WALLET_SERVER_URL } from '../data/constant';
import { KJUR } from './sample-ecdsa';

// 签名
export const sign = (msg: string, privateKey: string) => {
    const sig = new KJUR.crypto.Signature({ alg: KJUR.jws.JWS.jwsalg2sigalg.ES256 });
    sig.init({ d: privateKey, curve: 'secp256k1' });
    sig.updateString(msg);

    return sig.sign();
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
    // 增加时间戳
    body.timestamp = new Date().getTime();
    // 签名
    const signStr = sign(json_uri_sort(body), WALLET_SERVER_KEY);
    body.sign = signStr;
    fetch(`WALLET_SERVER_URL${uri}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(response => response.json())
        .then(res => {
            console.log('send success ', res);
        }).catch(err => {
            console.log('send fail ', err);
        });
};