/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { getRealNode } from '../../../../pi/widget/painter';
import { Widget } from '../../../../pi/widget/widget';
import * as store from '../../data/store';
import { UserType, UserType_Enum, WalletLoginReq } from '../../../../server/tmp/rpc/user.s';
import { clientRpcFunc } from '../../net/init';
import { login as loginUser } from '../../../../server/tmp/rpc/user.p';
import { award as awardR } from '../../../../server/tmp/rpc/test.p';
import { Test as Test2 } from '../../../../server/tmp/rpc/test.s';
import { UserInfo } from '../../../../server/tmp/db/user.s';


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

export const award = () => {
    clientRpcFunc(awardR, 200101, (r: Test2) => {
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
