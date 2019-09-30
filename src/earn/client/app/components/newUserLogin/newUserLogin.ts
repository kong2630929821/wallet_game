/**
 * 新用户登录
 */

import { gotoEarn } from '../../../../../app/view/base/app';
import { Widget } from '../../../../../pi/widget/widget';

export class NewUserLogin extends Widget {
    public ok: () => void;
    public props:any = {
        pi_norouter:true,
        awardName:'铁镐',
        awardNum:2,
        fadeOut:false
    };

    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }

    public close() {
        this.props.fadeOut = true;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok();
        },300);
    }

    public goMining() {
        gotoEarn();
        const w:any = forelet.getWidget(WIDGET_NAME);
        w.miningClick();
        this.close();
    }
}