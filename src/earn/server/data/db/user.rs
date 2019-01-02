/**
*用户表
*/
#[primary=user,db=file,dbMonitor=true,hasmgr=false]
struct UserAcc {
    user: String,
    uid: u32,
}


/**
*用户本人的基本信息
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct UserInfo {
    uid: u32,//用户id,自增,-1代表不存在
    name: String,//用户自己设置的用户名
    avator: String,//头像
    sex: u32,//性别
    tel: String,//电话
    note: String,//用户自己的备注信息
    loginCount: u32 //登录次数
}

/**
*生成唯一ID表
*/
#[primary=index,db=file,dbMonitor=true,hasmgr=false]
struct IDIndex {
    index: String,
    id: u32,
}

/**
*在线表
*/
#[primary=uid,db=memory]
struct Online {
    uid: u32,
    session_id: u32,
}

/**
*在线表MAP
*/
#[primary=session_id,db=memory]
struct OnlineMap {
    session_id: u32,
    uid: u32,
}

/**
*用户每日登陆表主键结构
*/
struct DayliLoginKey {
    date: u32,
    uid: u32,
}

/**
*用户每日登陆表
*/
#[primary=index,db=file,dbMonitor=true,hasmgr=false]
struct DayliLogin {
    index: DayliLoginKey,
    state: bool,
}

/**
*用户连续登陆天数表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct SeriesLogin {
    uid: u32,
    days: u32,
}

/**
*用户总登陆天数表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct TotalLogin {
    uid: u32,
    days: u32,
}

/**
*用户邀请人数表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct InviteNumTab {
    uid: u32,
    inviteNum: u32,
    usedNum: Option<&[u32]>
}

/**
*用户邀请表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct InviteTab {
    uid: u32,
    fuid: Option<&[u32]>,
}