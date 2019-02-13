/**
 * 用户物品接口
 */
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import { AdAwardCfg } from '../../xlsx/awardCfg.s';
import { AWARD_SRC_ADVERTISEMENT, LEVEL1_ROTARY_AWARD, LEVEL1_TREASUREBOX_AWARD, MAX_FREEPLAY_ADAWARD, MAX_ONEDAY_ADAWARD, MAX_ONEDAY_MINING, MEMORY_NAME, MIN_ADVERTISEMENT_SECONDS, RESULT_SUCCESS, WARE_NAME } from '../data/constant';
import { Result } from '../data/db/guessing.s';
import { Award, AwardList, AwardQuery, BTC, DailyWatchAdNum, ETH, FreePlay, Hoe, Item, Items, KT, Mine, ST, TodayMineNum } from '../data/db/item.s';
import { Achievements, Medals, ShowMedal, ShowMedalRes } from '../data/db/medal.s';
import { ADAWARD_FREEPLAY_LIMIT, ADVERTISEMENT_NUM_ERROR, ADVERTISEMENT_TIME_ERROR, DB_ERROR, ONEDAY_ADAWARD_LIMIT } from '../data/errorNum';
import { addAward } from '../util/award.t';
import { add_award, add_itemCount, get_award_ids, get_mine_total, get_mine_type, get_today, items_init } from '../util/item_util.r';
import { get_enumType } from '../util/mining_util';
import { getUid } from './user.r';

// 添加矿山
// #[rpc=rpcServer]
export const add_mine = (): Mine => {
    // if (get_mine_total(uid) >= MAX_ONEDAY_MINING) return;
    const uid = getUid();
    const itemType = get_mine_type();
    const item = add_itemCount(uid, itemType, 1);

    return <Mine>item.value;
};

// 查询指定用户物品信息
// #[rpc=rpcServer]
export const item_query = (): Items => {
    const uid = getUid();
    console.log('item query in !!!!!!!!!!!!');
    const dbMgr = getEnv().getDbMgr();
    const userItemBucket = new Bucket(WARE_NAME, Items._$info.name, dbMgr);
    const items = <Items>userItemBucket.get(uid)[0];
    if (!items) {
        items_init(uid);

        return item_query();
    }

    return items;
};

// 获取指定物品信息
// #[rpc=rpcServer]
export const get_item = (itemType: number): Item => {
    console.log('get_item in !!!!!!!!!!!!');
    const itemInfo = item_query();
    if (!itemInfo) return;
    const items = itemInfo.item;
    for (const item of items) {
        if (item.value.num === itemType) {
            const resutlItem = new Item();
            resutlItem.enum_type = get_enumType(itemType);
            resutlItem.value = item.value;
            
            return resutlItem;
        }
    }
};

// 查询用户所有获奖信息
// #[rpc=rpcServer]
export const award_query = (awardQuery:AwardQuery): AwardList => {
    const uid = getUid();
    const src = awardQuery.src;
    const dbMgr = getEnv().getDbMgr();
    let pidList;
    const awardMap = get_award_ids(uid);
    const awardList = new AwardList();
    awardList.uid = uid;
    if (!awardMap.awards) {
        return awardList;
    } else {
        pidList = awardMap.awards;
        const bucket = new Bucket(WARE_NAME, Award._$info.name, dbMgr);
        const awards = bucket.get<[string],[Award]>(pidList);
        if (!awardQuery.src) {
            console.log('awards:!!!!!!!!!!!!!!!!!!!', awards);
            awardList.awards = awards;
        } else {
            const srcAwards = [];
            for (const award of awards) {
                console.log('src:!!!!!!!!!!!!!!!!!!!', award.src);
                if (award.src === src) {
                    srcAwards.push(award);
                    continue;
                }
            }
            console.log('srcAwards:!!!!!!!!!!!!!!!!!!!', srcAwards);
            awardList.awards = srcAwards;
        }

        return awardList;
    }
    
};

// 查询指定用户所有奖章
// #[rpc=rpcServer]
export const get_medals = ():Medals => {
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Medals._$info.name, dbMgr);
    let medals = bucket.get<number, [Medals]>(uid)[0];
    if (!medals) {
        medals = new Medals();
        medals.uid = uid;
        medals.medals = [];
    }
    
    return medals;
};

// 查看展示的奖章
// #[rpc=rpcServer]
export const get_showMedal = (uid: number):ShowMedalRes => {
    const showMedalRes = new ShowMedalRes(RESULT_SUCCESS, null);
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, ShowMedal._$info.name, dbMgr);
    const showMedal = bucket.get<number, [ShowMedal]>(uid)[0];
    if (!showMedal) return showMedalRes;
    showMedalRes.medalType = showMedal.medal;

    return showMedalRes;
};

