#[enum=Item]
#[path=./]
use item.s::{Award};

/**
*兑换物品
*/
#[primary=code,db=file,dbMonitor=true,hasmgr=false]
struct Invite {
    code: String, //uid:code组成的兑换码
    items: &[Award],
}
