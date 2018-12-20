/**
 * 
 */
import { iterDb, read } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { WeightMiningCfg } from '../../xlsx/miningCfg.s';
import { MEMORY_NAME } from '../data/constant';
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