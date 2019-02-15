/**
*用户表
*/
#[primary=user,db=file,dbMonitor=true,hasmgr=false]
struct UserAcc {
    user: String,
    uid: u32,
}

/**
*用户MAP表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct UserAccMap {
    uid: u32,
    openid: String,
}

/**
*用户本人的基本信息
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct UserInfo {
    uid: u32,//用户id,自增,-1代表不存在
    name: Option<String>,//用户自己设置的用户名
    avatar: Option<String>,//头像
    sex: Option<u32>,//性别
    tel: Option<String>,//电话
    note: Option<String>,//用户自己的备注信息
    loginCount: u32, //登录次数
    chatID: Option<u32>, //聊天ID
}

/**
*聊天IDMap表
*/
#[primary=chatID,db=file,dbMonitor=true,hasmgr=false]
struct ChatIDMap {
    chatID: u32,
    uid: u32
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

/**
*用户任务结构
*/
#[constructor=true]
struct Task {
    id: u32, // 任务id
    awardID: u32, // 奖励id
    awardCount: u32, // 奖励数量
    state: u8, // 任务完成状态 0:未完成, 1:已完成
    desc: String // 任务描述
}

/**
*用户任务表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct UserTaskTab {
    uid: u32,
    taskList: &[Task]
}