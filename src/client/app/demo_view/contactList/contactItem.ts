/**
 * contactItem 组件相关处理
 */
// ===========================导入
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import * as store from '../../data/store';
import { getFriendAlias } from '../../logic/logic';

interface Props {
    uid?:number;
    gid?:number;
    ginfo?:Json;
    info?:Json; // 用户信息
    text?:string; // 显示文本
    totalNew?: number;// 多少条消息
}

// ===========================导出
export class ContactItem extends Widget {
    public props : Props = {
        uid:null,
        gid:null,
        info:null,
        ginfo:null,  
        text:null,
        totalNew: null  
    };
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        console.log(props);
        if (!this.props.text) {
            this.props.info = getFriendAlias(this.props.uid);
        }
        this.props.gid = props.gid;
        this.props.ginfo = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo());
        
    }
   
}
