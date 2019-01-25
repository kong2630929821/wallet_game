/**
 * 开宝箱 - 首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { addST, getSTbalance, isFirstFree, openChest } from '../../net/rpc';
import { getStore, register } from '../../store/memstore';
import { getTicketNum, isLogin } from '../../utils/util';
import { ActivityType } from '../../xls/dataEnum.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    showTip: any; // 空宝箱
    isOpening: boolean;// 正在开启宝箱中
    selectChest: any; // 选择的宝箱类型
    boxList: any; // 宝箱列表
    STbalance: number; // 账户余额(st)
    chestList: any; // 宝箱选择列表
    isFirstPlay: boolean; // 每日第一次免费,
    ledShow:boolean;  // 彩灯状态
    LEDTimer:any;     // 彩灯控制器
}

export class OpenBox extends Widget {
    public ok: () => void;

    public props: Props = {
        showTip: { zh_Hans: '', zh_Hant: '', en: '' },
        isOpening: false,
        boxList: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 0:未开 1:空宝箱 2:获奖
        STbalance: 0,
        chestList: [
            {
                type: ActivityType.PrimaryChest,
                name: { zh_Hans: '银券', zh_Hant: '銀券', en: '' },
                needTicketNum: getTicketNum(ActivityType.PrimaryChest)
            },
            {
                type: ActivityType.MiddleChest,
                name: { zh_Hans: '金券', zh_Hant: '金券', en: '' },
                needTicketNum: getTicketNum(ActivityType.MiddleChest)
            },
            {
                type: ActivityType.AdvancedChest,
                name: { zh_Hans: '彩券', zh_Hant: '彩券', en: '' },
                needTicketNum: getTicketNum(ActivityType.AdvancedChest)
            }
        ],
        selectChest: {},
        isFirstPlay: true,
        ledShow:false,
        LEDTimer:{}
    };

    public create() {
        super.create();
        if (isLogin()) {
            isFirstFree().then((res: any) => {
                this.props.isFirstPlay = res.freeBox;
                this.setChestTip(2);
            });
            this.initData();
            this.ledTimer();
            
        }
        // inviteUsersToGroup();
    }

    public attach() {
        if (!isLogin()) {
            this.backPrePage();
        } else {
            this.change(0);
        }
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
    public openBox(e: any, num: number) {
        if (this.props.isOpening) {
            return;
        }
        if (this.props.boxList[num] !== 0) {  // 宝箱已打开
            popNew('app-components1-message-message', { content: this.config.value.tips[1] });

            return;
        }
        if (this.props.STbalance < this.props.selectChest.needTicketNum) {  // 奖券不够
            if (!((this.props.selectChest.type === ActivityType.PrimaryChest) && this.props.isFirstPlay)) {
                popNew('app-components1-message-message', { content: this.config.value.tips[0] });

                return;

            }
        }
        this.startOpenChest(e);
        openChest(this.props.selectChest.type).then((res: any) => {
            this.props.isFirstPlay = false;
            this.endOpenChest(e);
            if (res.award.awardType !== 9527) {
                popNew('earn-client-app-components-lotteryModal-lotteryModal', res.award);
                this.props.boxList[num] = 1;
                this.setChestTip(2);
            } else {
                this.props.boxList[num] = 2;
                this.setChestTip();
            }
            this.paint();
        }).catch((err) => {
            this.endOpenChest(e);
            this.setChestTip();
            this.props.boxList[num] = 1;
            this.paint();
        });
    }

    /**
     * 设置宝箱提示
     */
    /**
     * 
     * @param tipIndex 提示序号 0:免费,1:空宝箱,2:售价
     */
    public setChestTip(tipIndex: number = 1) {
        const chestTips = this.config.value.chestTips;

        switch (tipIndex) {
            case 0:
                this.props.showTip = chestTips[0];
                this.paint();
                break;
            case 1:
                this.props.showTip = chestTips[1];
                this.paint();
                setTimeout(() => {
                    this.setChestTip(2);
                    this.paint();
                }, 1000);
                break;
            case 2:
                if (this.props.isFirstPlay && this.props.selectChest.type === ActivityType.PrimaryChest) {
                    this.setChestTip(0);
                } else {
                    this.props.showTip = { zh_Hans: `售价：${this.props.selectChest.needTicketNum}ST/1个`, zh_Hant: `售價：${this.props.selectChest.needTicketNum}ST/1個`, en: '' };
                }
                this.paint();
                break;

            default:
        }
    }

    /**
     * 结束开宝箱
     */
    public endOpenChest(e: any) {
        const $chest = getRealNode(e.node);
        $chest.style.animation = 'none';
        this.props.isOpening = false;
        this.paint();
    }

    /**
     * 开始开宝箱
     */
    public startOpenChest(e: any) {
        const $chest:any = getRealNode(e.node);
        $chest.style.animation = 'openChest 0.2s ease infinite';
        this.props.isOpening = true;
        this.paint();
    }

    /**
     * 重置所有宝箱
     */
    public resetBoxList() {
        this.props.boxList.forEach((element,i) => {
            const $chest:any = document.getElementsByClassName('chest-img')[i];
            $chest.style.animation = 'resetChest 0.5s ease';
            this.props.boxList[i] = 0;
        });
        this.paint();
        
        setTimeout(() => {
            this.props.boxList.forEach((element,i) => {
                const $chest:any = document.getElementsByClassName('chest-img')[i];
                $chest.style.animation = 'none';
            });
            this.paint();
        }, 500);
    }

    /**
     * 更改宝箱类型
     * @param index 序号
     */
    public change(index: number) {
        this.resetBoxList();
        this.props.selectChest = this.props.chestList[index];
        this.setChestTip(2);
        this.paint();
    }

    /**
     * 计算比赛时间
     */
    public ledTimer() {

        this.props.LEDTimer = setInterval(() => {
            this.props.ledShow = !this.props.ledShow;
            this.paint();
        }, 1000);

    }

    /**
     * 点击效果
     */
    public btnClick(e: any , eventType: number, eventValue?:any) {
        const $dom = getRealNode(e.node);
        $dom.className = 'btnClick';
        setTimeout(() => {
            $dom.className = '';
        }, 100);
        switch (eventType) { // 重置宝箱
            case 0:
                this.resetBoxList();
                break;
            case 1:          // 充值
                this.goRecharge();
                break;
            case 2:          // 更换宝箱类型
                this.change(eventValue);
                break;
            
            default:
        }
    }

    /**
     * 去充值
     */
    public goRecharge() {
        addST();
        // popNew('app-view-wallet-cloudWallet-rechargeKT');
    }

    /**
     * 刷新页面
     */
    public refresh() {
        getSTbalance();
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('earn-client-app-view-myProduct-myProduct', { type: 3 });
    }

    public destroy() {
        clearInterval(this.props.LEDTimer);

        return true;
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行

register('userInfo/uid', (r: any) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});

register('balance/ST', (r: any) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});