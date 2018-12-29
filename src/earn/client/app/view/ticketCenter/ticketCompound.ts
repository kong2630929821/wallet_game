/**
 * 奖券合成
 */

import { Widget } from '../../../../../pi/widget/widget';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Item } from '../../../../server/data/db/item.s';
import { TicketType, ActivityType } from '../../xls/dataEnum.s';
import { getTicketBalance, getTicketNum } from '../../utils/util';
import { compoundTicket, getAllGoods } from '../../net/rpc';
import { register } from '../../store/memstore';
import { ActTicketNumCfg } from '../../xls/dataCfg.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    compoundType: number;// 合成种类
    compoundExtent: number;// 合成进度
    ticketList: any;// 奖券列表
}

export class TicketCompound extends Widget {
    public ok: () => void;
    public props: Props = {
        compoundType: 0,
        compoundExtent: 0,
        ticketList: [
            {
                type: TicketType.SilverTicket,
                name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
                needTicketNum: getTicketNum(ActivityType.ComposeGold),
                balance: 0
            },
            {
                type: TicketType.GoldTicket,
                name: { "zh_Hans": "金券", "zh_Hant": "金券", "en": "" },
                needTicketNum: getTicketNum(ActivityType.ComposeDiamond),
                balance: 0
            },
            {
                type: TicketType.DiamondTicket,
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
        for (let i = 0; i < this.props.ticketList.length; i++) {
            this.props.ticketList[i].balance = getTicketBalance(this.props.ticketList[i].type);
        }
        this.paint();
    }

    /**
     * 奖券合成
     * @param ind 
     */
    public compound(ind: number) {
        this.props.compoundType = ind;
        const selectData = this.props.ticketList[ind];

        if (this.props.compoundExtent > 0) {                 //正在合成
            //TODO
            return;
        }
        if (selectData.balance < selectData.needTicketNum) { //奖券不够合成
            //TODO
            return;
        }

        compoundTicket(selectData.type).then((res) => {

        });
        const animation = () => {
            if (this.props.compoundExtent < 100) {
                this.props.compoundExtent += 1;
                this.paint();
                timer = requestAnimationFrame(animation);
            } else {
                cancelAnimationFrame(timer);
                getAllGoods();
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

register('goods', (goods: Item[]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});