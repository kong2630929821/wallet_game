/**
 * 错误编码
 */

// 数据库错误 
export const DB_ERROR = 600;
// 物品数量错误
export const ITEM_NUM_ERROR = 700;
// 配置错误
export const CONFIG_ERROR = 800;

// 该类型矿山数量不足
export const MINE_NOT_ENOUGH = 1101;
// 挖矿数量已达限制
export const MINENUM_OVER_LIMIT = 1102;
// 获取随机种子失败
export const GET_RANDSEED_FAIL = 1103;
// 该类型锄头数量不足
export const HOE_NOT_ENOUGH = 1104;
// 10秒内点击次数异常
export const ARE_YOU_SUPERMAN = 1105;
// 这座矿山不存在
export const MINE_NOT_EXIST = 1106;

// 邀请人数不足兑换奖励
export const INVITE_NOT_ENOUGH = 2101;
// 邀请奖励已经领取
export const INVITE_AWARD_ALREADY_TAKEN = 2102; 

// ST数量不足
export const ST_NOT_ENOUGH = 3101;
// 转盘类型错误
export const ROTARY_TYPE_ERROR = 3102;
// 宝箱类型错误
export const TREASUREBOX_TYPE_ERROR = 3103;

// ST数量错误
export const ST_NUM_ERROR = 4101;
// 比赛不存在
export const COMPETITION_NOT_EXIST = 4102;
// 比赛已经封盘
export const COMPETITION_ALREADY_CLOSE = 4103;
// 单场比赛竞猜总投注超过上限
export const GUESSINGNUM_BEYOUND_LIMIT = 4104;

// 用户奖券不足
export const TICKET_NOT_ENOUGH = 7101;
// 奖券类型错误
export const TICKET_TYPE_ERROR = 7102;
// 奖品已经兑完
export const AWARD_NOT_ENOUGH = 7103;

// 获取排行数据失败
export const TOP_DATA_FAIL = 8101;
// 向钱包服务器请求数据失败
export const REQUEST_WALLET_FAIL = 8102;

// 默认错误代码
export const DEFAULT_ERROR_NUMBER = -1;