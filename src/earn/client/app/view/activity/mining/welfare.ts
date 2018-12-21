/**
 * sign in
 */
import { Widget } from '../../../../../../pi/widget/widget';

export class Welfare extends Widget {
    public ok:() => void;
    public create() {
        this.props = {
            welfareAwards : [
                {
                    received:true,
                    canReceive:false,
                    conditionText:'3人'
                },{
                    received:false,
                    canReceive:true,
                    conditionText:'6人'
                },{
                    received:false,
                    canReceive:false,
                    conditionText:'9人'
                },{
                    received:false,
                    canReceive:false,
                    conditionText:'12人'
                }
            ]
        };
    }
    public closeClick() {
        this.ok && this.ok();
    }
}