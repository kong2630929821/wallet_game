/**
 * holded hoe
 */
import { notify } from '../../../../../../pi/widget/event';
import { Widget } from '../../../../../../pi/widget/widget';
import { HoeType } from '../../../xls/hoeType.s';

interface Props {
    holdedNumber:number; // holded hoe number
    hoeType:HoeType;          // hoe type
    selected:HoeType;   // selected
}
export class HoldedHoe extends Widget {
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        let imgUrl = '../../../res/image/';
        if (props.hoeType === HoeType.CopperHoe) {
            imgUrl = `${imgUrl}copper_hoe.png`;
        } else if (props.hoeType === HoeType.SilverHoe) {
            imgUrl = `${imgUrl}silver_hoe.png`;
        } else {
            imgUrl = `${imgUrl}gold_hoe.png`;
        }
        this.props = {
            ...props,
            imgUrl
        };
        super.setProps(this.props,oldProps);
    }
    public selectHoeClick(event:any) {
        notify(event.node,'ev-hoe-click',{});
    }
}