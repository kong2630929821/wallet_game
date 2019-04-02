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
