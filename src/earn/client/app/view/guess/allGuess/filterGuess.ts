/**
 * 竞猜主页-筛选
 */

import { Widget } from '../../../../../../pi/widget/widget';

export class FilterGuess extends Widget {
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