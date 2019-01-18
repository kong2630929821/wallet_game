import { CoinType } from '../xls/dataEnum.s';

/**
 * 工具类函数
 */

// 时间戳格式化 毫秒为单位
export const timestampFormat = (timestamp) => {
    if (typeof(timestamp) === 'string') {
        // tslint:disable-next-line:radix
        timestamp = parseInt(timestamp);
    }
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

/**
 * st小转大单位
 * @param stNum st数量
 */
export const st2ST = (stNum:number) => {
    let ST = 0;
    if (stNum !== 0) {
        ST = stNum / 100;
    }

    return ST;
};

/**
 * eth小转大单位
 * @param ethNum eth数量
 */
export const eth2ETH = (ethNum:number) => {
    let ETH = 0;
    if (ethNum !== 0) {
        ETH = ethNum / 1000;
    }

    return ETH;
};

/**
 * eth小转大单位
 * @param btcNum eth数量
 */
export const btc2BTC = (btcNum:number) => {
    let BTC = 0;
    if (btcNum !== 0) {
        BTC = btcNum / 10000;
    }

    return BTC;
};

/**
 * 货币单位转换
 */
export const coinUnitchange = (coinType:CoinType,count:number) => {
    switch (coinType) {
        case CoinType.BTC:
            return btc2BTC(count); 
        case CoinType.ETH:
            return eth2ETH(count); 
        case CoinType.ST:
            return st2ST(count); 
    
        default:
            return count;
    }
};