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
        let imgUrl = '../../res/image/';
        if (props.hoeType === HoeType.IronHoe) {
            imgUrl = `${imgUrl}2001.png`;
        } else if (props.hoeType === HoeType.GoldHoe) {
            imgUrl = `${imgUrl}2002.png`;
        } else {
            imgUrl = `${imgUrl}2003.png`;
        }
        this.props = {
            ...props,
            imgUrl
        };
        super.setProps(this.props,oldProps);
    }

}