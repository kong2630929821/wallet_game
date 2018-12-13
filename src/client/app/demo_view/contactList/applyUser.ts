/**
 * applyUser 组件相关处理
 *
 */ 
// ===========================导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { GroupInfo } from '../../../../server/data/db/group.s';

interface Props {
    uid?:number;// id
    gid?:number;
    info?:Json;
    ginfo?:Json;
    applyInfo? : string; // 其他
    isagree:boolean;
}

// ===========================导出
export class ApplyUser extends Widget {
    public props:Props;

    public setProps(props:any) {
        super.setProps(props);
        console.log(props);
        this.props.applyInfo = '填写验证信息';
        this.props.info = store.getStore(`userInfoMap/${this.props.uid}`,new UserInfo());
        this.props.ginfo = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo());
        this.props.isagree = false;
    }
        // 查看申请详细信息 
    public viewApplyDetail() {
        popNew('client-app-demo_view-contactList-newFriendApply',this.props);
    }

    public agreenBtn(e:any) {
        notify(e.node,'ev-agree-friend',{ value:this.props.uid });
        notify(e.node,'ev-agree-group',{ value:this.props.gid });
        notify(e.node,'ev-agree-joinGroup',{ value:this.props.uid });
        this.props.isagree = true;
        this.paint();
    }
}
