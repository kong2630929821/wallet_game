/**
 * 新手任务奖励弹窗
 */

import { Widget } from '../../../../../pi/widget/widget';

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

    public close(e: any) {
        this.ok && this.ok();
    }
}