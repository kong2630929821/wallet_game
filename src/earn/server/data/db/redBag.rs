struct CidAmount {
    cid: String, // 兑换码
    amount: u32, // 金额
}

// 红包信息表
#[primary=rid,db=file,dbMonitor=true,hasmgr=false]
struct RedBagInfo {
    rid: String,   // 红包id
    uid: u32,   // 发送人用户id
    oid: String, // 流水订单号
    redBag_type: u8, // 红包类型
    coin_type: u32, // 货币类型
    total_amount: u32, // 总金额
    left_amount: u32, // 剩余金额
    desc: String, // 描述
    send_time: String, // 发送时间
    update_time: String, // 最近更新时间
    timeout: String, // 过期时间
    cid_list: &[CidAmount], // 兑换码和金额列表
    left_cid_list: &[CidAmount], // 剩余兑换码和金额列表
}

// 红包兑换码信息表
#[primary=cid,db=file,dbMonitor=true,hasmgr=false]
struct RedBagConvert {
    cid: String, // 兑换码id
    rid: String, // 红包id
    send_uid: u32, // 发送者uid
    uid: u32, // 领取用户uid
    coin_type: u32, // 货币类型
    amount: u32, // 兑换金额
    get_time: String, // 领取时间
    convert_time: String, // 兑换时间
    timeout: String, // 过期时间
}

// 用户红包表
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct UserRedBag {
    uid: u32,   // 用户id
    rid_list: &[String],        // 红包id列表
    get_rid_list: &[String],    // 领取过的红包id列表
    cid_list: &[String],        // 已兑换红包兑换码id列表
}

// 红包详情
struct RedBagData {
    rid: String,   // 红包id
    uid: u32,   // 发送人用户id
    redBag_type: u8, // 红包类型
    coin_type: u32, // 货币类型
    total_amount: u32, // 总金额
    left_amount: u32, // 剩余金额
    desc: String, // 描述
    send_time: String, // 发送时间
    update_time: String, // 最近更新时间
    timeout: String, // 过期时间
    cid_list: &[CidAmount], // 兑换码和金额列表
    left_cid_list: &[CidAmount], // 剩余兑换码和金额列表
    convert_info_list: &[RedBagConvert], // 已领取兑换码详情
}

// 兑换码详情
struct RedBagConvertData {
    cid: String, // 兑换码id
    rid: String, // 红包id
    send_uid: u32, // 发送者uid
    uid: u32, // 领取用户uid
    coin_type: u32, // 货币类型
    amount: u32, // 兑换金额
    get_time: String, // 领取时间
    convert_time: String, // 兑换时间
    timeout: String, // 过期时间
    desc: String, // 红包描述
}

// 红包信息列表
struct RedBagInfoList {
    list: &[RedBagData]
}

// 红包兑换码信息列表
struct RedBagConvertList {
    list: &[RedBagConvert]
}