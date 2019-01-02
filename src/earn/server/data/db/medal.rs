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