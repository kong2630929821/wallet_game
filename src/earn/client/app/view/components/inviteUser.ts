/**
 * 邀请好友组件
 */
import * as walletStore from '../../../../../app/store/memstore';
import { applyUserFriend, getUsersBasicInfo } from '../../../../../chat/client/app/net/rpc';
import { UserArray } from '../../../../../chat/server/data/rpc/basic.s';
import { Widget } from '../../../../../pi/widget/widget';

export class InviteUser extends Widget {
    public ok : () => void;
    public props:any = {
        accId:'',
        name:'',
        avatar:''
    };

    public setProps(props:any) {
        super.setProps(props);
        getUsersBasicInfo([],[this.props.accId]).then((r:UserArray) => {
            this.props.name = r.arr[0].name;
            this.props.avatar = r.arr[0].avatar;
            this.paint();
        });
    }

    // 加好友
    public agreenBtn(e:any) {
        this.props.isagree = true;
        applyUserFriend(this.props.accId).then((r) => {
            // 我邀请的好友
            const invite = walletStore.getStore('flags').invite_success;
            const index = invite.findIndex(item => item === this.props.accId);
            invite.splice(index,1);
            walletStore.setStore('flags/invite_success',invite);

            // 邀请我的好友
            const convert = walletStore.getStore('flags').convert_invite;
            const index1 = convert.findIndex(item => item === this.props.accId);
            convert.splice(index1,1);
            walletStore.setStore('flags/convert_invite',convert);
        });
        this.paint();
    }
}
