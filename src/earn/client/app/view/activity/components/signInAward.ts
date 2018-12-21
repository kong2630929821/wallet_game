/**
 * sign in award 签到奖励
 */
import { Widget } from '../../../../../../pi/widget/widget';

interface Props {
    continuedDays:number;   // 持续天数
    awardImgUrl:string;    // 奖品图片url
    received:boolean;     // 是否已领取
}
export class SignInAward extends Widget {
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }

    public init() {
        // console.log('============');
    }
}