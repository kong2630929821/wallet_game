/**
* 勋章
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct Medals {
    uid: u32,
    medals: &[u32]
}

/**
* 偶然成就
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct Achievements {
    uid: u32,
    achievements: &[u32]
}

/**
* 添加勋章
*/
#[constructor=true]
struct AddMedal {
    uid: u32,
    medalType:u32
}

/**
* 展示勋章表
*/
#[primary=uid,db=file,dbMonitor=true,hasmgr=false,constructor=true]
struct ShowMedal {
    uid: u32,
    medal: Option<u32>
}

/**
* 展示勋章返回
*/
#[constructor=true]
struct ShowMedalRes {
    resultNum: u32,
    medalType: Option<u32>
}

/**
* 展示勋章返回
*/
struct ShowMedalResArr {
    resultNum: u32,
    arr: &[ShowMedalRes]
}

/**
* 批量获取展示勋章
*/
struct getShowMedals {
    arr: &[String]
}
