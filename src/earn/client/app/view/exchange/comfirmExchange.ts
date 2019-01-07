/**
 * 兑换确认
 */

import { Widget } from '../../../../../pi/widget/widget';
import { exchangeVirtual } from '../../net/rpc';

interface Props {
    STcout:number;
}

export class ComfirmExchange extends Widget {
    public ok: () => void;
    public cancel:() => void;
    public props:any;

    public setProps(props:any) {
        super.setProps(this.props);
        this.props = {
            ...this.props,
            detail:props.detail
        };
    }

    public cancelClick() {
        this.cancel && this.cancel();
    }

    public comfirmClick() {
        exchangeVirtual(this.props.detail.id).then(res => {
            console.log(res);
            
        });

        this.ok && this.ok();
    }
}