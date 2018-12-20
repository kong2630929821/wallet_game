/**
 * 奖券兑换-首页
 */


import { Widget } from "../../../../../pi/widget/widget";
import { popNew } from "../../../../../pi/ui/root";

export enum ExchangeType {
    'zeroExchange' = 0,
    'saleExchange' = 1
}

export class TicketCenter extends Widget {
    public ok: () => void;
    public props = {
        isFixed: false,
        navbarSelected: 'zeroExchange',
        navbarList: [
            {
                name: 'zeroExchange',
                title: { "zh_Hans": "0元兑换", "zh_Hant": "0元兌換", "en": "" },
                component:'earn-client-app-view-exchange-exchangeVirtual'
            },
            {
                name: 'saleExchange',
                title: { "zh_Hans": "特价换购", "zh_Hant": "特價換購", "en": "" },
                component:'earn-client-app-view-exchange-exchangeEntity'
            }
        ],

    }

    /**
     * 屏幕滚动
     */
    public scrollHeight(e: any) {
        if (e.target.scrollTop < 260) {
            this.props.isFixed = false;
        } else {
            this.props.isFixed = true;
        }
        this.paint();
    }

    public changeNavbar(index:number) {
        this.props.navbarSelected = this.props.navbarList[index].name;
        this.paint();
    }

    /**
     * 查看规则
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
        popNew('earn-client-app-view-exchange-exchangeHistory');
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}