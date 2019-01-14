/**
 * 竞猜主页-我的-详情
 */

import { Widget } from '../../../../../../pi/widget/widget';

export class SelfGuessDetail extends Widget {
    public ok: () => void;
    
    public props:any = {
        selectTopbar:{}
    };

    public create () {
        super.create();
        console.log();
        
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}