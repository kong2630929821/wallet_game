/**
 * 竞猜主页-我的-详情
 */

import { popNew } from '../../../../../../pi/ui/root';
import { Widget } from '../../../../../../pi/widget/widget';

export class SelfGuessDetail extends Widget {
    public ok: () => void;
    
    public props:any = {

    };

    public setProps(props:any) {
        super.setProps(this.props);
        if (props.guessData) {
            this.props.guessData = props.guessData;
        }
        if (props.guessing) {
            this.props.guessing = props.guessing;
        }
        this.paint();
    }

    public create () {
        super.create();
        console.log();
        
    }

    /**
     * 分享
     */
    public share() {
        console.log();
        
    }

    /**
     * 继续竞猜
     */
    public continueGuess() {
        popNew('earn-client-app-view-guess-allGuess-guessDetail',{ guessData:this.props.guessData });
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}