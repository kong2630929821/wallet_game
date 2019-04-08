/**
 * 活动-邀请好友
 * 该页面首次加载时walletStore已被赋值，监听无效
 */
import * as walletStore from '../../../../../app/store/memstore';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';

export const forelet = new Forelet();

// tslint:disable-next-line:completed-docs
export class MyInviteUsers extends Widget {
    public ok : () => void;
    public create() {
        super.create();
        STATE.invites = walletStore.getStore('inviteUsers/invite_success',[]);
        STATE.num = walletStore.getStore('flags').invite_realUser || 0;
        this.state = STATE;
    }

    // 返回上一页
    public backPrePage() {
        this.ok && this.ok();
    }
    
}

// ==========================================================本地
const STATE = {
    num:0,
    invites:[],
    successList:[
        { index:1,src:'../../res/image/virtualGoods/2001.png' },
        { index:2,src:'../../res/image/virtualGoods/2001.png' },
        { index:3,src:'../../res/image/virtualGoods/2002.png' },
        { index:4,src:'../../res/image/virtualGoods/2001.png' },
        { index:5,src:'../../res/image/virtualGoods/2001.png' },
        { index:6,src:'../../res/image/virtualGoods/2003.png' },
        { index:7,src:'../../res/image/virtualGoods/2001.png' }
    ]
};
// 邀请好友成功
walletStore.register('inviteUsers/invite_success',(r) => {
    STATE.invites = r;
    forelet.paint(STATE);
});
// 邀请好友成为真实用户的个数
walletStore.register('flags/invite_realUser',(r) => {
    STATE.num = r;
    forelet.paint(STATE);
});