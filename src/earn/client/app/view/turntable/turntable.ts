/**
 * 大转盘 - 首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getTicketBalance } from '../../utils/util';
import { Forelet } from '../../../../../pi/widget/forelet';
import { register } from '../../../../../app/store/memstore';
import { Item } from '../../../../server/data/db/item.s';
import { openTurntable } from '../../net/rpc';
import { TicketType } from '../../xls/dataEnum.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');


interface Props {
    selectTicket: any;
    turntableList: any;
    turnNum: number;
    isTurn: boolean;
    ticketList: any;
}
export class Turntable extends Widget {
    public ok: () => void;

    public props: Props = {
        selectTicket: {
            type: TicketType.SilverTicket,
            name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
            balance: 0,
            turntableName: { "zh_Hans": "初级大转盘", "zh_Hant": "初級大轉盤", "en": "" }
        },
        turnNum: 30,
        isTurn: false,
        turntableList: [
            { text: '耳机', name: 'icono-headphone' },
            { text: 'iPhone', name: 'icono-iphone' },
            { text: '相机', name: 'icono-camera' },
            { text: '咖啡杯', name: 'icono-cup' },
            { text: '日历', name: 'icono-calendar' },
            { text: '键盘', name: '' },
            { text: '键盘', name: '' },
            { text: '键盘', name: '' }
        ],
        ticketList: [
            {
                type: TicketType.SilverTicket,
                name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
                balance: 0,
                turntableName: { "zh_Hans": "初级大转盘", "zh_Hant": "初級大轉盤", "en": "" }
            },
            {
                type: TicketType.GoldTicket,
                name: { "zh_Hans": "金券", "zh_Hant": "金券", "en": "" },
                balance: 0,
                turntableName: { "zh_Hans": "中级大转盘", "zh_Hant": "中級大轉盤", "en": "" }
            },
            {
                type: TicketType.DiamondTicket,
                name: { "zh_Hans": "彩券", "zh_Hant": "彩券", "en": "" },
                balance: 0,
                turntableName: { "zh_Hans": "高级大转盘", "zh_Hant": "高級大轉盤", "en": "" }
            }
        ]
    };

    public create() {
        super.create();
        this.initTurntable();
        this.initData();
    }

    /**
     * 初始转盘
     */
    public initTurntable() {
        // 奖品配置TODO     

        this.paint();
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
     * 开奖
     */
    public goLottery() {
        if (this.props.isTurn) {

            return;
        }
        this.props.isTurn = true;
        let resData;
        const $turn = document.querySelector('#turntable');
        $turn.style.transition = 'transform 6s ease';
        $turn.style.transform = `rotate(${this.props.turnNum+360}deg)`;
        this.paint();

        openTurntable(this.props.selectTicket.type).then((res) => {
            this.props.turnNum = 60;
            $turn.style.transform = `rotate(${this.props.turnNum+360}deg)`;
        }).catch(()=>{
            this.props.turnNum +=50;
            $turn.style.transform = `rotate(${this.props.turnNum+360}deg)`;
        })

        setTimeout(() => {
            this.props.isTurn = false;
            $turn.style.transition = 'none';
            $turn.style.transform = `rotate(${this.props.turnNum}deg)`;
            if (resData) {
                popNew('earn-client-app-view-component-lotteryModal', { type: 2 });

            }
        }, 6000);
    }

    /**
     * 更改宝箱类型
     * @param num 票种
     */
    public change(num: number) {
        if (this.props.isTurn) {

            return;
        }
        this.props.selectTicket = this.props.ticketList[num];
        this.paint();
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('earn-client-app-view-myProduct-myProduct', { type: 1 });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}



// ===================================================== 立即执行

register('goods', (goods: Item[]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});