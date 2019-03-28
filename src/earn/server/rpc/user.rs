
struct WalletLoginReq {
    openid: String,
    sign: String,
    nonce_str: String,
    timestamp: u32
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
    msgType: u32,
    msg: Option<u32>
}

//自动登录
struct AutoLogin {
    uid: String,
    token: String,
}

//自动登录返回
struct AutoLoginResult {
    code: i32,
}

//获取TOKEN
struct GetToken {
    uid: String,
}

//获取TOKEN
struct Token {
    code: i32,
    token: String,
}