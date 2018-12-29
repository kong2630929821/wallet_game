/**
 * sign in
 */
import { Widget } from '../../../../../../pi/widget/widget';
import { SeriesDaysRes } from '../../../../../server/rpc/itemQuery.s';
import { getLoginDays } from '../../../net/rpc';

export class SignIn extends Widget {
    public ok:() => void;
    public closeClick() {
        this.ok && this.ok();
    }

    public create() {
        super.create();
        this.init();
    }

    public init() {
        getLoginDays().then((r:SeriesDaysRes) => {
            this.props.signInDays = r.days;
        });
        this.props = {
            signInDays:1
        };
    }
}