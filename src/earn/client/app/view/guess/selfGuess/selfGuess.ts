/**
 * 竞猜主页-我的
 */

import { popNew } from '../../../../../../pi/ui/root';
import { Widget } from '../../../../../../pi/widget/widget';

export class SelfGuess extends Widget {
    public ok: () => void;
    
    public props:any = {
        selectTopbar:{}
    };

    public create () {
        super.create();
        console.log();
        
    }

    /**
     * 详情
     */
    public goDetail() {
        popNew('earn-client-app-view-guess-selfGuess-selfGuessDetail');
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}