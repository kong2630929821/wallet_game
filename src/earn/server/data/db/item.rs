//矿山血量
struct MineHp {
    num: u32,
    hp: u32
}

//矿山
struct Mine {
    num: u32, //编号
    count: u32, //数量
    hps: &[Option<MineHp>] //血量数组
}

//锄头
struct Hoe {
    num: u32, //编号
    count: u32 //数量
}

//BTC
struct BTC {
    num: u32, //编号
    count: u32 //数量
}

//ETH
struct ETH {
    num: u32, //编号
    count: u32 //数量
}

//ST
struct ST {
    num: u32, //编号
    count: u32 //数量
}

//KT
struct KT {
    num: u32, //编号
    count: u32 //数量
}

//奖券
struct Ticket {
    num: u32, //编号
    count: u32 //数量
}


//物品枚举
enum Item {
    MINE(Mine), //矿山
    HOE(Hoe), //锄头
    BTC(BTC),
    ETH(ETH),
    ST(ST),
    KT(KT),
    TICKET(Ticket), //奖券
}

//物品返回结果
struct ItemResponse{
    resultNum: u32,
    item: Option<Item>
}

//挖矿返回结果
struct MiningResponse{
    resultNum: u32,
    leftHp: Option<u32>, //矿山剩余血量
    awards: Option<&[Item]>, //奖励物品
    mine:Option<Mine> //赠送矿山
}

/**
*物品表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct Items {
    uid: u32,
    item: &[Item],
}


//物品列表返回结果
struct ItemsResponse{
    resultNum: u32,
    item: Option<Items>
}

/**
*奖品表
*/
#[primary=id,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct Award {
    id: String,
    awardType: u32,
    count: u32,
    uid: u32,
    src: String,
    time: String,
    desc: Option<String>,
    convert: Option<String>,
    deadTime: Option<String>
}

/**
*奖品MAP表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct AwardMap {
    uid: u32,
    awards: Option<&[String]>
}

/**
*值钱的奖品表(BTC,ETH,ST)
*/
#[primary=id,db=file,dbMonitor=true,hasmgr=false]
struct SpecialAward {
    id: String,
    awardType: u32,
    count: u32,
    uid: u32,
    src: String,
    time: String,
}

/**
*查询获奖信息
*/
struct AwardQuery {
    src: Option<String>
}

/**
*获奖信息列表
*/
struct AwardList {
    uid: u32,
    awards: Option<&[Award]>
}

/**
*随机种子内存表
*/
#[primary=uid,db=memory,dbMonitor=true,hasmgr=false]
struct MineSeed {
    uid: u32,
    seed: u32,
    hoeType: u32
}

/**
*单日矿山数量表
*/
#[primary=id,db=file,dbMonitor=true,hasmgr=false]
struct TodayMineNum {
    id: String,
    mineNum: u32
}

/**
*总挖矿数量表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct TotalMiningNum {
    uid: u32,
    openid: String,
    total: u32
}

/**
*总挖矿数量MAP
*/
struct MiningMap {
    total: u32,
    uid: u32
}

/**
*总挖矿数量MAP表
*/
#[primary=miningMap,db=file,dbMonitor=true,hasmgr=false]
struct TotalMiningMap {
    miningMap: MiningMap,
    openid: String
}

/**
*挖矿得到KT数量表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct MiningKTNum {
    uid: u32,
    openid: String,
    total: u32
}

/**
*挖矿得到KT数MAP
*/
struct MiningKTMap {
    ktNum: u32,
    uid: u32
}

/**
*挖矿得到KT数MAP表
*/
#[primary=miningKTMap,db=file,dbMonitor=true,hasmgr=false]
struct MiningKTMapTab {
    miningKTMap: MiningKTMap,
    openid: String
}

/**
*当天免费初级转盘表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct FreeRotary {
    uid: u32,
    free: bool
}

/**
*挖矿得到KT数量排行
*/
struct MineKTTop {
    topList: Option<&[MiningKTMapTab]>,
    myNum: Option<u32>,
    resultNum: u32
}

/**
*已兑换奖券的KT数量表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct UsedKT {
    uid: u32,
    KTNum: u32
}

/**
*总挖矿数量排行
*/
struct MineTop {
    topList: Option<&[TotalMiningMap]>,
    myNum: Option<u32>,
    resultNum: u32
}

/**
*虚拟奖品兑换码表
*/
#[primary=id,db=file,dbMonitor=true,hasmgr=false]
struct ConvertTab {
    id: u32,
    typeNum: u32,
    convert: String,
    state: bool,
    deadTime: String
}

/**
*奖品返回
*/
struct AwardResponse {
    resultNum: u32,
    award:Option<Award>
}

/**
*邀请奖励领取返回
*/
struct InviteAwardRes {
    resultNum: u32,
    award:Option<&[Award]>
}