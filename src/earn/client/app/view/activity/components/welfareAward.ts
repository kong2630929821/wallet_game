/**
 * welfare award
 */
import { Widget } from '../../../../../../pi/widget/widget';
import { converInviteAwards } from '../../../net/rpc';

interface Props {
    awardIndex:number;   // 奖励下标
    received:boolean;     // 是否已领取
    canReceive:boolean;    // 是否可以领取
    inviteNumber:string;         // 领取条件
}
export class WelfareAward extends Widget {
    public setProps(props:Props,oldProps:Props) {
        let imgUrl = '../../../res/image/';
        if (props.received) {
            imgUrl = `${imgUrl}boxOpen7002.png`;
        } else {
            imgUrl = `${imgUrl}box7002.png`;
        }
        // console.log(props);
        this.props = {
            ...props,
            imgUrl
        };
        super.setProps(this.props,oldProps);
    }

    public openClick() {
        if (!this.props.canReceive) return;
        converInviteAwards(this.props.awardIndex);
    }
}