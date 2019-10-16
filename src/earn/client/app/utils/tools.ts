import { SeriesLoginAwardCfg } from '../../../xlsx/awardCfg.s';
import { MedalCfg } from '../../../xlsx/item.s';
import { getMap } from '../store/cfgMap';
import { getSeriesLoginAwards } from './tools';

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
 * 获取连续登录奖励
 */
export const getSeriesLoginAwards = (serielLoginDays: number) => {
    const resetDays = 15; // 奖励重置天数
    const showAwardsDays = 7; // 同时展示几天的奖励
    const multiple = Math.ceil(serielLoginDays / showAwardsDays);
    const showAwardsDaysStart = (multiple - 1) * showAwardsDays + 1 ;
    const cfgs = getMap(SeriesLoginAwardCfg);
    const awards = [];
    for (let i = 0;i < showAwardsDays;i++) {
        const index = (showAwardsDaysStart + i - 1) % resetDays;
        const cfg = JSON.parse(JSON.stringify(cfgs.get(index + 1)));
        cfg.days = showAwardsDaysStart + i;
        awards[i] = cfg;
    }
    
    return awards;
};

/**
 * 获取勋章列表
 * @param typeNum 查询参数
 * @param typeStr 查询列名
 */
export const getMedalList = (typeNum: string | number, typeStr: string): any => {
    const cfgs = getMap(MedalCfg);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if (typeNum === cfg[typeStr]) {
            filterCfgs.push(cfg);
        }
    }

    return filterCfgs;
};