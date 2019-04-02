/**
 * 活动-邀请好友
 */
import * as walletStore from '../../../../../app/store/memstore';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../store/memstore';

export const forelet = new Forelet();

export class MyInviteUsers extends Widget {
    public ok : () => void;
    public language:any;
    public props:any = {
        num: getStore('invited').invitedNumberOfPerson // 成功邀请的人数

    };

    // 返回上一页
    public backPrePage() {
        this.ok && this.ok();
    }
    
}

// ==========================================================本地
// 邀请好友成功
walletStore.register('flags/invite_success',(r) => {
    forelet.paint(r);
});
