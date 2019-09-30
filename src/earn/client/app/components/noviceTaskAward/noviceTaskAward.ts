/**
 * 新手任务奖励弹窗
 */

import { gotoEarn } from '../../../../../app/view/base/app';
import { Widget } from '../../../../../pi/widget/widget';
import { getPrizeInfo } from '../../utils/util';

export class NewUserLogin extends Widget {
    public ok: () => void;
    public props:any = {
        fadeOut:false,
        title:'签到奖励', // 获得奖品途径
        awardType:2001,  // 奖品编号
        awardName:'铁镐', // 奖品名字
        awardNum:1  // 奖品数量
    };

    public setProps(props:any) {
        super.setProps(props);
        this.config = { value: { group: 'top' } };
        const prize = getPrizeInfo(props.awardType);

        this.props.awardName = prize.zh_hans;
    }

    public close() {
        this.props.fadeOut = true;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok();
        },300);
    }

    // 去挖矿
    public goMining() {
        gotoEarn();
        const w:any = forelet.getWidget(WIDGET_NAME);
        w.miningClick();
        this.close();
    }
}