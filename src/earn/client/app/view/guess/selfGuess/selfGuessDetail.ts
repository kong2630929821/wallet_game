/**
 * 竞猜主页-我的-详情
 */

import { makeScreenShot } from '../../../../../../app/logic/native';
import { ShareToPlatforms } from '../../../../../../pi/browser/shareToPlatforms';
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
    public shareClick() {
        makeScreenShot(() => {
            popNew('app-components-share-share', { shareType: ShareToPlatforms.TYPE_SCREEN });
        }, () => {
            popNew('app-components1-message-message', { content: this.config.value.tips });
        });
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