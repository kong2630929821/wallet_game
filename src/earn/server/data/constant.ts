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
export const MESSAGE_TYPE_ADDMEDAL = 'add_medal'; // 添加奖章
export const MESSAGE_TYPE_ADDAWARD = 'add_award'; // 添加奖励
export const MESSAGE_TYPE_DAILY_FIREST_LOGIN = 'daily_first_login'; // 当天首次登陆
export const MESSAGE_TYPE_INVITE = 'invite_success'; // 邀请成功
export const MESSAGE_TYPE_CONVERT_INVITE_CODE = 'convert_invite_code_success'; // 兑换邀请码成功

// 标准单位转换为数据库储存单位的比例
// BTC单位 10^4 精度为小数点后4位
export const BTC_UNIT_NUM:number = 10 ** 4;
// ETH 单位:10^15 精度为小数点后3位
export const ETH_UNIT_NUM:number = 10 ** 15;
// ST 单位:10^4 精度为小数点后2位
export const ST_UNIT_NUM:number = 10 ** 4;
// KT 单位:10^9 即KT为整数
export const KT_UNIT_NUM:number = 10 ** 9;

// 人类10秒最快手速
export const MAX_HUMAN_HITS = 200;
// 一天最多挖矿数量
export const MAX_ONEDAY_MINING = 8;
// 每人每天看广告可获得ST奖励次数
export const MAX_ONEDAY_ADAWARD = 10;
// 激励视频广告最低间隔时间
export const MIN_ADVERTISEMENT_SECONDS = 15;
// 每天广告奖励转盘或宝箱最大次数
export const MAX_FREEPLAY_ADAWARD = 10;

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

// ================ 奖励类型 =============
// 兑换邀请码
export const AWARD_INVITE = 'invite';

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
export const AWARD_SRC_ADVERTISEMENT = 'advertisement';
export const AWARD_SRC_TASK = 'task';

// ================ 概率奖励 ===================
// 抽奖配置id
export const SMALL_MINE_TYPE_AWARD = 100101; // 小矿山挖矿
export const MIDDLE_MINE_TYPE_AWARD = 100201; // 中矿山挖矿
export const HUGE_MINE_TYPE_AWARD = 100301; // 大矿山挖矿
export const GET_RANDOM_MINE = 100401; // 获取矿山
export const COMPOSE_GOLD_TICKET = 100501; // 合成金券
export const COMPOSE_RAINBOW_TICKET = 100601; // 合成彩券
export const LEVEL1_ROTARY_AWARD = 100701; // 初级大转盘
export const LEVEL2_ROTARY_AWARD = 100801; // 中级大转盘
export const LEVEL3_ROTARY_AWARD = 100901; // 高级大转盘
export const LEVEL1_TREASUREBOX_AWARD = 101001; // 初级宝箱
export const LEVEL2_TREASUREBOX_AWARD = 101101; // 中级宝箱
export const LEVEL3_TREASUREBOX_AWARD = 101201; // 高级宝箱

// 合成消耗奖券
export const TICKET_COMPOSE_COUNT = 3;
// 大转盘消耗奖券
export const TICKET_ROTARY_COUNT = 2;
// 开宝箱消耗奖券
export const TICKET_TREASUREBOX_COUNT = 2;
// 获取邀请奖励最小人数
export const MIN_INVITE_NUM = 3;

// 初级转盘消耗ST数
export const LEVEL1_ROTARY_STCOST = 10;
// 中级转盘消耗ST数
export const LEVEL2_ROTARY_STCOST = 100;
// 高级转盘消耗ST数
export const LEVEL3_ROTARY_STCOST = 1000;
// 初级宝箱消耗ST数
export const LEVEL1_TREASUREBOX_STCOST = 10;
// 中级宝箱消耗ST数
export const LEVEL2_TREASUREBOX_STCOST = 100;
// 高级宝箱消耗ST数
export const LEVEL3_TREASUREBOX_STCOST = 1000;

// 初级转盘消耗KT数
export const LEVEL1_ROTARY_KTCOST = 10;
// 中级转盘消耗KT数
export const LEVEL2_ROTARY_KTCOST = 50;
// 高级转盘消耗KT数
export const LEVEL3_ROTARY_KTCOST = 500;
// 初级宝箱消耗KT数
export const LEVEL1_TREASUREBOX_KTCOST = 10;
// 中级宝箱消耗KT数
export const LEVEL2_TREASUREBOX_KTCOST = 50;
// 高级宝箱消耗KT数
export const LEVEL3_TREASUREBOX_KTCOST = 500;

// 广告类型ID
export const MINE_AD_TYPE = 1;
export const GUESSING_AD_TYPE = 2;
export const ROTARY_AD_TYPE = 3;
export const BOX_AD_TYPE = 4;

// 没有奖品
export const SURPRISE_BRO = 9527;
export const NO_AWARD_SORRY = 'noaward';

// 数据库名
export const WARE_NAME = 'file';
export const MEMORY_NAME = 'memory';

// 钱包服务器地址
export const WALLET_SERVER_URL = 'http://39.98.200.23:8099';
// appid
export const WALLET_APPID = '11';
// mch_id
export const WALLET_MCH_ID = '1';
// 私钥
export const WALLET_SERVER_KEY = '1468577c399931bd1443aedb915267421863547ede5939eb8a3b7d1f20d1ac78';
// 兑换邀请码
export const WALLET_API_CDKEY = '/oAuth/cdkey';
// 查询余额
export const WALLET_API_QUERY = '/oAuth/balancequery';
// 修改余额
export const WALLET_API_ALTER = '/oAuth/alterbalance';
// 邀请人数
export const WALLET_API_INVITENUM = '/oAuth/invite';
// 邀请真实人数
export const WALLET_API_INVITENUM_REAL = '/oAuth/invite_real';
// 生成钱包订单
export const WALLET_API_UNIFIEDORDER = '/pay/unifiedorder';
// 订单查询
export const WALLET_ORDER_QUERY = '/pay/orderquery';
// 获取AccId
export const WALLET_GET_ACCID = 'user/get_accIds';

// 货币类型
export const KT_WALLET_TYPE = 100;
export const ETH_WALLET_TYPE = 101;
export const BTC_WALLET_TYPE = 102;
export const ST_WALLET_TYPE = 103;

// 邀请码起始长度
export const CODE_START_LENGTH = 6;
// 邀请码最大冲突数
export const CODE_MAX_CONFLICTS = 5;
// 红包Rid起始长度
export const RID_START_LENGTH = 11;
// 红包兑换码起始长度
export const CID_START_LENGTH = 13;

// 红包类型
export const NORMAL_RED_BAG = 1; // 普通红包
export const RANDOM_RED_BAG = 2; // 拼手气红包
// 红包过期时间
export const RED_BAG_TIMEOUT = 1; // 单位 天