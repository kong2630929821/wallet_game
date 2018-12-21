/**
 * 奖券中心-首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { SILVER_TICKET_TYPE, GOLD_TICKET_TYPE, RAINBOW_TICKET_TYPE } from '../../../../server/data/constant';

export class TicketCenter extends Widget {
    public ok: () => void;
    public props = {
        KTbalance: 500,
        ticketList: [
            {
                type: SILVER_TICKET_TYPE,
                name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
                balance: 0,
                priceKT: 500
            },
            {
                type: GOLD_TICKET_TYPE,
                name: { "zh_Hans": "金券", "zh_Hant": "金券", "en": "" },
                balance: 0,
                priceKT: 1500
            },
            {
                type: RAINBOW_TICKET_TYPE,
                name: { "zh_Hans": "彩券", "zh_Hant": "彩券", "en": "" },
                balance: 0,
                priceKT: 2000
            }
        ]
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