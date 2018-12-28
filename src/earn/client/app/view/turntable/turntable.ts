/**
 * 大转盘 - 首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getTicketBalance, getPrizeList, getTicketNum } from '../../utils/util';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Item } from '../../../../server/data/db/item.s';
import { openTurntable, getAllGoods } from '../../net/rpc';
import { TicketType, ActivityType } from '../../xls/dataEnum.s';
import { register } from '../../store/memstore';

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
        selectTicket: {},
        turnNum: 0,
        isTurn: false,
        turntableList: [],
        ticketList: [
            {
                type: TicketType.SilverTicket,
                name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
                balance: 0,
                needTicketNum: getTicketNum(ActivityType.SilverTurntable),
                turntableName: { "zh_Hans": "初级大转盘", "zh_Hant": "初級大轉盤", "en": "" },
                activityType: ActivityType.SilverTurntable
            },
            {
                type: TicketType.GoldTicket,
                name: { "zh_Hans": "金券", "zh_Hant": "金券", "en": "" },
                balance: 0,
                needTicketNum: getTicketNum(ActivityType.GoldTurntable),
                turntableName: { "zh_Hans": "中级大转盘", "zh_Hant": "中級大轉盤", "en": "" },
                activityType: ActivityType.GoldTurntable
            },
            {
                type: TicketType.DiamondTicket,
                name: { "zh_Hans": "彩券", "zh_Hant": "彩券", "en": "" },
                balance: 0,
                needTicketNum: getTicketNum(ActivityType.DiamondTurntable),
                turntableName: { "zh_Hans": "高级大转盘", "zh_Hant": "高級大轉盤", "en": "" },
                activityType: ActivityType.DiamondTurntable
            }
        ]
    };

    public create() {
        super.create();
        this.props.selectTicket = this.props.ticketList[0];
        this.initTurntable();
        this.initData();
    }

    /**
     * 初始转盘
     */
    public initTurntable() {
        // 奖品配置  
        const prizeList = getPrizeList(this.props.selectTicket.activityType);
        this.props.turntableList = [];

        for (let i = 0, length = prizeList.length; i < length; i++) {
            const prizeItem = {
                awardType: prizeList[i],
                deg: (-360 / length) * i
            };
            this.props.turntableList.push(prizeItem);
        }
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
        if (this.props.isTurn) {//正在转

            return;
        }
        if (this.props.selectTicket.balance < this.props.selectTicket.needTicketNum) {//余票不足

            return;
        }
        this.props.isTurn = true;
        let resData;

        this.goLotteryAnimation();

        openTurntable(this.props.selectTicket.type).then((res) => {
            resData = res;
            this.goLotteryAnimation(res);
        }).catch((err) => {
            //TODO
        })

        setTimeout(() => {
            this.props.isTurn = false;
            this.goLotteryAnimation();
            if (resData.resultNum === 1) {
                popNew('earn-client-app-view-component-lotteryModal', resData.award);
            }
        }, 6000);
    }


    /**
     * 转盘开奖动画
     */
    public goLotteryAnimation(resData?: any) {
        const $turnStyle = document.querySelector('#turntable').style;
        if (!this.props.isTurn) {//停止转动
            $turnStyle.transition = 'none';
            $turnStyle.transform = `rotate(${this.props.turnNum}deg)`;

            return;
        }
        if (!resData) {//开始转动
            $turnStyle.transition = 'transform 6s ease';
            $turnStyle.transform = `rotate(${this.props.turnNum + 3600}deg)`;
        } else if (resData.resultNum === 1) { //抽奖接口成功，修改旋转角度
            this.props.turntableList.forEach(element => {
                if (element.awardType === resData.award.awardType) {
                    this.props.turnNum = element.deg;
                    this.goLotteryAnimation();

                    return;
                }
            });
        } else if (resData.resultNum !== 1) { //抽奖接口失败
            //TODO
        }
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
        this.initTurntable();
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

register('goods', (goods: Item[]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});