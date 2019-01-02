/**
 * 登录
 */

// ================================================ 导入
import { BigNumber } from '../../../../pi/bigint/biginteger';
import { Widget } from '../../../../pi/widget/widget';
import { Invite } from '../../../server/data/db/invite.s';
import { AwardList, AwardQuery, AwardResponse, Hoe, InviteAwardRes, Item, Items, Mine, MineTop, MiningResponse, TodayMineNum } from '../../../server/data/db/item.s';
import { Achievements, Medals } from '../../../server/data/db/medal.s';
import { InviteNumTab, UserInfo } from '../../../server/data/db/user.s';
import { get_invite_awards, get_inviteNum } from '../../../server/rpc/invite.p';
import { KTQueryRes, MiningResult, SeedResponse, SeriesDaysRes } from '../../../server/rpc/itemQuery.s';
import { get_miningKTTop, get_miningTop, mining, mining_result } from '../../../server/rpc/mining.p';
import { award as awardR, bigint_test, db_test, hit_test, item_add, item_addticket } from '../../../server/rpc/test.p';
import { Hits, IsOk, Test as Test2 } from '../../../server/rpc/test.s';
import { get_ticket_KTNum, ticket_compose, ticket_convert, ticket_rotary, ticket_treasurebox } from '../../../server/rpc/ticket.p';
import { get_loginDays, login as loginUser } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { add_mine, award_query, get_achievements, get_item, get_medals, item_query } from '../../../server/rpc/user_item.p';
import { add_convert } from '../../../server/util/item_util.p';
import { clientRpcFunc, subscribe } from '../net/init';

export const login = () => {
    // 钱包登录
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = '2001';
    walletLoginReq.sign = '';
    userType.value = walletLoginReq;
    clientRpcFunc(loginUser, userType, (r: UserInfo) => {
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
    miningResult.mineNum = 8;
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

// 合成奖券
export const compose_ticket = () => {
    const itemType = 7001;
    clientRpcFunc(ticket_compose, itemType, (r: Item) => {
        console.log(r);
    });
};

// 转盘
export const ticket_rotary_test = () => {
    const itemType = 7001;
    clientRpcFunc(ticket_rotary, itemType, (r: Item) => {
        console.log(r);
    });
};

// 宝箱
export const ticket_treasurebox_test = () => {
    const  itemType = 7001;
    clientRpcFunc(ticket_treasurebox, itemType, (r: Item) => {
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
    const awardType = 500001;
    clientRpcFunc(ticket_convert, awardType, (r: AwardResponse) => {
        console.log(r);
    });
};

// 大整数测试
export const bigInt_test = () => {
    clientRpcFunc(bigint_test, null, (r: Test) => {
        console.log(r);
    });
};

// 获取钱包KT
export const get_walletkt_test = () => {
    clientRpcFunc(get_ticket_KTNum, null, (r: KTQueryRes) => {
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
            name: '合成奖券',
            func: () => { compose_ticket(); }
        },
        {
            name: '转盘',
            func: () => { ticket_rotary_test(); }
        },
        {
            name: '宝箱',
            func: () => { ticket_treasurebox_test(); }
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
            name: '获取KT',
            func: () => { get_walletkt_test(); }
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
