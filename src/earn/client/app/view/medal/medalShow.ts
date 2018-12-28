/**
 * 勋章成就 --主页
 */

import { Widget } from '../../../../../pi/widget/widget';

export class MedalShow extends Widget {
    public ok: () => void;

    public setProps(props:any){
        super.setProps(props);
        setTimeout(() => {
            this.initData();
        }, 1000);
    }

    /**
     * 更新props数据
     */
    public initData() {
        this.props.top = `0px`;
        this.props.left = `0px`;
        this.paint();
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

