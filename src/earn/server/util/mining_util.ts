/**
 * 
 */
import { iterDb, read } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { WeightMiningCfg } from '../../xlsx/awardCfg.s';
import { BTC_ENUM_NUM, BTC_TYPE, DIAMOND_HOE_TYPE, ETH_ENUM_NUM, ETH_TYPE, GOLD_HOE_TYPE, GOLD_TICKET_TYPE, HOE_ENUM_NUM, HUGE_MINE_TYPE, HUGE_MINE_TYPE_AWARD, IRON_HOE_TYPE, KT_ENUM_NUM, KT_TYPE, MEMORY_NAME, MIDDLE_MINE_TYPE, MIDDLE_MINE_TYPE_AWARD, MINE_ENUM_NUM, RAINBOW_TICKET_TYPE, SILVER_TICKET_TYPE, SMALL_MINE_TYPE, SMALL_MINE_TYPE_AWARD, ST_ENUM_NUM, ST_TYPE, TICKET_ENUM_NUM } from '../data/constant';
import { getWeightIndex } from './award';
import { RandomSeedMgr } from './randomSeedMgr';

// 处理挖矿单次事件(一次点击)
export const doMining = (hoeType:number, seedMgr: RandomSeedMgr):number => {
    console.log('doMininng in!!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const cfgs: WeightMiningCfg[] = [];
    const weights = [];
    let maxWeights = 0;
    console.log('!!!!!!!!!!!!!!before read');
    read(dbMgr, (tr: Tr) => {
        let maxCount = 0;
        const pid = hoeType * 100 + 1;
        console.log('!!!!!!!!!!!!!!pid', pid);
        const iterCfg = iterDb(tr, MEMORY_NAME, WeightMiningCfg._$info.name, pid, false, null);
        console.log('!!!!!!!!!!!!!!iterCfg:', iterCfg);
        do {
            const elCfg = iterCfg.nextElem();
            console.log('elCfg----------------read---------------', elCfg);
            if (!elCfg) return;
            const cfg: WeightMiningCfg = elCfg[1];
            if (maxCount <= 0) maxCount = cfg.count;
            cfgs.push(cfg);
            maxWeights = cfg.weight + maxWeights;
            weights.push(maxWeights);
            maxCount--;
        } while (maxCount > 0);
    });
    const i = getWeightIndex(weights, seedMgr.seed);
    const cfg: WeightMiningCfg = cfgs[i];
    let hits;
    hits = cfg.hits;
    
    return hits;
};

// 获取物品枚举编号
export const get_enumType = (itemType:number):number => {
    switch (itemType) {
        case SMALL_MINE_TYPE || MIDDLE_MINE_TYPE || HUGE_MINE_TYPE:
            return MINE_ENUM_NUM;
        case IRON_HOE_TYPE || GOLD_HOE_TYPE || DIAMOND_HOE_TYPE:
            return HOE_ENUM_NUM;
        case BTC_TYPE:
            return BTC_ENUM_NUM;
        case ETH_TYPE:
            return ETH_ENUM_NUM;
        case ST_TYPE:
            return ST_ENUM_NUM;
        case KT_TYPE:
            return KT_ENUM_NUM;
        case SILVER_TICKET_TYPE | GOLD_TICKET_TYPE | RAINBOW_TICKET_TYPE:
            return TICKET_ENUM_NUM;
        default:
            return;
    }
};

// 获取抽奖配置id
export const get_cfgAwardid = (itemType:number):number => {
    switch (itemType) {
        case SMALL_MINE_TYPE:
            return SMALL_MINE_TYPE_AWARD;
        case MIDDLE_MINE_TYPE:
            return MIDDLE_MINE_TYPE_AWARD;
        case HUGE_MINE_TYPE:
            return HUGE_MINE_TYPE_AWARD;
        default:
            return;
    }
};