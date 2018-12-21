/**
 * 大转盘 - 首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { SILVER_TICKET_TYPE, GOLD_TICKET_TYPE, RAINBOW_TICKET_TYPE } from '../../../../server/data/constant';

interface Props {
    selectTicket: any;
    turntableList: any;
    turnNum: number;
    isTurn: boolean;
    ticketList:any;
}
export class Turntable extends Widget {
    public ok: () => void;

    public props: Props = {
        selectTicket: {
            type: SILVER_TICKET_TYPE,
            name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
            balance: 0,
            turntableName:{"zh_Hans":"初级大转盘","zh_Hant":"初級大轉盤","en":""}
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
                type: SILVER_TICKET_TYPE,
                name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
                balance: 0,
                turntableName:{"zh_Hans":"初级大转盘","zh_Hant":"初級大轉盤","en":""}
            },
            {
                type: GOLD_TICKET_TYPE,
                name: { "zh_Hans": "金券", "zh_Hant": "金券", "en": "" },
                balance: 0,
                turntableName:{"zh_Hans":"中级大转盘","zh_Hant":"中級大轉盤","en":""}
            },
            {
                type: RAINBOW_TICKET_TYPE,
                name: { "zh_Hans": "彩券", "zh_Hant": "彩券", "en": "" },
                balance: 0,
                turntableName:{"zh_Hans":"高级大转盘","zh_Hant":"高級大轉盤","en":""}
            }
        ]
    };

    /**
     * 初始转盘
     */
    public initTurntable() {
        // 奖品配置

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
        const $turn = document.querySelector('#turntable');
        $turn.style.transition = 'transform 6s ease';
        $turn.style.transform = 'rotate(3600deg)';
        this.paint();
        setTimeout(() => {
            popNew('earn-client-app-view-component-lotteryModal', { type: 2 });
            this.props.isTurn = false;
            $turn.style.transition = 'none';
            $turn.style.transform = 'none';
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