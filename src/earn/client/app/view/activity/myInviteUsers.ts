/**
 * 活动-邀请好友
 * 该页面首次加载时walletStore已被赋值，监听无效
 */
import { getStoreData } from '../../../../../app/middleLayer/wrap';
import { registerStoreData } from '../../../../../app/viewLogic/common';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getContinuousInvitation } from '../../utils/util';

export const forelet = new Forelet();

// tslint:disable-next-line:completed-docs
export class MyInviteUsers extends Widget {
    public ok : () => void;
    public create() {
        super.create();
        STATE.invites = [];
        STATE.num = 0;
        this.state = STATE;
        Promise.all([getStoreData('inviteUsers/invite_success',[]),getStoreData('flags')]).then(([invites,flags]) => {
            STATE.invites = invites;
            STATE.num = flags.invite_realUser || 0;
            this.state = STATE;
            this.paint();
        });
    }

    // 返回上一页
    public backPrePage() {
        this.ok && this.ok();
    }
    public tap() {
        console.log(1);
        const r = 10;
        const arr = getContinuousInvitation(r);
        arr.forEach(element => {
            if (element.id <= r) {
                element.success = true;
            } else {
                element.success = false;
            }
        });
        console.log(arr);
    }
    
}

// ==========================================================本地
const STATE = {
    num:0,
    invites:[],
    successList:[
        { id:1,prop:2001,success:false },
        { id:2,prop:2001,success:false },
        { id:3,prop:2002,success:false },
        { id:4,prop:2001,success:false },
        { id:5,prop:2001,success:false },
        { id:6,prop:2003,success:false },
        { id:7,prop:2001,success:false }
    ]
};
// 邀请好友成功
registerStoreData('inviteUsers/invite_success',(r) => {
    STATE.invites = r;
    forelet.paint(STATE);
});
// 邀请好友成为真实用户的个数
registerStoreData('flags/invite_realUser',(r) => {
    STATE.num = r;
    const arr = getContinuousInvitation(r);
    arr.forEach(element => {
        if (element.id <= r) {
            element.success = true;
        } else {
            element.success = false;
        }
    });
    STATE.successList = arr;
    forelet.paint(STATE);
});