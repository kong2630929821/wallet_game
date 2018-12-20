
//矿山
struct Mine {
    num: u32, //编号
    count: u32, //数量
    hps: &[u32], //血量数组
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


//物品枚举
enum Item {
    MINE(Mine), //矿山
    HOE(Hoe), //锄头
    BTC(BTC),
    ETH(ETH),
    ST(ST),
    KT(KT),
}

//挖矿返回结果
struct MiningResponse{
    leftHp: u32, //矿山剩余血量
    award: Option<Item>, //奖励物品
}

/**
*物品表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct Items {
    uid: u32,
    item: &[Item],
}

/**
*奖品表
*/
#[primary=id,db=file,dbMonitor=true,hasmgr=false]
struct Prizes {
    id: u32,
    prize: Item,
    uid: u32,
    src: String,
    time: u32,
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