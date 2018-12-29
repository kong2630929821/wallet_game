#[path=../data/db/]
use user.s::{UserInfo};

struct WalletLoginReq {
    openid: String,
    sign: String
}

struct LoginReply {
    status: u8
}

struct LoginReq {
    uid: u32,
}

enum UserType {
    DEF(LoginReq),
    WALLET(WalletLoginReq),
}

/**
*指定用户消息推送
*/
struct SendMessage {
    uid: u32,
    msg: Option<String>
}