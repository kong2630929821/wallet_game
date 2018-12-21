/**
 * sign in
 */
import { Widget } from '../../../../../../pi/widget/widget';

export class SignIn extends Widget {
    public ok:() => void;
    public closeClick() {
        this.ok && this.ok();
    }
}