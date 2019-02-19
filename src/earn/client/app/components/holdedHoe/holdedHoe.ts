/**
 * holded hoe
 */
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { HoeType } from '../../xls/hoeType.s';

interface Props {
    holdedNumber:number; // holded hoe number
    hoeType:HoeType;          // hoe type
    selected:HoeType;   // selected
}
export class HoldedHoe extends Widget {
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        let imgUrl = '../../res/image/';
        if (props.hoeType === HoeType.IronHoe) {
            imgUrl = `${imgUrl}2001.png`;
        } else if (props.hoeType === HoeType.GoldHoe) {
            imgUrl = `${imgUrl}2002.png`;
        } else if (props.hoeType === HoeType.DiamondHoe) {
            imgUrl = `${imgUrl}2003.png`;
        }
        this.props = {
            ...props,
            imgUrl
        };
        super.setProps(this.props,oldProps);
        // console.log(this.props,this.props.selected === this.props.hoeType);
    }
    public selectHoeClick(event:any) {
        notify(event.node,'ev-hoe-click',{});
    }
}