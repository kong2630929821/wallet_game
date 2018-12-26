struct SpecificMine {
    uid:u32,
    enumType:u32,
    itemType:u32,
    mineNum:u32
}

struct Seed {
    seed: u32
}

//挖矿结果
struct MiningResult {
    itemType: u32,
    mineNum: u32, //具体类型矿山的数组下标
    hit: u32 //用户点击次数
}