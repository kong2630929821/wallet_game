
/**
 * 开宝箱 - 首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { Item } from '../../../../server/data/db/item.s';
import { register } from '../../store/memstore';
import { SILVER_TICKET_TYPE, GOLD_TICKET_TYPE, RAINBOW_TICKET_TYPE } from '../../../../server/data/constant';
import { Forelet } from '../../../../../pi/widget/forelet';
import { openChest } from '../../net/rpc';
import { getTicketBalance } from '../../utils/util';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');


interface Props {
    selectTicket: any;
    boxList: any;
    ticketList: any;
}


export class OpenBox extends Widget {
    public ok: () => void;

    public props: Props = {
        selectTicket: {
            type: SILVER_TICKET_TYPE,
            name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
            balance: 0,
        },
        boxList: [0, 0, 0, 0, 0, 0, 0, 0, 0], //0:未开 1:已开
        ticketList: [
            {
                type: SILVER_TICKET_TYPE,
                name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
                balance: 0,
            },
            {
                type: GOLD_TICKET_TYPE,
                name: { "zh_Hans": "金券", "zh_Hant": "金券", "en": "" },
                balance: 0,
            },
            {
                type: RAINBOW_TICKET_TYPE,
                name: { "zh_Hans": "彩券", "zh_Hant": "彩券", "en": "" },
                balance: 0,
            }
        ]

    };

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
        this.paint();
    }

    /**
     * 打开宝箱 
     * @param num 宝箱序数
     */
    public openBox(num: number) {
        if (this.props.boxList[num] === 1) {

            return;
        }
        openChest(this.props.selectTicket.type).then((res)=>{
            popNew('earn-client-app-view-component-lotteryModal', { type: 2 });
            this.props.boxList[num] = 1;
            this.paint();
        })
    }
    /**
     * 重置所有宝箱
     */
    public resetBoxList() {
        this.props.boxList.fill(0);
        this.paint();
    }

    /**
     * 更改宝箱类型
     * @param num 票种
     */
    public change(num: number) {
        this.resetBoxList();
        this.props.selectTicket = this.props.ticketList[num];
        this.paint();
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('earn-client-app-view-myProduct-myProduct', { type: 2 });
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