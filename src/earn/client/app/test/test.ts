/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { Invite } from '../../../server/data/db/invite.s';
import { AwardList, Hoe, Item, Items, Mine, MiningResponse, TodayMineNum } from '../../../server/data/db/item.s';
import { UserInfo } from '../../../server/data/db/user.s';
import { cdkey } from '../../../server/rpc/invite.p';
import { ItemQuery, MiningResult, Seed } from '../../../server/rpc/itemQuery.s';
import { mining, mining_result } from '../../../server/rpc/mining.p';
import { award as awardR, db_test, hit_test, item_add, item_addticket } from '../../../server/rpc/test.p';
import { Hits, Test as Test2 } from '../../../server/rpc/test.s';
import { ticket_compose } from '../../../server/rpc/ticket.p';
import { login as loginUser } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { add_mine, award_query, get_item, get_todayMineNum, item_query } from '../../../server/rpc/user_item.p';
import { clientRpcFunc } from '../net/init';

export const login = () => {
    // 钱包登录
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = 'test';
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
    const uid = 9;
    clientRpcFunc(item_query, uid, (r: Items) => {
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
    const itemQuery = new ItemQuery();
    itemQuery.uid = 9;
    itemQuery.enumType = 1;
    itemQuery.itemType = 1001;
    clientRpcFunc(get_item, itemQuery, (r: Item) => {
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
    const itemQuery = new ItemQuery();
    itemQuery.uid = 9;
    itemQuery.enumType = 2;
    itemQuery.itemType = 2001;
    clientRpcFunc(mining, itemQuery, (r: Seed) => {
        console.log(r);
    });
};

// 挖矿测试
export const mining_test = () => {
    const miningResult = new MiningResult();
    miningResult.hit = 30;
    const itemQuery = new ItemQuery();
    itemQuery.uid = 9;
    itemQuery.enumType = 1;
    itemQuery.itemType = 1001;
    miningResult.itemQuery = itemQuery;
    miningResult.mineNum = 0;
    clientRpcFunc(mining_result, miningResult, (r: MiningResponse) => {
        console.log(r);
    });
};

// 添加矿山
export const test_add_mine = () => {
    const uid = 9;
    clientRpcFunc(add_mine, uid, (r: Mine) => {
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
    const uid = 9;
    clientRpcFunc(award_query, uid, (r:AwardList) => {
        console.log(r);
    });
};

// 添加奖券
export const add_ticket = () => {
    const count = 6;
    clientRpcFunc(item_addticket, count, (r: Item) => {
        console.log(r);
    });
};

// 合成奖券
export const compose_ticket = () => {
    const itemQuery = new ItemQuery();
    itemQuery.uid = 9;
    itemQuery.enumType = 7;
    itemQuery.itemType = 7001;
    clientRpcFunc(ticket_compose, itemQuery, (r: Item) => {
        console.log(r);
    });
};

// 转盘
export const ticket_rotary_test = () => {
    const itemQuery = new ItemQuery();
    itemQuery.uid = 9;
    itemQuery.enumType = 7;
    itemQuery.itemType = 7001;
    clientRpcFunc(ticket_compose, itemQuery, (r: Item) => {
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
