/**
 * 新手任务奖励弹窗
 */

import { gotoEarn } from '../../../../../app/view/base/app';
import { Widget } from '../../../../../pi/widget/widget';
import { forelet,WIDGET_NAME } from '../../view/home/home1';

export class NewUserLogin extends Widget {
    public ok: () => void;
    public props:any = {
        title:'签到奖励',
        awardImg:'2001.jpg',
        awardName:'铁镐',
        awardNum:1
    };

    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }

    public close() {
        this.ok && this.ok();
    }

    // 去挖矿
    public goMining() {
        gotoEarn();
        const w:any = forelet.getWidget(WIDGET_NAME);
        w.miningClick();
        this.close();
    }
}