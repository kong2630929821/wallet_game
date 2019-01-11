/**
 * 竞猜组件
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

export interface Props {
    guessBtn:boolean;
}
export class GuessItem extends Widget {
    public ok: () => void;
    public props:any = {
        
    };

    public setProps(props:Props) {
        super.setProps(this.props);
        this.props = {
            ...this.props,
            guessBtn:props.guessBtn
        };
    }

    public goGuess() {
        popNew('earn-client-app-view-guess-allGuess-guessDetail');
    }

}