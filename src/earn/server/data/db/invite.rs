#[enum=Item]
#[path=./]
use item.s::{Award};

/**
*兑换奖励KEY
*/
struct InviteKey {
    uid: u32,
    invite_type: String,
}


/**
*兑换记录
*/
#[primary=invite,db=file,dbMonitor=true,hasmgr=false]
struct InviteInfo {
    invite: InviteKey, //组合key
    items: &[Award], //奖励数组
}

/**
*用户邀请记录表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct UserInviteTab {
    uid: u32,       // 用户id
    code: String,   // 邀请码
    inviter: u32,   // 邀请人id
    invited_time: String, // 被邀请时间
    invite_list: &[u32], // 已邀请的用户id列表
}

/**
*邀请码表
*/
#[primary=code,db=file,dbMonitor=true,hasmgr=false]
struct InviteCodeTab {
    code: String,  // 邀请码
    uid: u32,      // 用户id
}