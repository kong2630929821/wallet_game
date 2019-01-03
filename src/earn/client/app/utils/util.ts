/**
 * common util
 */
import { popNew } from '../../../../pi/ui/root';
import { Item_Enum } from '../../../server/data/db/item.s';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { RegularAwardCfg, SeriesLoginAwardCfg, STConvertCfg, WeightAwardCfg, WeightMiningCfg } from '../../../xlsx/awardCfg.s';
import { ErrorNumCfg } from '../../../xlsx/errorNum.s';
import { AchievementMedalCfg, MedalCfg, MineHpCfg } from '../../../xlsx/item.s';
import { getMap } from '../store/cfgMap';
import { getStore, setStore } from '../store/memstore';
import { ActTicketNumCfg, PrizeCfg } from '../xls/dataCfg.s';
import { ActivityType, ItemType } from '../xls/dataEnum.s';
import { HoeType } from '../xls/hoeType.s';
import { MineType } from '../xls/mineType.s';
import { miningMaxHits } from './constants';

/**
 * 获取用户单个物品数量  kt/st等
 */
export const getGoodCount = (itemType: ItemType) => {
    const goods = getStore('goods');
    for (let i = 0; i < goods.length; i++) {
        const good = goods[i];
        if (good.value.num === itemType) {
            return good.value.count;
        }
    }

    return 0;
};

/**
 * 获取锄头对象
 */
export const getHoeCount = (hoeType: HoeType) => {
    const goods = getStore('goods');
    for (let i = 0; i < goods.length; i++) {
        const good = goods[i];
        if (good.enum_type === Item_Enum.HOE && good.value.num === hoeType) {
            return good.value.count;
        }
    }

    return 0;
};

/**
 * 获取所有矿山
 */
export const getAllMines = () => {
    const goods = getStore('goods');
    const mines = [];
    for (let i = 0; i < goods.length; i++) {
        const good = goods[i];
        if (good.enum_type === Item_Enum.MINE) {
            for (let j = 0; j < good.value.count; j++) {
                const hp = good.value.hps[j].hp;
                const itype = good.value.num;
                const mine = {
                    type: itype,
                    id: good.value.hps[j].num,
                    hp
                };
                mines.push(mine);
            }
        }
    }
    // console.log('getAllMines',mines);

    return mines;
};

/**
 * 获取拥有的品质最高的矿山类型
 */
export const getMaxMineType = () => {
    const goods = getStore('goods');
    let mineType = MineType.SmallMine;
    for (let i = 0; i < goods.length; i++) {
        const good = goods[i];
        if (good.enum_type === Item_Enum.MINE) {
            if (good.value.count > 0 && good.value.num > mineType) {
                mineType = good.value.num;
            }
        }
    }

    // console.log('getMaxMineType',mineType);

    return mineType;
};
/**
 * 获取随机显示的矿山列表
 */
export const randomMines = () => {
    const goods = getStore('goods');
    const mines = [];
    const miningedMines = [];
    for (let i = 0; i < goods.length; i++) {
        const good = goods[i];
        if (good.enum_type === Item_Enum.MINE) {
            for (let j = 0; j < good.value.hps.length; j++) {
                const hp = good.value.hps[j];
                const itype = good.value.num;
                const mine = {
                    type: itype,
                    index: j,
                    hp
                };
                if (itype === MineType.SmallMine && hp < getMiningMaxHp(MineType.SmallMine)) {
                    miningedMines.push(mine);
                } else if (itype === MineType.MidMine && hp < getMiningMaxHp(MineType.MidMine)) {
                    miningedMines.push(mine);
                } else if (itype === MineType.BigMine && hp < getMiningMaxHp(MineType.BigMine)) {
                    miningedMines.push(mine);
                } else {
                    mines.push(mine);
                }
            }
        }
    }

    return [...shuffle(miningedMines), ...shuffle(mines)];
};

// 数组乱序
export const shuffle = (arr: any[]): any[] => {
    const length = arr.length;
    const shuffled = Array(length);
    for (let index = 0, rand; index < length; index++) {
        rand = ~~(Math.random() * (index + 1));
        if (rand !== index) {
            shuffled[index] = shuffled[rand];
        }
        shuffled[rand] = arr[index];
    }

    return shuffled;
};

// 处理挖矿单次事件(一次点击)
const doMining = (hoeType: number, seedMgr: RandomSeedMgr): number => {
    const cfgs = getMap(WeightMiningCfg._$info.name);
    const weights = [];
    const filterCfgs = [];
    let maxWeight = 0;
    for (const [k, cfg] of cfgs) {
        if (cfg.id === hoeType) {
            filterCfgs.push(cfg);
            maxWeight += cfg.weight;
            weights.push(maxWeight);
        }
    }
    // console.log('weights = ',weights);
    const i = getWeightIndex(weights, seedMgr.seed);

    return filterCfgs[i].hits;
};

// 获取权重对应的位置
const getWeightIndex = (weights: number[], seed: number) => {
    const rate = RandomSeedMgr.randomSeed(seed, 1, weights[weights.length - 1]);

    let i = 0;
    for (i = 0; i < weights.length; i++) {
        if (rate <= weights[i]) break;
    }

    return i;
};

/**
 * 计算挖矿数组
 */
