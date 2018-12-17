/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../../server/rpc/user.s';
import { clientRpcFunc } from '../../net/init';
import { login as loginUser } from '../../../../server/rpc/user.p';
import { award as awardR, db_test, item_add } from '../../../../server/rpc/test.p';
import { Test as Test2 } from '../../../../server/rpc/test.s';
import { UserInfo } from '../../../../server/data/db/user.s';
import { Items, Mine, Item, Hoe } from '../../../../server/data/db/item.s';
import { ItemQuery } from '../../../../server/rpc/itemQuery.s';
import { get_item } from '../../../../server/rpc/user_item.p';

export const login = () => {
    //钱包登录
    let userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    let walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = "test";
    walletLoginReq.sign = "";
    userType.value = walletLoginReq;

    clientRpcFunc(loginUser, userType, (r: UserInfo) => {
        console.log(r);
    });
};

export const get_items = () => {
    let uid = 7;
    clientRpcFunc(db_test, uid, (r: Items) => {
        console.log(r);
    });
};

export const award = () => {
    clientRpcFunc(awardR, 200101, (r: Test2) => {
        console.log(r);
    });
};

//获取指定用户指定类型物品
export const item_test1 = () => {
    let itemQuery = new ItemQuery();
    itemQuery.uid = 7;
    itemQuery.enumType = 1;
    itemQuery.itemType = 1001;
    clientRpcFunc(get_item, itemQuery, (r: Item) => {
        console.log(r);
    });
};

//给指定用户添加指定类型物品
export const item_test2 = () => {
    let count = 1;
    clientRpcFunc(item_add, count, (r: Item) => {
        console.log(r);
    });
};



let props = {
    bts: [
        {
            "name": "登录",
            "func": () => { login() },
        },
        {
            "name": "奖励方法",
            "func": () => { award() },
        },
        {
            "name": "所有物品",
            "func": () => { get_items() },
        },
        {
            "name": "指定物品",
            "func": () => { item_test1() },
        },
        {
            "name": "添加物品",
            "func": () => { item_test2() },
        }
    ], //按钮数组
};

// ================================================ 导出
export class Test extends Widget {
    constructor() {
        super();
        this.props = props;
    }

    public onTap(a: any) {
        props.bts[a].func()
    }
}

// ================================================ 本地
