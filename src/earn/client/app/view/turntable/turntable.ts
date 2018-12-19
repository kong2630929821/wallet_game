/**
 * 大转盘 - 首页
 */


import { Widget } from "../../../../../pi/widget/widget";
import { popNew } from "../../../../../pi/ui/root";


interface Props {
    selectTicket: number;
    turntableList: any;
    turnNum: number;
    isTurn: boolean;
}
export class Turntable extends Widget {
    public ok: () => void;

    public props: Props = {
        selectTicket: 0,
        turnNum: 30,
        isTurn: false,
        turntableList: [
            { 'text': '耳机', 'name': 'icono-headphone' },
            { 'text': 'iPhone', 'name': 'icono-iphone' },
            { 'text': '相机', 'name': 'icono-camera' },
            { 'text': '咖啡杯', 'name': 'icono-cup' },
            { 'text': '日历', 'name': 'icono-calendar' },
            { 'text': '键盘', 'name': '' },
            { 'text': '键盘', 'name': '' },
            { 'text': '键盘', 'name': '' }
        ]
    }

    /**
     * 初始转盘
     */
    public initTurntable() {
        // 奖品配置

        this.paint();
    }

    /**
     * 
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
        this.props.selectTicket = num;
        this.paint();
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('earn-client-app-view-openBox-openBoxHistory', { type: 2 });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}