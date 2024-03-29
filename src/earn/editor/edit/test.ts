import * as net_init from '../../../chat/client/app/net/init';
import { GroupInfo } from '../../../chat/server/data/db/group.s';
import  * as chatLogins  from '../../../chat/server/data/rpc/basic.p';
import * as chatBasic from '../../../chat/server/data/rpc/basic.s';
import { createGroup } from '../../../chat/server/data/rpc/group.p';
import { GroupCreate } from '../../../chat/server/data/rpc/group.s';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { clientRpcFunc, initClient, subscribe } from '../../client/app/net/init';
import { earnLogin } from '../../client/app/net/login';
import { GuessingReq, Result } from '../../server/data/db/guessing.s';
import { AwardList, AwardQuery, AwardResponse, ConvertAwardList, FreePlay, InviteAwardRes, Item, Items, Mine, MineTop, MiningResponse } from '../../server/data/db/item.s';
import { Achievements, getShowMedals, Medals, ShowMedalRes, ShowMedalResArr } from '../../server/data/db/medal.s';
import { InviteNumTab, UserInfo } from '../../server/data/db/user.s';
import { get_compJackpots, get_user_guessingInfo, start_guessing } from '../../server/rpc/guessingCompetition.p';
import { cdkey, convertInviteCode, get_invite_awards, get_inviteNum, getInviteCode } from '../../server/rpc/invite.p';
import { ChatIDs, CoinQueryRes, MiningResult, SeedResponse, SeriesDaysRes } from '../../server/rpc/itemQuery.s';
import { get_friends_KTTop, get_miningCoinNum, get_miningKTTop, mining, mining_result } from '../../server/rpc/mining.p';
import { convertRedBag, emitRedBag, getRedBagConvert, queryConvertLog, queryEmitLog, queryRedBagDetail } from '../../server/rpc/redBag.p';
import { EmitRedBag } from '../../server/rpc/redBag.s';
import { SendMsg } from '../../server/rpc/send_message.s';
import { add_convert, box_pay_query, get_convert_info, get_convert_list, get_hasFree, get_KTNum, get_STNum, kt_rotary, kt_treasurebox, st_convert, st_rotary, st_treasurebox } from '../../server/rpc/stParties.p';
import { bigint_test, get_objStr, hit_test, item_add, item_addticket, reset_dayliTask_test } from '../../server/rpc/test.p';
import { Hits, IsOk } from '../../server/rpc/test.s';
import { bind_accID, close_connect, get_loginDays, login } from '../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../server/rpc/user.s';
import { add_mine, award_query, get_achievements, get_ad_award, get_item, get_medals, get_showMedal, get_showMedals, get_task_award, getAdCount, item_query, show_medal, task_query } from '../../server/rpc/user_item.p';

/**
 * 登录
 */

// ================================================ 导入

// 编辑比赛
export const competitionEditor = () => {
    popNew('earn-editor-edit-compEditor');
};

// 编辑商品
export const pruductEditor = () => {
    popNew('earn-editor-edit-convertEditor');
};

// 创建群组
export const groupEditor = () => {
    popNew('earn-editor-edit-chatGroupEditor');
};

export const creat = () => {
    // 钱包登录
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = '2007';
    walletLoginReq.sign = '';
    userType.value = walletLoginReq;
    console.log('11111111111111111111');
    initClient(userType, (r) => {
        // initReceive(r.uid);
        console.log(r);
    });
};

export const loginTest = () => {
    // 钱包登录
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = '2007';
    walletLoginReq.sign = '';
    userType.value = walletLoginReq;
    console.log('11111111111111111111');
    clientRpcFunc(login, userType, (r: UserInfo) => {
        initReceive(r.uid);
        console.log(r);
    });
};

// 聊天注册
export const chatRegister = () => {
    const register = new chatBasic.UserRegister();
    register.name = 'GM1';
    register.passwdHash = '12345678';
    clientRpcFunc(chatLogins.registerUser, register, (r: UserInfo) => {
        console.log(r);
    });
};

// 聊天登录
export const chatLogin = () => {
    const userType = new chatBasic.UserType();
    userType.enum_type = chatBasic.UserType_Enum.DEF;
    const loginReq = new chatBasic.LoginReq();
    loginReq.uid = 0;
    loginReq.passwdHash = '12345678';
    userType.value = loginReq;
    clientRpcFunc(chatLogins.login, userType, (r: UserInfo) => {
        console.log(r);
    });
};

