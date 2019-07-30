/**
 * 邀请好友组件
 */
import { getStoreData, setStoreData } from '../../../../../app/middleLayer/wrap';
import { uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
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
            getStoreData('inviteUsers').then(inviteUsers => {
                // 我邀请的好友
                const invite = inviteUsers.invite_success;
                const index = invite.findIndex(item => item === this.props.accId);
                invite.splice(index,1);
                setStoreData('inviteUsers/invite_success',invite);

                // 邀请我的好友
                const convert = inviteUsers.convert_invite;
                const index1 = convert.findIndex(item => item === this.props.accId);
                convert.splice(index1,1);
                setStoreData('inviteUsers/convert_invite',convert);
            });
            
        });
        this.paint();
    }
}
