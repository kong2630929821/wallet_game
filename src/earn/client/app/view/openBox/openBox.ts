
/**
 * 开宝箱 - 首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { clientRpcFunc } from '../../net/init';
import { item_query } from '../../../../server/rpc/user_item.p';
import { Items } from '../../../../server/data/db/item.s';
import { getStore } from '../../store/memstore';
import { SILVER_TICKET_TYPE, GOLD_TICKET_TYPE, RAINBOW_TICKET_TYPE } from '../../../../server/data/constant';



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


    public initData() {
        this.getTicketNum();
    }


    /**
    * 获取用户各种余票
    */
    public getTicketNum() {
        const uid = getStore('uid');
        clientRpcFunc(item_query, uid, (r: Items) => {
            //todo
        });
    }

    /**
     * 打开单个宝箱 
     * @param num 宝箱序数
     */
    public openBox(num: number) {
        if (this.props.boxList[num] === 1) {

            return;
        }
        popNew('earn-client-app-view-component-lotteryModal', { type: 2 });
        this.props.boxList[num] = 1;
        this.paint();
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