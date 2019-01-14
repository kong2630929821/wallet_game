/**
 * 竞猜组件
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

export interface Props {
    guessBtn:boolean;
    guessData:{
        team1:string;
        team2:string;
        support1:number;
        support2:number;
    };
    showOdds:boolean;
}
export class GuessItem extends Widget {
    public ok: () => void;
    public props:any = {
        
    };

    public setProps(props:Props) {
        super.setProps(this.props);
        this.props = {
            ...this.props,
            guessBtn:props.guessBtn,
            guessData:props.guessData,
            showOdds:props.showOdds
        };
    }

    public goGuess() {
        popNew('earn-client-app-view-guess-allGuess-guessDetail');
    }

}