// 订单查询
export const orderQuery = () => {
    const oid = '15490044942224161101';
    clientRpcFunc(box_pay_query, oid, (r: Result) => {
        console.log(r);
    });
};

// 宝箱
export const box_test = () => {
    const itemType = 101101;
    clientRpcFunc(kt_treasurebox, itemType, (r: Result) => {
        console.log(r);
    });
};

export const get_items = () => {
    clientRpcFunc(item_query, null, (r: Items) => {
        console.log(r);
    });
};

// 获取指定用户指定类型物品
export const item_test1 = () => {
    const itemType = 1001;
    clientRpcFunc(get_item, itemType, (r: Item) => {
        console.log(r);
    });
};

// 给指定用户添加指定类型物品
export const item_test2 = () => {
    const count = 5;
    clientRpcFunc(item_add, count, (r: Item) => {
        console.log(r);
    });
};

// 获取挖矿随机种子
export const get_seed = () => {
    const itemType = 2003;
    clientRpcFunc(mining, itemType, (r: SeedResponse) => {
        console.log(r);
    });
};

// 挖矿测试
export const mining_test = () => {
    const miningResult = new MiningResult();
    miningResult.hit = 10;
    miningResult.itemType = 1001;
    miningResult.mineNum = 2;
    clientRpcFunc(mining_result, miningResult, (r: MiningResponse) => {
        console.log(r);
    });
};

// 添加矿山
export const test_add_mine = () => {
    clientRpcFunc(add_mine, null, (r: Mine) => {
        console.log(r);
    });
};

// 锄头模拟
export const test_hits = () => {
    const hoeType = 2001;
    clientRpcFunc(hit_test, hoeType, (r:Hits) => {
        console.log(r);
    });
};

// 奖励查询
export const award_query_test = () => {
    const query = new AwardQuery();
    query.src = '';
    clientRpcFunc(award_query, query, (r:AwardList) => {
        console.log(r);
    });
};

// 转盘
export const rotary_test = () => {
    const itemType = 100801;
    clientRpcFunc(kt_rotary, itemType, (r: AwardResponse) => {
        console.log(r);
    });
};

// 挖矿排行(KT)
export const mine_top_test = () => {
    const top = 10;
    clientRpcFunc(get_miningKTTop, top, (r: MineTop) => {
        console.log(r);
    });
};

// 添加兑换码
export const add_convert_test = () => {
    clientRpcFunc(add_convert, null, (r:IsOk) => {
        console.log(r);
    });
};

// 兑换物品
export const convert_test = () => {
    const awardType = 500002;
    clientRpcFunc(st_convert, awardType, (r: AwardResponse) => {
        console.log(r);
    });
};

// 添加ST
export const bigInt_test = () => {
    clientRpcFunc(bigint_test, null, (r: Test) => {
        console.log(r);
    });
};

// 连续登录天数
export const get_series_days = () => {
    clientRpcFunc(get_loginDays, null, (r: SeriesDaysRes) => {
        console.log(r);
    });
};

// 获取邀请人数
export const get_inviteNum_test = () => {
    clientRpcFunc(get_inviteNum, null, (r: InviteNumTab) => {
        console.log(r);
    });
};

// 获取邀请奖励
export const get_inviteAward_test = () => {
    const index = 5;
    clientRpcFunc(get_invite_awards, index, (r: InviteAwardRes) => {
        console.log(r);
    });
};

// 获取所有奖章
export const get_medals_test = () => {
    clientRpcFunc(get_medals, null, (r: Medals) => {
        console.log(r);
    });
};

// 获取所有成就
export const get_achievements_test = () => {
    clientRpcFunc(get_achievements, null, (r: Achievements) => {
        console.log(r);
    });
};

// 获取ST数量
export const get_stNum_test = () => {
    clientRpcFunc(get_STNum, null, (r: CoinQueryRes) => {
        console.log(r);
    });
};

// 查看兑奖列表
export const get_convert_list_test = () => {
    clientRpcFunc(get_convert_list, null, (r: ConvertAwardList) => {
        console.log(r);
    });
};