export const calcMiningArray = (hoeType: HoeType, seed: number) => {
    const hits = [];
    let cSeed = seed;
    for (let i = 0; i < miningMaxHits; i++) {
        const randomMgr = new RandomSeedMgr(cSeed);
        const hit = doMining(hoeType, randomMgr);
        cSeed = RandomSeedMgr.randNumber(cSeed);
        hits.push(hit);
    }
    // console.log(`hopeType = ${hoeType}, hits = `,hits);

    return hits;
};

/**
 * 获取矿山最大血量
 * @param mineType 矿山类型
 */
export const getMiningMaxHp = (mineType: MineType) => {
    const cfgs = getMap(MineHpCfg._$info.name);
    for (const [k, v] of cfgs) {
        if (v.id === mineType) {
            return v.hp;
        }
    }

    return 0;
};

/**
 * 获取对应奖券TYPE的余票
 * @param ticketType 奖券TYPE
 */
export const getTicketBalance = (ticketType) => {
    const goods = getStore('goods');
    for (let i = 0; i < goods.length; i++) {
        const good = goods[i];
        if (good.enum_type === Item_Enum.TICKET && good.value.num === ticketType) {

            return good.value.count;
        }
    }

    return 0;
};

/**
 * 获取活动所需对应票数
 *  奖品编号
 */
export const getTicketNum = (activityType: ActivityType): any => {
    const cfgs = getMap(ActTicketNumCfg._$info.name);
    for (const [k, cfg] of cfgs) {
        if (cfg.actType === activityType) {
            return cfg.ticketNum;
        }
    }

    return 0;
};

/**
 * 获取单个奖品信息
 * @param prizeType 奖品编号
 */
export const getPrizeInfo = (prizeType: number): any => {
    const cfgs = getMap(PrizeCfg._$info.name);
    const filterCfgs = '';
    for (const [k, cfg] of cfgs) {
        if (cfg.pid === prizeType) {
            return cfg;
        }
    }

    return filterCfgs;
};

/**
 * 获取项目奖品列表
 */
export const getPrizeList = (activityType: ActivityType): any => {
    const cfgs = getMap(WeightAwardCfg._$info.name);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if ((activityType * 100) < cfg.id && cfg.id < (activityType * 100 + 100)) {
            filterCfgs.push(cfg.prop);
        }
    }

    return filterCfgs;
};

/**
 * 获取固定项目奖品列表
 */
export const getRegularPrizeList = (activityType: ActivityType): any => {
    const cfgs = getMap(RegularAwardCfg._$info.name);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if ((activityType * 100) < cfg.id && cfg.id < (activityType * 100 + 100)) {
            filterCfgs.push(cfg);
        }
    }

    return filterCfgs;
};

/**
 * 获取虚拟物品兑换列表
 */
export const getVirtualExchangeList = (): any => {
    const cfgs = getMap(STConvertCfg._$info.name);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        filterCfgs.push(cfg);
    }

    return filterCfgs;
};

/**
 * 获取勋章列表
 * @param typeNum 查询参数
 * @param typeStr 查询列名
 */
export const getMedalList = (typeNum: string | number, typeStr: string): any => {
    const cfgs = getMap(MedalCfg._$info.name);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if (typeNum === cfg[typeStr]) {
            filterCfgs.push(cfg);
        }
    }

    return filterCfgs;
};

/**
 * 获取成就勋章列表
 */
export const getACHVmedalList = (typeNum: string | number, typeStr: string) => {
    const cfgs = getMap(AchievementMedalCfg._$info.name);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if (typeNum === cfg[typeStr]) {
            filterCfgs.push(cfg);
        }
    }

    return filterCfgs;
};

/**
 * 计算用户等级勋章
 */
export const computeRankMedal = () => {

    const ktNum = getGoodCount(ItemType.KT);
    const medalList = getMedalList(ItemType.KT, 'coinType');
    const mineMedal = {
        rankMedal: 8000,
        desc: {},
        nextNeedKt: 0
    };
    for (let i = 0; i < medalList.length; i++) {
        const element = medalList[i];
        if (ktNum >= element.coinNum) {
            mineMedal.rankMedal = element.id;
            mineMedal.desc = { zh_Hans: element.desc, zh_Hant: element.descHant, en: '' };
            if ((i + 1) <= medalList.length) {
                mineMedal.nextNeedKt = medalList[i + 1].coinNum - ktNum;
            } else {
                mineMedal.nextNeedKt = 0;
            }
        }
    }

    return mineMedal;
};

/**
 * 展示错误信息
 * @param errorNum 错误编号
 */
export const showActError = (errorNum: number) => {
    const cfgs = getMap(ErrorNumCfg._$info.name);
    for (const [k, cfg] of cfgs) {
        if (errorNum === cfg.id) {
            popNew('app-components1-message-message', { content: { zh_Hans: cfg.desc, zh_Hant: cfg.descHant, en: '' } });
        }
    }

};

/**
 * 获取连续登录奖励
 */
export const getSeriesLoginAwards = (serielLoginDays: number) => {
    const cfgs = getMap(SeriesLoginAwardCfg._$info.name);
    const showAwardsDays = 7; // 同时展示几天的奖励
    // tslint:disable-next-line:prefer-array-literal
    const awards = new Array(showAwardsDays);
    if (serielLoginDays <= showAwardsDays) {
        for (const [k, cfg] of cfgs) {
            if (cfg.days > showAwardsDays) continue;
            awards[cfg.days - 1] = cfg;
        }
    } else {
        for (const [k, cfg] of cfgs) {
            if (cfg.days <= showAwardsDays) continue;
            awards[cfg.days - 1 - showAwardsDays] = cfg;
        }
    }

    return awards;
};
