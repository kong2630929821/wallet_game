/**
 * welfare award
 */
import { Widget } from '../../../../../../pi/widget/widget';

interface Props {
    received:boolean;     // 是否已领取
    canReceive:boolean;    // 是否可以领取
    conditionText:string;         // 领取条件
}
export class WelfareAward extends Widget {
    public setProps(props:Props,oldProps:Props) {
        let imgUrl = '../../../res/image/';
        if (props.received) {
            imgUrl = `${imgUrl}boxOpen1.png`;
        } else {
            imgUrl = `${imgUrl}box1.png`;
        }
        // console.log(props);
        this.props = {
            ...props,
            imgUrl
        };
        super.setProps(this.props,oldProps);
    }
}