// 挂奖章
export const show_medal_test = () => {
    const medal = 8003;
    clientRpcFunc(show_medal, medal, (r: ShowMedalRes) => {
        console.log(r);
    });
};

// 查看挂出的奖章
export const get_medal_test = () => {
    const uid = 24;
    clientRpcFunc(get_showMedal, uid, (r: ShowMedalRes) => {
        console.log(r);
    });
};

// 批量查看展示的奖章
export const get_showMedals_test = () => {
    const accIds = new getShowMedals();
    accIds.arr = ['10001'];
    clientRpcFunc(get_showMedals, accIds, (r: ShowMedalResArr) => {
        console.log(r);
    });
};

// 绑定accID
export const bind_accID_test = () => {
    const accID = '10001';
    clientRpcFunc(bind_accID, accID, (r: Result) => {
        console.log(r);
    });
};

export const initReceive = (uid: number) => {
    subscribe(`send/${uid}`, SendMsg, (r: any) => {
        console.log('勋章弹窗！！！！！！！',r);
    });
};

// 免费次数查询
export const objtostr_test = () => {
    clientRpcFunc(get_hasFree, null, (r: FreePlay) => {
        console.log(r);
    });
};

// 竞猜投注
export const guessing_test = () => {
    const guessingReq = new GuessingReq();
    guessingReq.cid = 7;
    guessingReq.teamSide = 1;
    guessingReq.num = 200;
    clientRpcFunc(start_guessing, guessingReq, (r: FreePlay) => {
        console.log(r);
    });
};

// 奖池信息
export const get_jackpots_test = () => {
    const cid = 4;
    clientRpcFunc(get_compJackpots, cid, (r: FreePlay) => {
        console.log(r);
    });
};

// 查KT
export const get_KT_test = () => {
    clientRpcFunc(get_KTNum, null, (r: FreePlay) => {
        console.log(r);
    });
};

// 竞猜历史
export const get_my_guessing = () => {
    clientRpcFunc(get_user_guessingInfo, null, (r: FreePlay) => {
        console.log(r);
    });
};

// 广告奖励
export const ad_award_test = () => {
    clientRpcFunc(get_ad_award, 1, (r: FreePlay) => {
        console.log(r);
    });
};

// 创建群组
export const createGroupTest = (name:string, avatar:string, note:string, needAgree:boolean) => {
    const group = new GroupCreate();
    group.note = note;
    group.name = name;
    group.avatar = avatar; 
    group.need_agree = needAgree;
    
    clientRpcFunc(createGroup, group, (r: GroupInfo) => {
        console.log('创建群组成功', r.gid);
    });
};

// 广告奖励
export const convert_info_test = () => {
    clientRpcFunc(get_convert_info, 500001, (r: FreePlay) => {
        console.log(r);
    });
};

// 查询当天观看广告次数
export const adCount_test = () => {
    clientRpcFunc(getAdCount, 1, (r: FreePlay) => {
        console.log(r);
    });
};

// 查询免费次数
export const get_hasFree_test = ()  => {
    clientRpcFunc(get_hasFree, null, (r: FreePlay) => {
        console.log(r);
    });
};

// 查询挖矿货币奖励
export const get_miningCoin_test = ()  => {
    const typeId = null;
    clientRpcFunc(get_miningCoinNum, typeId, (r: FreePlay) => {
        console.log(r);
    });
};

// 好友挖矿排行
export const get_friendTop_test = ()  => {
    const chatIDs = new ChatIDs();
    chatIDs.chatIDs = [110, 111];
    clientRpcFunc(get_friends_KTTop, chatIDs, (r: FreePlay) => {
        console.log(r);
    });
};

// 获取任务列表
export const get_task_test = ()  => {
    clientRpcFunc(task_query, null, (r: Result) => {
        console.log(r);
    });
};

// 获取任务奖励
export const get_taskAward_test = ()  => {
    const taskID = 8;
    clientRpcFunc(get_task_award, taskID, (r: Result) => {
        console.log(r);
    });
};

// 生成邀请码
export const getInviteCodeTest = ()  => {
    const arg = null;
    clientRpcFunc(getInviteCode, arg, (r: Result) => {
        console.log(r);
    });
};

// 兑换邀请码
export const convertInviteCodeTest = ()  => {
    const arg = '39IU24';
    clientRpcFunc(convertInviteCode, arg, (r: Result) => {
        console.log(r);
    });
};

