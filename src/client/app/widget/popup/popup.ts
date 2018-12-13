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


// ===========================导出
export class Popup extends Widget {
    constructor() {
        super();
        this.props = {
            options: [],
        };
    }

    public setProps(props:any) {
        this.props.options = props;
        super.setProps(props);
        console.log("!!!!!!!!poopup", props);

    }
}
