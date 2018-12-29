/**
 * 兑换确认
 */

import { Widget } from '../../../../../pi/widget/widget';

export class ComfirmExchange extends Widget {
    public ok: () => void;
    public cancel:() => void;

    public cancelClick() {
        this.cancel && this.cancel();
    }

    public comfirmClick() {
        this.ok && this.ok();
    }
}