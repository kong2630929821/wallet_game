
/**
 * 开宝箱 - 首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { Item } from '../../../../server/data/db/item.s';
import { openChest } from '../../net/rpc';
import { getStore, register } from '../../store/memstore';
import { getTicketNum } from '../../utils/util';
import { ActivityType } from '../../xls/dataEnum.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    showTips:boolean; // 空宝箱
    isOpening:boolean;// 正在开启宝箱中
    selectChest: any; // 选择的宝箱类型
    boxList: any; // 宝箱列表
    STbalance: number; // 账户余额(st)
    chestList: any; // 宝箱选择列表
}

export class OpenBox extends Widget {
    public ok: () => void;

    public props: Props = {
        showTips:false,
        isOpening:false,
        boxList: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 0:未开 1:已开
        STbalance:0,
        chestList: [
            {
                type: ActivityType.PrimaryChest,
                name: { zh_Hans: '银券', zh_Hant: '銀券', en: '' },
                needTicketNum:getTicketNum(ActivityType.PrimaryChest)
            },
            {
                type: ActivityType.MiddleChest,
                name: { zh_Hans: '金券', zh_Hant: '金券', en: '' },
                needTicketNum:getTicketNum(ActivityType.MiddleChest)
            },
            {
                type:ActivityType.AdvancedChest,
                name: { zh_Hans: '彩券', zh_Hant: '彩券', en: '' },
                needTicketNum:getTicketNum(ActivityType.AdvancedChest)
            }
        ],
        selectChest: {}

    };

    public create() {
        super.create();
        this.props.selectChest = this.props.chestList[0];
        this.initData();
    }

    /**
     * 初始数据
     */
    public initData() {
        this.props.STbalance = getStore('balance/ST');
        this.paint();
    }

    /**
     * 打开宝箱 
     * @param num 宝箱序数
     */
    public openBox(e:any,num: number) {
        
        if (this.props.boxList[num] === 1) {  // 宝箱已打开
            popNew('app-components1-message-message',{ content:this.config.value.tips[1] });

            return;
        }
        if (this.props.STbalance < this.props.selectChest.needTicketNum) {  // 奖券不够
            popNew('app-components1-message-message',{ content:this.config.value.tips[0] });

            return;
        }
        this.openBoxAnimation(e);
        openChest(this.props.selectChest.type).then((res:any) => {
            this.openBoxAnimation(e);
            if (res.award.awardType !== 9527) {
                popNew('earn-client-app-view-component-lotteryModal-lotteryModal', res.award);
            } else {
                this.emptyChest();
            }
            if (res.award.count === 0) {
                this.emptyChest();
            }
            this.props.boxList[num] = 1;
            this.paint();
        }).catch((err) => {
            this.openBoxAnimation(e);
            this.emptyChest();
            this.props.boxList[num] = 1;
            this.paint();
        });
    }

    /**
     * 设置空宝箱提示
     */
    public emptyChest() {
        this.props.showTips = true;
        this.paint();
        setTimeout(() => {
            this.props.showTips = null;
            this.paint();
        }, 2000);

    }

    /**
     * 设置是否正在开宝箱动画
     */
    public openBoxAnimation(e:any) {
        const $chest = getRealNode(e.node);
        this.props.isOpening = !this.props.isOpening;
        if (this.props.isOpening) {
            $chest.className = 'isOpenbox';
        } else {
            $chest.className = '';
        }
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
     * @param index 序号
     */
    public change(index: number) {
        this.resetBoxList();
        this.props.selectChest = this.props.chestList[index];
        this.paint();
    }

    /**
     * 去充值
     */
    public goRecharge() {
        popNew('app-view-wallet-cloudWalletGT-rechargeGT');
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('earn-client-app-view-myProduct-myProduct', { type: 3 });
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

register('balance/ST',(r) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});