/**
 * 竞猜详情-下单
 */

import { Widget } from '../../../../../../pi/widget/widget';

export class GuessDetail extends Widget {
    public ok: () => void;
    
    public props:any = {
        selectTopbar:{},
        guessSTnum:0
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