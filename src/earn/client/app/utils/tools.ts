import { chooseAdType, watchAd } from '../../../../app/logic/native';
import { popNewLoading, popNewMessage } from '../../../../app/utils/tools';
import { PlayEvent } from '../../../../pi/browser/ad_unoin';
import { Award } from '../../../server/data/db/item.s';
import { getAdRewards } from '../net/rpc';
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

export const timestampFormatWeek = (timestamp) => {
    if (typeof(timestamp) === 'string') {
        // tslint:disable-next-line:radix
        timestamp = parseInt(timestamp);
    }
    const weekAry = ['日', '一', '二', '三', '四', '五', '六'];
    const date = new Date(timestamp);

    return `星期${weekAry[date.getDay()]}`;
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
 * ST大转小单位
 * @param STNum ST数量
 */
export const ST2st = (STNum:number) => {
    let st = 0;
    if (STNum !== 0) {
        st = STNum * 100;
    }

    return st;
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
 * 显示货币单位转换
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

/**
 * 观看广告并且获取奖励
 * @param awardId 从哪个模块进入广告
 * 1 挖矿 2 竞猜 3 大转盘 4 宝箱
 */
export const wathcAdGetAward = (awardId:number,getAwardCB?:Function,closeCB?:Function) => {
    const close = popNewLoading('加载中...');
    let adAard:Award = null;
    chooseAdType((adType) => {
        watchAd(adType,(isSuccess,event,info) => {
            console.log('ad isSuccess',isSuccess);
            console.log('ad info',info);
            close.callback(close.widget);
            if (event === PlayEvent.Reward) {// 发放奖励
                getAdRewards(awardId).then((award:Award) => {
                    adAard = award;
                    // popNewMessage('获取到广告奖励');
                    console.log('观看广告获取到的奖励',award);
                    getAwardCB && getAwardCB(award);
                });
            } else if (event === PlayEvent.Close) { // 关闭广告 
                adAard && closeCB && closeCB(adAard);
            }
        });
    });
};