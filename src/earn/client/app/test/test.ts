/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { Invite } from '../../../server/data/db/invite.s';
import { AwardList, AwardQuery, AwardResponse, Hoe, Item, Items, Mine, MineTop, MiningResponse, TodayMineNum } from '../../../server/data/db/item.s';
import { UserInfo } from '../../../server/data/db/user.s';
import { cdkey } from '../../../server/rpc/invite.p';
import { MiningResult, Seed } from '../../../server/rpc/itemQuery.s';
import { get_miningTop, mining, mining_result } from '../../../server/rpc/mining.p';
import { award as awardR, db_test, hit_test, item_add, item_addticket } from '../../../server/rpc/test.p';
import { Hits, IsOk, Test as Test2 } from '../../../server/rpc/test.s';
import { ticket_compose, ticket_convert, ticket_rotary, ticket_treasurebox } from '../../../server/rpc/ticket.p';
import { login as loginUser } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { add_mine, award_query, get_item, item_query } from '../../../server/rpc/user_item.p';
import { add_convert } from '../../../server/util/item_util.p';
import { clientRpcFunc } from '../net/init';

export const login = () => {
    // 钱包登录
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = 'test2';
    walletLoginReq.sign = '';
    userType.value = walletLoginReq;

    clientRpcFunc(loginUser, userType, (r: UserInfo) => {
        console.log(r);
    });
};

export const invite = () => {
    const code = 'QOTJZB';
    clientRpcFunc(cdkey, code, (r: Invite) => {
        console.log(r);
    });
};

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
    const itemType = 2001;
    clientRpcFunc(mining, itemType, (r: Seed) => {
        console.log(r);
    });
};

// 挖矿测试
export const mining_test = () => {
    const miningResult = new MiningResult();
    miningResult.hit = 30;
    miningResult.itemType = 1001;
    miningResult.mineNum = 0;
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
    const src = 'mine';
    clientRpcFunc(award_query, src, (r:AwardList) => {
        console.log(r);
    });
};

// 添加奖券
export const add_ticket = () => {
    const count = 60;
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

// 挖矿排行
export const mine_top_test = () => {
    const top = 10;
    clientRpcFunc(get_miningTop, top, (r: MineTop) => {
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

const props = {
    bts: [
        {
            name: '登录',
            func: () => { login(); }
        },
        {
            name: '兑换奖励',
            func: () => { invite(); }
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
