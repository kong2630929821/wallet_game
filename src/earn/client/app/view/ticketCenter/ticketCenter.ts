/**
 * 奖券中心-首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Item } from '../../../../server/data/db/item.s';
import { register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class TicketCenter extends Widget {
    public ok: () => void;
    public props:any = {
        KTbalance: 500,
        ticketList: [
            {
                type: 0,
                name: { zh_Hans: '银券', zh_Hant: '銀券', en: '' },
                balance: 0,
                priceKT: 500
            },
            {
                type: 0,
                name: { zh_Hans: '金券', zh_Hant: '金券', en: '' },
                balance: 0,
                priceKT: 1500
            },
            {
                type: 0,
                name: { zh_Hans: '彩券', zh_Hant: '彩券', en: '' },
                balance: 0,
                priceKT: 2000
            }
        ]
    };

    public create() {
        super.create();
        this.initData();
    }

    /**
     * 更新props数据
     */
    public initData() {
        this.paint();
    }

    /**
     * 活动跳转
     * @param num 活动序号
     */
    public goActivity(num: number) {
        switch (num) {
            case 0:
                popNew('earn-client-app-view-openBox-openBox');// 开宝箱
                break;
            case 1:
                popNew('earn-client-app-view-turntable-turntable');// 大转盘
                break;
            case 2:
                break;
            case 3:
                popNew('earn-client-app-view-exchange-exchange');// 奖券兑换
                break;

            default:
        }
    }

    /**
     * 查看玩法
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
        popNew('earn-client-app-view-openBox-openBoxHistory');
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