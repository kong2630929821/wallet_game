/**
 * 常量定义
 */

// 自增IDkey
// 用户id
export const INDEX_USER = 'uid';
export const INDEX_PRIZE = 'prizeid';

// 成功返回
export const RESULT_SUCCESS = 1;

// 物品枚举类型
export const MINE_ENUM_NUM = 1;
export const HOE_ENUM_NUM = 2;
export const BTC_ENUM_NUM = 3;
export const ETH_ENUM_NUM = 4;
export const ST_ENUM_NUM = 5;
export const KT_ENUM_NUM = 6;
export const TICKET_ENUM_NUM = 7;

// 物品类型总数
export const MAX_TYPE_NUM = 13;

// 物品类型编号
export const SMALL_MINE_TYPE = 1001;
export const MIDDLE_MINE_TYPE = 1002;
export const HUGE_MINE_TYPE = 1003;
export const IRON_HOE_TYPE = 2001;
export const GOLD_HOE_TYPE = 2002;
export const DIAMOND_HOE_TYPE = 2003;
export const BTC_TYPE = 3001;
export const ETH_TYPE = 4001;
export const ST_TYPE = 5001;
export const KT_TYPE = 6001;
export const SILVER_TICKET_TYPE = 7001;
export const GOLD_TICKET_TYPE = 7002;
export const RAINBOW_TICKET_TYPE = 7003;

// 人类10秒最快手速
export const MAX_HUMAN_HITS = 200;
// 一天最多挖矿数量
export const MAX_ONEDAY_MINING = 8;

// 首次挖开矿山奖励
export const FIRST_MINING_AWARD = 600401;

// 奖品来源
export const AWARD_SRC_MINE = 'mine';
export const AWARD_SRC_ROTARY = 'rotary';
export const AWARD_SRC_TREASUREBOX = 'treasurebox';
export const AWARD_SRC_CONVERT = 'convert';

// 抽奖配置id
export const SMALL_MINE_TYPE_AWARD = 100101; // 小矿山挖矿
export const MIDDLE_MINE_TYPE_AWARD = 100201; // 中矿山挖矿
export const HUGE_MINE_TYPE_AWARD = 100301; // 大矿山挖矿
export const GET_RANDOM_MINE = 100401; // 获取矿山
export const COMPOSE_GOLD_TICKET = 100501; // 合成金券
export const COMPOSE_RAINBOW_TICKET = 100601; // 合成彩券
export const SILVER_TICKET_ROTARY = 100701; // 银券大转盘
export const GOLD_TICKET_ROTARY = 100801; // 金券大转盘
export const RAINBOW_TICKET_ROTARY = 100901; // 彩券大转盘
export const SILVER_TICKET_TREASUREBOX = 101001; // 银券宝箱
export const GOLD_TICKET_TREASUREBOX = 101101; // 金券宝箱
export const RAINBOW_TICKET_TREASUREBOX = 101201; // 彩券宝箱

// 合成消耗奖券
export const TICKET_COMPOSE_COUNT = 3;
// 大转盘消耗奖券
export const TICKET_ROTARY_COUNT = 2;
// 开宝箱消耗奖券
export const TICKET_TREASUREBOX_COUNT = 2;

// 数据库名
export const WARE_NAME = 'file';
export const MEMORY_NAME = 'memory';

// 钱包服务器地址
export const WALLET_SERVER_URL = 'http://127.0.0.1:8099';
// appid
export const WALLET_APPID = '101';
// 私钥
export const WALLET_SERVER_KEY = 'xxxxxxxxx';
// 兑换邀请码
export const WALLET_API_CDKEY = '/oAuth/cdkey';