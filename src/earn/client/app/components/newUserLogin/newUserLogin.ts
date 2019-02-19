/**
 * 新用户登录
 */

import { gotoEarn } from '../../../../../app/view/base/app';
import { Widget } from '../../../../../pi/widget/widget';
import { forelet,WIDGET_NAME } from '../../view/home/home1';

export class NewUserLogin extends Widget {
    public ok: () => void;
    public props:any = {
        pi_norouter:true,
        awardName:'铁镐',
        awardNum:2
    };

    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }

    public close() {
        this.ok && this.ok();
    }

    public goMining() {
        gotoEarn();
        const w:any = forelet.getWidget(WIDGET_NAME);
        w.miningClick();
        this.close();
    }
}