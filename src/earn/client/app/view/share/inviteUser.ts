/**
 * 邀请好友组件
 */
import { uploadFileUrlPrefix } from '../../../../../app/public/config';
import { getStore, setStore } from '../../../../../app/store/memstore';
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
            if (r.arr[0].avatar && r.arr[0].avatar.indexOf('data:image') < 0) {
                this.props.avatar = `${uploadFileUrlPrefix}${r.arr[0].avatar}`;
            } else {
                this.props.avatar = 'app/res/image/default_avater_big.png';
            }
            this.paint();
        });
    }

    // 加好友
    public agreenBtn(e:any) {
        this.props.isagree = true;
        applyUserFriend(this.props.accId).then(() => {
            const inviteUsers = getStore('inviteUsers');
                // 我邀请的好友
                 // 我邀请的好友

            const invite = inviteUsers.invite_success;
            let index = null;
            invite.forEach((v,i) => {
                if (v[0] === this.props.accId) {
                    index = i;
                }
            });
            invite.splice(index,1);
            setStore('inviteUsers/invite_success',invite);
 
                 // 邀请我的好友
            setStore('inviteUsers/convert_invite',[]);
            
        });
        this.paint();
    }
}