// 发红包
export const emitRedBagTest = ()  => {
    const arg = new EmitRedBag();
    arg.coin_type = 6001;
    arg.count = 10;
    arg.total_amount = 100;
    arg.redBag_type = 2;
    arg.desc = 'test';
    clientRpcFunc(emitRedBag, arg, (r: Result) => {
        console.log(r);
    });
};

// 领取红包兑换码
export const getRedBagConvertTest = ()  => {
    const arg = 'FFZPT10PVFT';
    clientRpcFunc(getRedBagConvert, arg, (r: Result) => {
        console.log(r);
    });
};

// 兑换红包
export const convertRedBagTest = ()  => {
    const arg = '7T7XWL8YG6N2F';
    clientRpcFunc(convertRedBag, arg, (r: Result) => {
        console.log(r);
    });
};

// 用户发红包记录
export const queryEmitLogTest = ()  => {
    const arg = null;
    clientRpcFunc(queryEmitLog, arg, (r: Result) => {
        console.log(r);
    });
};

// 用户兑换红包记录
export const queryConvertLogTest = ()  => {
    const arg = null;
    clientRpcFunc(queryConvertLog, arg, (r: Result) => {
        console.log(r);
    });
};

// 获取指定红包的详情
export const queryRedBagDetailTest = ()  => {
    const arg = 'L95UX874GSF';
    clientRpcFunc(queryRedBagDetail, arg, (r: Result) => {
        console.log(r);
    });
};

const props = {
    bts: [
        {
            name: '创建连接',
            func: () => { creat(); }
        },
        {
            name: '登录',
            func: () => { loginTest(); }
        },
        {
            name: '登录天数',
            func: () => { get_series_days(); }
        },
        {
            name: '发红包记录',
            func: () => { queryEmitLogTest(); }
        },
        {
            name: '兑换红包记录',
            func: () => { queryConvertLogTest(); }
        },
        {
            name: '红包详情',
            func: () => { queryRedBagDetailTest(); }
        },
        {
            name: '发红包',
            func: () => { emitRedBagTest(); }
        },
        {
            name: '领取兑换码',
            func: () => { getRedBagConvertTest(); }
        },
        {
            name: '兑换红包',
            func: () => { convertRedBagTest(); }
        },
        {
            name: '邀请人数',
            func: () => { get_inviteNum_test(); }
        },
        {
            name: '生成邀请码',
            func: () => { getInviteCodeTest(); }
        },
        {
            name: '兑换邀请码',
            func: () => { convertInviteCodeTest(); }
        },
        {
            name: '广告奖励',
            func: () => { ad_award_test(); }
        },
        {
            name: '广告次数',
            func: () => { adCount_test(); }
        },
        {
            name: '免费查询',
            func: () => { get_hasFree_test(); }
        },
        {
            name: '奖励查询',
            func: () => { award_query_test(); }
        },
        {
            name: '订单查询',
            func: () => { orderQuery(); }
        },
        {
            name: '所有物品',
            func: () => { get_items(); }
        },
        {
            name: '添加锄头',
            func: () => { item_test2(); }
        },
        {
            name: '添加矿山',
            func: () => { test_add_mine(); }
        },
        {
            name: '随机种子',
            func: () => { get_seed(); }
        },
        {
            name: '挖矿',
            func: () => { mining_test(); }
        },
        {
            name: '任务列表',
            func: () => { get_task_test(); }
        },
        {
            name: '任务奖励',
            func: () => { get_taskAward_test(); }
        },
        {
            name: '所有奖章',
            func: () => { get_medals_test(); }
        },
        {
            name: '查看奖章',
            func: () => { get_medal_test(); }
        },
        {
            name: '好友排行',
            func: () => { get_friendTop_test(); }
        },
        {
            name: '查KT',
            func: () => { get_KT_test(); }
        },
        {
            name: '批量查看奖章',
            func: () => { get_showMedals_test(); }
        },
        {
            name: '绑定AccID',
            func: () => { bind_accID_test(); }
        }
    ] // 按钮数组
};

// ================================================ 导出
export class Test extends Widget {
    constructor() {
        super();
        this.props = props;
    }

    public onTap(a: any) {
        props.bts[a].func();
        // console.log('click ',props.bts[a].name);
    }
}

// ================================================ 本地
