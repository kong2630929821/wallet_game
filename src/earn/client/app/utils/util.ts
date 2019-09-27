/**
 * common util
 */
import { popNewMessage } from '../../../../app/utils/tools';
import { Item_Enum } from '../../../server/data/db/item.s';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
import { InviteAwardCfg, RegularAwardCfg, SeriesLoginAwardCfg, WeightAwardCfg, WeightMiningCfg } from '../../../xlsx/awardCfg.s';
import { LOLTeamInfosCfg, LOLTypeCfg } from '../../../xlsx/competition.s';
import { ErrorNumCfg } from '../../../xlsx/errorNum.s';
import { AchievementMedalCfg, MedalCfg, MineHpCfg } from '../../../xlsx/item.s';
import { getMap } from '../store/cfgMap';
import { getStore, Invited } from '../store/memstore';
import { ActTicketNumCfg, PrizeCfg } from '../xls/dataCfg.s';
import { ActivityType, CoinType } from '../xls/dataEnum.s';
import { HoeType } from '../xls/hoeType.s';
import { MineType } from '../xls/mineType.s';
import { miningMaxHits } from './constants';

/**
 * 获取用户单个物品数量  kt/st等
 */
export const getGoodCount = (itemType: CoinType) => {
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
    const cfgs = getMap(WeightMiningCfg);
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
// 获取连续邀请好友的奖励列表
export const getContinuousInvitation = (index:number) => {
    console.log('index',index);
    const cfgs = getMap(InviteAwardCfg);
    const cfg = [];
    for (const [k, cf] of cfgs) {
        cfg.push(cf);
    }
    const awards = [];
    if (index <= 3) {
    
        return cfg.slice(0,7);
    } else if (index > 3 && index < 15) {
        awards.push(...cfg.slice(index - 3,index));

        return awards.concat(cfg.slice(index,index + 4));
    } else {
        let k = 0;
        for (let i = 18;i < index + 10;i++) {
            
                // tslint:disable-next-line:binary-expression-operand-order
            cfg.push({ id:i + 1,prop:2000 + k % 3 + 1,num:1 });
            k++;
        }
        console.log(cfg);
        awards.push(...cfg.slice(index - 3,index));
        
        return awards.concat(cfg.slice(index,index + 4));
    }
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
    const cfgs = getMap(MineHpCfg);
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
    const cfgs = getMap(ActTicketNumCfg);
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
    const cfgs = getMap(PrizeCfg);
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
    const cfgs = getMap(WeightAwardCfg);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if (cfg.id >= activityType && cfg.id <= (activityType + 99)) {
            const data = {
                prop:cfg.prop,
                num:cfg.max
            };
            filterCfgs.push(data);
        }
    }

    return shuffle(filterCfgs);
};

/**
 * 获取固定项目奖品列表
 */
export const getRegularPrizeList = (activityType: ActivityType): any => {
    const cfgs = getMap(RegularAwardCfg);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if (cfg.id >= activityType  && cfg.id < (activityType + 99)) {
            filterCfgs.push(cfg);
        }
    }

    return filterCfgs;
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

/**
 * 获取成就勋章列表
 */
export const getACHVmedalList = (typeNum: string | number, typeStr: string) => {
    const cfgs = getMap(AchievementMedalCfg);
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
// export const computeRankMedal = () => {

//     const ktNum = getStore('balance/KT');
//     const medalList = getMedalList(CoinType.KT, 'coinType');
//     const mineMedal = {
//         rankMedal: 8000,
//         desc: {},
//         nowClass:'',
//         nextNeedKt: 0,
//         ktNum
//     };
//     for (let i = 0; i < medalList.length; i++) {
//         const element = medalList[i];
//         if (ktNum >= element.coinNum) {
//             mineMedal.rankMedal = element.id;
//             mineMedal.desc = { zh_Hans: element.desc, zh_Hant: element.descHant, en: '' };
//             mineMedal.nowClass = element.typeNum;  
//             if ((i + 1) <= medalList.length) {

//                 mineMedal.nextNeedKt = medalList[i + 1].coinNum - ktNum;
//             } else {
//                 mineMedal.nextNeedKt = 0;
//             }
//         }
//     }

//     return mineMedal;
// };

/**
 * 展示错误信息
 * @param errorNum 错误编号
 */
export const showActError = (errorNum: number) => {
    const cfgs = getMap(ErrorNumCfg);
    for (const [k, cfg] of cfgs) {
        if (errorNum === k) {
            return { zh_Hans: cfg.desc, zh_Hant: cfg.descHant, en: '' };
        }
    }

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
  * 获取队伍信息
  * @param teamNum 可选,队伍编号，不填返回所有
  */
export const getTeamCfg = (teamNum?:number) => {
    const cfgs = getMap(LOLTeamInfosCfg);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if (teamNum && teamNum === cfg.pid) {
            return cfg;
        } else {
            filterCfgs.push(cfg);
        }
    }

    return filterCfgs;
};

 /**
  * 获取赛事信息
  * @param macthType 可选,赛事编号，不填返回所有
  */
export const getMacthTypeCfg = (macthType?:number) => {
    const cfgs = getMap(LOLTypeCfg);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if (macthType && macthType === cfg.pid) {
            return cfg;
        } else {
            filterCfgs.push(cfg);
        }
    }

    return filterCfgs;
};

/**
 * 判断是否有邀请奖励可以领取
 */
export const canInviteAward = (invited:Invited) => {
    return invited.convertedInvitedAward.indexOf(1) >= 0 ;
};

export const isLogin = () => {
    const uid = getStore('userInfo/uid');

    return true;
    if (uid === -1) {
        popNewMessage('请登录再玩');
        
        return false;
    } else {
        return true;
    }
};

/**
 * 货币逗号格式化处理
 */
export const formateCurrency = (value:number) => {
    return `${value.toLocaleString()}.00`;
};