// 展示奖章
// #[rpc=rpcServer]
export const show_medal = (medalType: number):ShowMedalRes => {
    console.log('show_medal in!!!!!!!!!!!!!!!!!', medalType);
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, ShowMedal._$info.name, dbMgr);
    const uid = getUid();
    const showMedal = new ShowMedal(uid, medalType);
    bucket.put(uid, showMedal);

    return new ShowMedalRes(RESULT_SUCCESS, medalType);
};

// 查询指定用户所有成就
// #[rpc=rpcServer]
export const get_achievements = ():Achievements => {
    const uid = getUid();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, Achievements._$info.name, dbMgr);
    let achievements = bucket.get<number, [Achievements]>(uid)[0];
    if (!achievements) {
        achievements = new Achievements();
        achievements.uid = uid;
        achievements.achievements = [];
    }
    
    return achievements;
};

// 看广告获得奖励
// #[rpc=rpcServer]
export const get_ad_award = (adType: number): Result => {
    console.log('get_ad_award!!!!!!!!!!!!');
    const uid = getUid();
    const result = new Result();
    const dbMgr = getEnv().getDbMgr();
    const bucket = new Bucket(WARE_NAME, DailyWatchAdNum._$info.name, dbMgr);
    let dailyWatchAdNum :DailyWatchAdNum;
    const date = get_today();
    const pid = `${uid}:${date}`;
    const timestamps = Math.floor((new Date()).valueOf() / 1000);
    dailyWatchAdNum = bucket.get<string, [DailyWatchAdNum]>(pid)[0];
    if (!dailyWatchAdNum) {
        dailyWatchAdNum = new DailyWatchAdNum();
        dailyWatchAdNum.id = pid;
        dailyWatchAdNum.num = 0;
        dailyWatchAdNum.lastTime = 0;
    }
    // 判断当天看广告获得奖励的次数是否达到上限
    if (dailyWatchAdNum.num >= MAX_ONEDAY_ADAWARD) {
        result.reslutCode = ONEDAY_ADAWARD_LIMIT;

        return result;
    }
    // 判断广告时间间隔是否达到最低时间间隔
    if (timestamps - dailyWatchAdNum.lastTime < MIN_ADVERTISEMENT_SECONDS) {
        result.reslutCode = ADVERTISEMENT_TIME_ERROR;

        return result;
    }
    // 根据广告类型从配置中获取奖励
    const cfgBucket = new Bucket(MEMORY_NAME, AdAwardCfg._$info.name, dbMgr);
    console.log('adType!!!!!!!!!!!!', adType);
    const adAward = cfgBucket.get<number, [AdAwardCfg]>(adType)[0];
    console.log('adAward!!!!!!!!!!!!', adAward);
    if (!adAward) {
        result.reslutCode = ADVERTISEMENT_NUM_ERROR;
        
        return result;
    }
    const awardType = adAward.prop;
    const count = adAward.num;
    const desc = adAward.desc;
    const src = AWARD_SRC_ADVERTISEMENT;
    // 奖励为免费转盘和宝箱次数
    const freePlayBucket = new Bucket(WARE_NAME, FreePlay._$info.name, dbMgr);
    if (adAward.prop === LEVEL1_ROTARY_AWARD) {
        const freePlay = freePlayBucket.get<number, [FreePlay]>(uid)[0];
        if (freePlay.adAwardRotary < MAX_FREEPLAY_ADAWARD) {
            freePlay.freeRotary += 1;
            freePlay.adAwardRotary += 1;
            freePlayBucket.put(uid, freePlay);
            dailyWatchAdNum.num += 1;
            dailyWatchAdNum.lastTime = timestamps;
            bucket.put(pid, dailyWatchAdNum);
            result.msg = JSON.stringify(freePlay);
            result.reslutCode = RESULT_SUCCESS;

            return result;
        } else {
            result.reslutCode = ADAWARD_FREEPLAY_LIMIT;

            return result;
        }
    }
    if (adAward.prop === LEVEL1_TREASUREBOX_AWARD) {
        const freePlay = freePlayBucket.get<number, [FreePlay]>(uid)[0];
        if (freePlay.adAwardBox < MAX_FREEPLAY_ADAWARD) {
            freePlay.freeBox += 1;
            freePlay.adAwardBox += 1;
            freePlayBucket.put(uid, freePlay);
            dailyWatchAdNum.num += 1;
            dailyWatchAdNum.lastTime = timestamps;
            bucket.put(pid, dailyWatchAdNum);
            result.msg = JSON.stringify(freePlay);
            result.reslutCode = RESULT_SUCCESS;

            return result;
        } else {
            result.reslutCode = ADAWARD_FREEPLAY_LIMIT;

            return result;
        }
    }
    // 添加奖励
    add_itemCount(uid, awardType, count);
    const award = add_award(uid, awardType, count, src, null, desc);
    if (!award) {
        result.reslutCode = DB_ERROR;
        
        return result;
    }
    dailyWatchAdNum.num += 1;
    dailyWatchAdNum.lastTime = timestamps;
    bucket.put(pid, dailyWatchAdNum);
    result.msg = JSON.stringify(award);
    result.reslutCode = RESULT_SUCCESS;

    return result;
};