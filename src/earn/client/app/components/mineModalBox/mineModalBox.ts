import { Widget } from '../../../../../pi/widget/widget';

/**
 * mineModalBox
 */

export class MineModalBox extends Widget {
    public ok:() => void;
    public closeClick() {
        
        this.ok && this.ok();
    }
}