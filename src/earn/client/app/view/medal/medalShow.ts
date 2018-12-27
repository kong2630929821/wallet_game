/**
 * 勋章成就 --主页
 */

import { Widget } from '../../../../../pi/widget/widget';
import { Forelet } from '../../../../../pi/widget/forelet';
import { popNew } from '../../../../../pi/ui/root';

export class MedalShow extends Widget {
    public ok: () => void;
    public props = {
    };

    public create() {
        super.create();
        this.initData();
    }

    /**
     * 更新props数据
     */
    public initData() {
        //TODO
        this.paint();
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

