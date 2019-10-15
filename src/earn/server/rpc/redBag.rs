// 发送红包
struct EmitRedBag {
    redBag_type: u8, // 红包类型
    coin_type: u8, // 货币类型
    total_amount: u32, // 总金额
    count: u32, // 数量
    desc: String, // 描述
}