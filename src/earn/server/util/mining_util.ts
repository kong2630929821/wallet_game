/**
 * 
 */
import { iterDb, read } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { Bucket } from '../../utils/db';
import { WeightMiningCfg } from '../../xlsx/awardCfg.s';
import { BTC_ENUM_NUM, BTC_TYPE, DIAMOND_HOE_TYPE, ETH_ENUM_NUM, ETH_TYPE, GOLD_HOE_TYPE, GOLD_TICKET_TYPE, HOE_ENUM_NUM, HUGE_MINE_TYPE, HUGE_MINE_TYPE_AWARD, IRON_HOE_TYPE, KT_ENUM_NUM, KT_TYPE, MEMORY_NAME, MIDDLE_MINE_TYPE, MIDDLE_MINE_TYPE_AWARD, MINE_ENUM_NUM, RAINBOW_TICKET_TYPE, SILVER_TICKET_TYPE, SMALL_MINE_TYPE, SMALL_MINE_TYPE_AWARD, ST_ENUM_NUM, ST_TYPE, TICKET_ENUM_NUM, WARE_NAME } from '../data/constant';
import { MiningKTMap, MiningKTMapTab, MiningKTNum, MiningMap, TotalMiningMap, TotalMiningNum } from '../data/db/item.s';
import { get_miningKTNum, get_totalminingNum } from '../rpc/mining.r';
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

// 添加用户挖矿山总数
export const add_miningTotal = (uid: number) => {
    console.log('add_miningTotal in!!!!!!!!!!!!!!!!!!!!!!!');
    const miningtotal = get_totalminingNum(uid);
    const miningMap = new MiningMap();
    miningMap.total = miningtotal.total;
    miningMap.uid = uid;
    console.log('miningMap !!!!!!!!!!!!!!!!!!!!!!!', miningMap);
    miningtotal.total = miningtotal.total + 1;
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, TotalMiningNum._$info.name, dbMgr);
    bucket.put(uid, miningtotal);
    const mapBucket = new Bucket(WARE_NAME, TotalMiningMap._$info.name, dbMgr);
    console.log('miningtotal !!!!!!!!!!!!!!!!!!!!!!!', miningtotal);
    const totalMiningMap = mapBucket.get<MiningMap, [TotalMiningMap]>(miningMap)[0];
    if (!totalMiningMap) {
        console.log('blanktotalMiningMap in!!!!!!!!!!!!!!!!!!!!!!!', totalMiningMap);
        const blanktotalMiningMap = new TotalMiningMap();
        const blankminingMap = new MiningMap();
        blankminingMap.uid = uid;
        blankminingMap.total = 1;
        blanktotalMiningMap.miningMap = blankminingMap;
        blanktotalMiningMap.uName = miningtotal.uName;
        mapBucket.put(blankminingMap, blanktotalMiningMap);
    } else {
        mapBucket.delete(miningMap);
        miningMap.total = miningtotal.total;
        totalMiningMap.miningMap =  miningMap;
        console.log('totalMiningMap write !!!!!!!!!!!!!!!!!!!!!!!', totalMiningMap);
        mapBucket.put(miningMap, totalMiningMap);
    }
};

// 添加挖矿获取KT总数
export const add_miningKTTotal = (uid: number, ktNum: number) => {
    console.log('add_miningKTTotal in!!!!!!!!!!!!!!!!!!!!!!!');
    const miningKTTotal = get_miningKTNum(uid);
    const miningKTMap = new MiningKTMap();
    miningKTMap.uid = uid;
    miningKTMap.ktNum = miningKTTotal.total;
    miningKTTotal.total = miningKTTotal.total + ktNum;
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, MiningKTNum._$info.name, dbMgr);
    bucket.put(uid, miningKTTotal);
    const mapBucket = new Bucket(WARE_NAME, MiningKTMapTab._$info.name, dbMgr);
    console.log('miningKTTotal !!!!!!!!!!!!!!!!!!!!!!!', miningKTTotal);
    const miningKTMapTab = mapBucket.get<MiningKTMap, [MiningKTMapTab]>(miningKTMap)[0];
    if (!miningKTMapTab) {
        console.log('blankMiningMapTab in!!!!!!!!!!!!!!!!!!!!!!!', miningKTMapTab);
        const blankMiningMapTab = new MiningKTMapTab();
        const blankminingKTMap = new MiningKTMap();
        blankminingKTMap.uid = uid;
        blankminingKTMap.ktNum = ktNum;
        blankMiningMapTab.miningKTMap = blankminingKTMap;
        blankMiningMapTab.uName = miningKTTotal.uName;
        mapBucket.put(blankminingKTMap, blankMiningMapTab);
    } else {
        mapBucket.delete(miningKTMap);
        miningKTMap.ktNum = miningKTTotal.total;
        miningKTMapTab.miningKTMap =  miningKTMap;
        console.log('miningKTMapTab write !!!!!!!!!!!!!!!!!!!!!!!', miningKTMapTab);
        mapBucket.put(miningKTMap, miningKTMapTab);
    }
};

// 获取物品枚举编号
export const get_enumType = (itemType:number):number => {
    switch (itemType) {
        case SMALL_MINE_TYPE:
            return MINE_ENUM_NUM;
        case MIDDLE_MINE_TYPE:
            return MINE_ENUM_NUM;
        case HUGE_MINE_TYPE:
            return MINE_ENUM_NUM;
        case IRON_HOE_TYPE:
            return HOE_ENUM_NUM;
        case GOLD_HOE_TYPE:
            return HOE_ENUM_NUM;
        case DIAMOND_HOE_TYPE:
            return HOE_ENUM_NUM;
        case BTC_TYPE:
            return BTC_ENUM_NUM;
        case ETH_TYPE:
            return ETH_ENUM_NUM;
        case ST_TYPE:
            return ST_ENUM_NUM;
        case KT_TYPE:
            return KT_ENUM_NUM;
        case SILVER_TICKET_TYPE:
            return TICKET_ENUM_NUM;
        case GOLD_TICKET_TYPE:
            return TICKET_ENUM_NUM;
        case RAINBOW_TICKET_TYPE:
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