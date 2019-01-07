/**
 * 登录
 */

// ================================================ 导入
import { BigNumber } from '../../../../pi/bigint/biginteger';
import { Widget } from '../../../../pi/widget/widget';
import { Invite } from '../../../server/data/db/invite.s';
import { AwardList, AwardQuery, AwardResponse, Hoe, InviteAwardRes, Item, Items, Mine, MineTop, MiningResponse, TodayMineNum } from '../../../server/data/db/item.s';
import { Achievements, Medals, ShowMedalRes } from '../../../server/data/db/medal.s';
import { InviteNumTab, UserInfo } from '../../../server/data/db/user.s';
import { get_invite_awards, get_inviteNum } from '../../../server/rpc/invite.p';
import { CoinQueryRes, ConvertAwardList, MiningResult, SeedResponse, SeriesDaysRes } from '../../../server/rpc/itemQuery.s';
import { get_miningKTTop, get_miningTop, mining, mining_result } from '../../../server/rpc/mining.p';
import { SendMsg } from '../../../server/rpc/send_message.s';
import { get_convert_list, get_STNum, st_convert, st_rotary, st_treasurebox } from '../../../server/rpc/stParties.p';
import { award as awardR, bigint_test, db_test, hit_test, item_add, item_addticket } from '../../../server/rpc/test.p';
import { Hits, IsOk, Test as Test2 } from '../../../server/rpc/test.s';
import { get_loginDays, login as loginUser } from '../../../server/rpc/user.p';
import { SendMessage, UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { add_mine, award_query, get_achievements, get_item, get_medals, get_showMedal, item_query, show_medal } from '../../../server/rpc/user_item.p';
import { add_convert } from '../../../server/util/item_util.p';
import { clientRpcFunc, subscribe } from '../net/init';

export const login = () => {
    // 钱包登录
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = '2002';
    walletLoginReq.sign = '';
    userType.value = walletLoginReq;
    clientRpcFunc(loginUser, userType, (r: UserInfo) => {
        initReceive(r.uid);
        console.log(r);
    });
};

// export const invite = () => {
//     const code = 'QOTJZB';
//     clientRpcFunc(cdkey, code, (r: Invite) => {
//         console.log(r);
//     });
// };

export const get_items = () => {
    clientRpcFunc(item_query, null, (r: Items) => {
        console.log(r);
    });
};

export const award = () => {
    clientRpcFunc(awardR, 200101, (r: Test2) => {
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
    miningResult.hit = 60;
    miningResult.itemType = 1001;
    miningResult.mineNum = 1;
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
    const hoeType = 2002;
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

// 添加奖券
export const add_ticket = () => {
    const count = 7001;
    clientRpcFunc(item_addticket, count, (r: Item) => {
        console.log(r);
    });
};

// 转盘
export const rotary_test = () => {
    const itemType = 100801;
    clientRpcFunc(st_rotary, itemType, (r: AwardResponse) => {
        console.log(r);
    });
};

// 宝箱
export const box_test = () => {
    const itemType = 101101;
    clientRpcFunc(st_treasurebox, itemType, (r: AwardResponse) => {
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

// 大整数测试
export const bigInt_test = () => {
    clientRpcFunc(bigint_test, null, (r: Test) => {
        console.log(r);
    });
};

// 连续登陆天数
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
    const medal = 8001;
    clientRpcFunc(show_medal, medal, (r: ShowMedalRes) => {
        console.log(r);
    });
};

// 查看挂出的奖章
export const get_medal_test = () => {
    const medal = 1;
    clientRpcFunc(get_showMedal, medal, (r: ShowMedalRes) => {
        console.log(r);
    });
};

export const initReceive = (uid: number) => {
    subscribe(`send/${uid}`, SendMsg, (r: any) => {
        console.log('勋章弹窗！！！！！！！',r);
    });
};
const props = {
    bts: [
        {
            name: '登录',
            func: () => { login(); }
        },
        {
            name: '奖励方法',
            func: () => { award(); }
        },
        {
            name: '所有物品',
            func: () => { get_items(); }
        },
        {
            name: '指定物品',
            func: () => { item_test1(); }
        },
        {
            name: '添加锄头',
            func: () => { item_test2(); }
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
            name: '添加矿山',
            func: () => { test_add_mine(); }
        },
        {
            name: '锄头模拟',
            func: () => { test_hits(); }
        },
        {
            name: '奖励查询',
            func: () => { award_query_test(); }
        },
        {
            name: '添加奖券',
            func: () => { add_ticket(); }
        },
        {
            name: '转盘',
            func: () => { rotary_test(); }
        },
        {
            name: '宝箱',
            func: () => { box_test(); }
        },
        {
            name: '挖矿排行',
            func: () => { mine_top_test(); }
        },
        {
            name: '添加兑换码',
            func: () => { add_convert_test(); }
        },
        {
            name: '兑换物品',
            func: () => { convert_test(); }
        },
        {
            name: '获取邀请人数',
            func: () => { get_inviteNum_test(); }
        },
        {
            name: '获取邀请奖励',
            func: () => { get_inviteAward_test(); }
        },
        {
            name: '获取奖章',
            func: () => { get_medals_test(); }
        },
        {
            name: '获取成就',
            func: () => { get_achievements_test(); }
        },
        {
            name: '查询ST',
            func: () => { get_stNum_test(); }
        },
        {
            name: '添加ST',
            func: () => { bigInt_test(); }
        },
        {
            name: '兑奖列表',
            func: () => { get_convert_list_test(); }
        },
        {
            name: '挂奖章',
            func: () => { show_medal_test(); }
        },
        {
            name: '查奖章',
            func: () => { get_medal_test(); }
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
