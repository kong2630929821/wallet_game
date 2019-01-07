/**
 * sign in award 签到奖励
 */
import { Widget } from '../../../../../pi/widget/widget';
import { HoeType } from '../../xls/hoeType.s';

interface Props {
    continuedDays:number;   // 持续天数
    hoeType:HoeType;      // 锄头类型
    received:boolean;     // 是否已领取
}
export class SignInAward extends Widget {
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        let imgUrl = '../../../res/image/';
        if (props.hoeType === HoeType.IronHoe) {
            imgUrl = `${imgUrl}iron_hoe.png`;
        } else if (props.hoeType === HoeType.GoldHoe) {
            imgUrl = `${imgUrl}gold_hoe.png`;
        } else {
            imgUrl = `${imgUrl}diamond_hoe.png`;
        }
        this.props = {
            ...props,
            imgUrl
        };
        super.setProps(this.props,oldProps);
    }

}