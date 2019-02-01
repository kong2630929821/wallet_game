
/**
*转盘订单表
*/
#[primary=oid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct RotaryOrder {
    oid: String,
    uid: u32,
    rotatyType: u32,
    awardType: u32,
    awardCount: u32,
    stNum: u32,
    time: String,
    state: u8
}

/**
*宝箱订单表
*/
#[primary=oid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct BoxOrder {
    oid: String,
    uid: u32,
    boxType: u32,
    awardType: u32,
    awardCount: u32,
    stNum: u32,
    time: String,
    state: u8
}

/**
*兑换商城订单表
*/
#[primary=oid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct ConvertOrder {
    oid: String,
    uid: u32,
    awardType: u32,
    stNum: u32,
    time: String,
    state: u8
}

/**
*用户转盘下单记录表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct UserRotaryOrderTab {
    uid: u32,
    oidList: Option<&[String]>
}

/**
*用户宝箱下单记录表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct UserBoxOrderTab {
    uid: u32,
    oidList: Option<&[String]>
}

/**
*用户兑换商城下单记录表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct UserConvertOrderTab {
    uid: u32,
    oidList: Option<&[String]>
}