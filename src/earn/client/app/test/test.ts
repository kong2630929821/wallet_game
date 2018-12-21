/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
<<<<<<< HEAD
import { AwardList, Hoe, Item, Items, Mine, MiningResponse, Prizes, TodayMineNum } from '../../../server/data/db/item.s';
=======
import { Invite } from '../../../server/data/db/invite.s';
import { Hoe, Item, Items, Mine, MiningResponse } from '../../../server/data/db/item.s';
>>>>>>> 648b7222e1dad03d8009fd628bd35d5874d4b823
import { UserInfo } from '../../../server/data/db/user.s';
import { cdkey } from '../../../server/rpc/invite.p';
import { ItemQuery, MiningResult, Seed } from '../../../server/rpc/itemQuery.s';
import { mining, mining_result } from '../../../server/rpc/mining.p';
<<<<<<< HEAD
import { award as awardR, db_test, hit_test, item_add } from '../../../server/rpc/test.p';
import { Hits, Test as Test2 } from '../../../server/rpc/test.s';
import { login as loginUser } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { add_mine, award_query, get_item, get_todayMineNum, item_query } from '../../../server/rpc/user_item.p';
import { RandomSeedMgr } from '../../../server/util/randomSeedMgr';
=======
import { award as awardR, db_test, item_add } from '../../../server/rpc/test.p';
import { Test as Test2 } from '../../../server/rpc/test.s';
import { login as loginUser } from '../../../server/rpc/user.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../server/rpc/user.s';
import { get_item, item_query } from '../../../server/rpc/user_item.p';
>>>>>>> 648b7222e1dad03d8009fd628bd35d5874d4b823
import { clientRpcFunc } from '../net/init';

export const login = () => {
    // 钱包登录
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = '2';
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
    const count = 1;
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

// 奖励查询
export const today_test = () => {
    const uid = 9;
    clientRpcFunc(get_todayMineNum, uid, (r:TodayMineNum) => {
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
            name: '添加物品',
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
            name: '奖励查询1',
            func: () => { today_test(); }
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
