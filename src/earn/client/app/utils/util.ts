/**
 * common util
 */
import { Item_Enum } from '../../../server/data/db/item.s';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { WeightMiningCfg } from '../../../xlsx/awardCfg.s';
import { MineHpCfg } from '../../../xlsx/item.s';
import { getMap } from '../store/cfgMap';
import { getStore } from '../store/memstore';
import { HoeType } from '../xls/hoeType.s';
import { MineType } from '../xls/mineType.s';
import { miningMaxHits } from './constants';

/**
 * 获取锄头对象
 */
export const getHoeCount = (hoeType:HoeType) => {
    const goods = getStore('mine/goods');
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
    const goods = getStore('mine/goods');
    const mines = [];
    for (let i = 0;i < goods.length; i++) {
        const good = goods[i];
        if (good.enum_type === Item_Enum.MINE) {
            for (let j = 0;j < good.value.hps.length;j++) {
                if (good.value.count <= 0) break;
                const hp = good.value.hps[j];
                const itype = good.value.num;
                const mine = {
                    type:itype,
                    index:j,
                    hp
                };
                mines.push(mine);
            }
        }
    }
    
    return mines;
};
/**
 * 获取随机显示的矿山列表
 */
export const randomMines = () => {
    const goods = getStore('mine/goods');
    const mines = [];
    const miningedMines = [];
    for (let i = 0;i < goods.length; i++) {
        const good = goods[i];
        if (good.enum_type === Item_Enum.MINE) {
            for (let j = 0;j < good.value.hps.length;j++) {
                const hp = good.value.hps[j];
                const itype = good.value.num;
                const mine = {
                    type:itype,
                    index:j,
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

    return [...shuffle(miningedMines),...shuffle(mines)];
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
const doMining = (hoeType:number, seedMgr: RandomSeedMgr):number => {
    const cfgs = getMap(WeightMiningCfg._$info.name);
    const weights = [];
    const filterCfgs = [];
    let maxWeight = 0;
    for (const [k,cfg] of cfgs) {
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
export const calcMiningArray = (hoeType:HoeType,seed: number) => {
    const hits = [];
    let cSeed = seed;
    for (let i = 0;i < miningMaxHits;i++) {
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
export const getMiningMaxHp = (mineType:MineType) => {
    const cfgs = getMap(MineHpCfg._$info.name);
    for (const [k,v] of cfgs) {
        if (v.id === mineType) {
            return v.hp;
        }
    }

    return 0;
};