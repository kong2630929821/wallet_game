/**
 * 奖券兑换-首页
 */


import { Widget } from "../../../../../pi/widget/widget";
import { popNew } from "../../../../../pi/ui/root";
import { TicketType } from "../../xls/dataEnum.s";
import { register } from "../../store/memstore";
import { Item } from "../../../../server/data/db/item.s";
import { Forelet } from "../../../../../pi/widget/forelet";
import { getTicketBalance, getVirtualExchangeList } from "../../utils/util";

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');


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
                component:'earn-client-app-view-exchange-virtualList'
            },
            {
                name: 'saleExchange',
                title: { "zh_Hans": "特价换购", "zh_Hant": "特價換購", "en": "" },
                component:'earn-client-app-view-exchange-entityList'
            }
        ],
        ticketList: [
            {
                type: TicketType.SilverTicket,
                name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
                balance: 0,
            },
            {
                type: TicketType.GoldTicket,
                name: { "zh_Hans": "金券", "zh_Hant": "金券", "en": "" },
                balance: 0,
            },
            {
                type: TicketType.DiamondTicket,
                name: { "zh_Hans": "彩券", "zh_Hant": "彩券", "en": "" },
                balance: 0,
            }
        ]

    }

    public create() {
        super.create();
        this.initData();

    }

    /**
     * 初始数据
     */
    public initData() {
        for(let i=0;i<this.props.ticketList.length;i++){
            this.props.ticketList[i].balance = getTicketBalance(this.props.ticketList[i].type);
        }
        if(this.props.navbarSelected === this.props.navbarList[0].name){
            let list = getVirtualExchangeList();
            console.log('list--------------',list);
            
        }
        this.paint();
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


// ===================================================== 立即执行

register('goods',(goods:Item[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});