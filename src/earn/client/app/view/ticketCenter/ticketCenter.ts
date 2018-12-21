/**
 * 奖券中心-首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

export class TicketCenter extends Widget {
    public ok: () => void;
    public props = {
        KTbalance: 500
    };

    /**
     * 活动跳转
     * @param num 活动序号
     */
    public goActivity(num: number) {
        switch (num) {
            case 0:
                popNew('earn-client-app-view-openBox-openBox');// 开宝箱
                break;
            case 1:
                popNew('earn-client-app-view-turntable-turntable');// 大转盘
                break;
            case 2:
                break;
            case 3:
                break;

            default:
        }
    }
    /**
     * 查看玩法
     */
    public goRule() {
        popNew('earn-client-app-view-ticketCenter-playRule');
    }

    /**
     * 奖券合成 
     */
    public goCompound() {
        popNew('earn-client-app-view-ticketCenter-ticketCompound');
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('earn-client-app-view-openBox-openBoxHistory');
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}