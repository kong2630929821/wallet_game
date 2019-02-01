/**
 * 竞猜活动常量配置
 */

// 主场队编号
export const HOST_TEAM_NUM = 1;
// 客场队编号
export const GUEST_TEAM_NUM = 2;

// 比赛结果
export const RESULT_NOT_EXIST = 0;
export const RESULT_TEAM1_WIN = 1;
export const RESULT_TEAM2_WIN = 2;
export const COMPETITION_HAS_CANCLED = 3;

// 结算状态
export const NOT_SETTLE_YET = 0;
export const GUESSING_IS_SETTLING = 1;
export const GUESSING_HAS_SETTLED = 2;

// 支付状态
export const NOT_PAY_YET = 0;
export const BILL_ALREADY_PAY = 1;
export const BILL_ALREADY_CHECK = 2;

// 单场竞猜最小投注
export const EACH_GUESSING_MIN = 10; // 0.1ST
// 单场竞猜投注上限
export const EACH_GUESSING_LIMIT = 1000; // 10ST
// 单场比赛总投注上限
export const EACH_COMPETITION_LIMIT = 2000; // 20ST
// 初始奖池上限
export const INIT_JACKPOTS_MAX = 5000; // 50ST