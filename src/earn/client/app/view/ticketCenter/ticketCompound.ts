/**
 * 奖券合成
 */

import { Widget } from '../../../../../pi/widget/widget';
import { register } from '../../../../../app/store/memstore';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Item } from '../../../../server/data/db/item.s';
import { SILVER_TICKET_TYPE, GOLD_TICKET_TYPE, RAINBOW_TICKET_TYPE } from '../../../../server/data/constant';
import { compoundTicket } from '../../net/rpc';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    compoundType:number;// 合成种类
    compoundExtent:number;// 合成进度
    ticketList:any;// 奖券列表
}

export class TicketCompound extends Widget {
    public ok: () => void;
    public props:Props = {
        compoundType:0, 
        compoundExtent:0,
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





    /**
     * 奖券合成
     * @param ind 
     */
    public compound(ind:number) {
        if (this.props.compoundExtent > 0) {
            return;
        }
        this.props.compoundType = ind;
        let resData;
        // compoundTicket()
        const animation = () => {
            if (this.props.compoundExtent < 100) {
                this.props.compoundExtent += 1;
                this.paint();
                timer = requestAnimationFrame(animation);
            } else {
                cancelAnimationFrame(timer);
                this.props.compoundExtent = 0;
                this.paint();
            } 
        };
        let timer = requestAnimationFrame(animation);
    }


    /**
     * 关闭
     */
    public close(e: any) {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行

register('goods',(goods:Item[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});