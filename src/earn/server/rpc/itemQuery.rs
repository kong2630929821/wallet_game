#[path=../../xlsx/]
use awardCfg.s::{STConvertCfg};

struct SpecificMine {
    uid:u32,
    enumType:u32,
    itemType:u32,
    mineNum:u32
}

struct SeedResponse {
    resultNum: u32,
    seed: Option<u32>
}

//挖矿结果
struct MiningResult {
    itemType: u32,
    mineNum: u32, //具体类型矿山的数组下标
    hit: u32 //用户点击次数
}

//连续登陆天数查询结果
struct SeriesDaysRes {
    resultNum: u32,
    days: Option<u32>
}

//钱包服务器查询结果
struct CoinQueryRes {
    resultNum: u32,
    itemType: u32,
    num: Option<u32>
}

// 兑换物品(虚拟)
struct ConvertAwardList {
    list: &[STConvertCfg]
}