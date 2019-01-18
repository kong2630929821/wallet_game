/**
*单场比赛表
*/
#[primary=cid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct Competition {
    cid: u32, // 比赛id 自增
    team1: u32, // 主场队伍编号
    team2: u32, // 客场队伍编号
    time: String, // 比赛开始时间
    matchType: u32, // 比赛类型
    result: u8, // 比赛结果 0 未开始 1 主场胜 2 客场胜 3 平
    state: u8 // 竞猜结算状态 0 未结算 1 结算中 2 已结算 
}

/**
*可竞猜比赛列表
*/
#[primary=compType,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct PreCompetitionList {
    compType: u32, // 比赛类型 
    list: Option<&[u32]> // 比赛id
}

/**
*比赛列表
*/
struct CompetitionList {
    list: Option<&[Competition]>
}

/**
*主页面比赛信息
*/
struct MainPageComp {
    comp: Competition, // 比赛基础信息
    team1num: Option<u32>, // 主场队支持人数
    team2num: Option<u32> // 客场队支持人数
}

/**
*主页面比赛信息列表
*/
struct MainPageCompList {
    list: Option<&[MainPageComp]>
}

/**
*竞猜主键
*/
struct GuessingKey {
    uid: u32,
    cid: u32,
    index: Option<u32>
}

/**
*单次竞猜表
*/
#[primary=gid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct Guessing {
    gid: GuessingKey, // 竞猜id
    teamSide: u8, // 选择队伍 1:主场, 2:客场
    rate: f32, // 购买时预计赔率
    num: u32, // 购买金额
    oid: String, // 订单号
    state: u8, // 支付状态
    benefit: u32, // 预计收益
    time: String, // 购买时间
}

/**
*奖池表
*/
#[primary=cid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct CompJackpots {
    cid: u32, // 比赛id
    jackpot1: u32, // 支持主场队伍的奖池
    jackpot2: u32, // 支持客场队伍的奖池
    guessings1: Option<&[GuessingKey]>, // 支持主场队伍的竞猜主键
    guessings2: Option<&[GuessingKey]>, // 支持客场队伍的竞猜主键
}

/**
*用户竞猜表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct GuessingKeyList {
    uid: u32,
    list: Option<&[GuessingKey]>
}

/**
*用户竞猜历史信息
*/
#[constructor=true]
struct UserGuessingInfo {
    competition: Competition,
    team1num: u32,
    team2num: u32,
    guessing: Guessing
}

/**
*用户竞猜历史列表
*/
struct UserGuessingList {
    list: Option<&[UserGuessingInfo]>
}

/**
*用户单场比赛总投入表
*/
#[primary=gid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct UserGuessing {
    gid: GuessingKey,
    total: u32
}

/**
*竞猜请求
*/
struct GuessingReq {
    cid: u32, // 比赛id
    teamSide: u8, // 选择队伍 1 主场队 2 客场队
    num: u32 // 投注金额
}

/**
*新增比赛
*/
#[constructor=true]
struct AddCompetition {
    team1: u32,
    team2: u32,
    time: String,
    matchType: u32,
    team1num: u32, 
    team2num: u32
}

/**
*比赛结果
*/
#[constructor=true]
struct CompResult {
    cid: u32,
    result: u8
}

/**
*rpc返回结果
*/
struct Result {
    reslutCode: u32,
    msg: Option<String>
}