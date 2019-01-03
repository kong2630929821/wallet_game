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

// 勋章类型编号
export const MEDAL_KT0 = 8001;
export const MEDAL_KT20 = 8002;
export const MEDAL_KT50 = 8003;
export const MEDAL_KT100 = 8004;
export const MEDAL_KT200 = 8005;
export const MEDAL_KT500 = 8006;
export const MEDAL_KT1000 = 8007;
export const MEDAL_KT2000 = 8008;
export const MEDAL_KT5000 = 8009;
export const MEDAL_KT10000 = 8010;
export const MEDAL_KT20000 = 8011;
export const MEDAL_KT50000 = 8012;
export const MEDAL_KT100000 = 8013;
export const MEDAL_KT500000 = 8014;
export const MEDAL_KT1000000 = 8015;
export const MEDAL_ST = 8016;
export const MEDAL_ETH = 8017;
export const MEDAL_BTC = 8018;

// 消息推送类型编号
export const MESSAGE_TYPE_ADDMEDAL = 8000; // 添加奖章

// 标准单位转换为数据库储存单位的比例
// BTC单位 10^4 精度为小数点后4位
export const BTC_UNIT_NUM:number = 10 ^ (-4);
// ETH 单位:10^15 精度为小数点后3位
export const ETH_UNIT_NUM:number = 10 ^ (-15);
// ST 单位:10^4 精度为小数点后2位
export const ST_UNIT_NUM:number = 10 ^ (-4);
// KT 单位:10^8 即KT为整数
export const KT_UNIT_NUM:number = 10 ^ (-8);

// 人类10秒最快手速
export const MAX_HUMAN_HITS = 200;
// 一天最多挖矿数量
export const MAX_ONEDAY_MINING = 8;
// 连续登陆奖励循环天数
export const SERIES_LOGIN_CIRCLE = 15;
// 邀请好友开始循环奖励人数
export const INVITE_AWARD_CIRCLE = 15;
// 邀请好友循环奖励长度
export const INVITE_AWARD_CIRCLE_LENGTH = 3;
// 邀请好友第二级循环奖励
export const INVITE_AWARD_CIRCLE_LEVEL1 = 16;
// 邀请好友第一级循环奖励
export const INVITE_AWARD_CIRCLE_LEVEL2 = 17;
// 邀请好友第三级循环奖励
export const INVITE_AWARD_CIRCLE_LEVEL3 = 18;

// ================ 固定奖励 ===================
// 首次登陆奖励
export const FIRST_LOGIN_AWARD = 600101;
// 首次挖开矿山奖励
export const FIRST_MINING_AWARD = 600401;
// 特殊奖励id
export const THE_ELDER_SCROLLS = 'skyRim';

// 奖品来源
export const AWARD_SRC_LOGIN = 'login';
export const AWARD_SRC_INVITE = 'invite';
export const AWARD_SRC_MINE = 'mine';
export const AWARD_SRC_ROTARY = 'rotary';
export const AWARD_SRC_TREASUREBOX = 'treasurebox';
export const AWARD_SRC_CONVERT = 'convert';

// ================ 概率奖励 ===================
// 抽奖配置id
export const SMALL_MINE_TYPE_AWARD = 100101; // 小矿山挖矿
export const MIDDLE_MINE_TYPE_AWARD = 100201; // 中矿山挖矿
export const HUGE_MINE_TYPE_AWARD = 100301; // 大矿山挖矿
export const GET_RANDOM_MINE = 100401; // 获取矿山
export const COMPOSE_GOLD_TICKET = 100501; // 合成金券
export const COMPOSE_RAINBOW_TICKET = 100601; // 合成彩券
export const SILVER_TICKET_ROTARY = 100701; // 初级大转盘
export const GOLD_TICKET_ROTARY = 100801; // 中级大转盘
export const RAINBOW_TICKET_ROTARY = 100901; // 高级大转盘
export const SILVER_TICKET_TREASUREBOX = 101001; // 初级宝箱
export const GOLD_TICKET_TREASUREBOX = 101101; // 中级宝箱
export const RAINBOW_TICKET_TREASUREBOX = 101201; // 高级宝箱

// 合成消耗奖券
export const TICKET_COMPOSE_COUNT = 3;
// 大转盘消耗奖券
export const TICKET_ROTARY_COUNT = 2;
// 开宝箱消耗奖券
export const TICKET_TREASUREBOX_COUNT = 2;
// 获取邀请奖励最小人数
export const MIN_INVITE_NUM = 3;

// 转盘等级编号
export const LEVEL1_ROTARY = 1;
export const LEVEL2_ROTARY = 2;
export const LEVEL3_ROTARY = 3;
// 初级转盘消耗ST数
export const LEVEL1_ROTARY_STCOST = 10;
// 中级转盘消耗ST数
export const LEVEL2_ROTARY_STCOST = 100;
// 高级转盘消耗ST数
export const LEVEL3_ROTARY_STCOST = 1000;

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
// 查询余额
export const WALLET_API_QUERY = '/oAuth/balancequery';
// 修改余额
export const WALLET_API_ALTER = '/oAuth/alterbalance';
// 邀请人数
export const WALLET_API_INVITENUM = '/oAuth/invite';

// 货币类型
export const KT_WALLET_TYPE = 100;
export const ETH_WALLET_TYPE = 101;
export const BTC_WALLET_TYPE = 102;
export const ST_WALLET_TYPE = 103;