/**
 * 开宝箱 - 首页
 */
import { getModulConfig } from '../../../../../app/modulConfig';
import { popNewMessage } from '../../../../../app/utils/tools';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { FreePlay } from '../../../../server/data/db/item.s';
import { getKTbalance } from '../../net/rpc';
import { isFirstFree, openChest} from '../../net/rpc_order';
import { getStore, register, setStore } from '../../store/memstore';
import { wathcAdGetAward } from '../../utils/tools';
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
    chestList: any; // 宝箱选择列表
    freeCount: number; // 免费次数
    ledShow:boolean;  // 彩灯状态
    LEDTimer:any;     // 彩灯控制器
    watchAdAward:number; // 看广告已经获得的免费次数
    showMoreSetting: boolean; // 展开设置免密支付
    adCount:number;// 看广告次数
    moneyName:string; // 消费金额的类型
}

enum BoxState {
    unOpenBox = 0,
    prizeBox = 1,
    emptyBox = 2
}
export class OpenBox extends Widget {
    public ok: () => void;

    public props: Props = {
        showTip: { zh_Hans: '', zh_Hant: '', en: '' },
        isOpening: false,
        boxList: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 0:未开 1:获奖宝箱 2:空宝箱
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
        freeCount: 0,
        ledShow:false,
        LEDTimer:{},
        watchAdAward:0,
        showMoreSetting: false,
        adCount:10,
        moneyName:''
    };
    public cancel: any;

    public create() {
        super.create();
        this.props.moneyName = getModulConfig('KT_SHOW');
        if (isLogin()) {
            this.ledTimer();
            getKTbalance();
            this.state.KTbalance = getStore('balance/KT') || 0;
            isFirstFree().then((res: FreePlay) => {
                this.props.freeCount = res.freeBox;
                this.props.watchAdAward = res.adAwardBox;
                this.setChestTip(2);
            });
        }
    }

    public attach() {
        if (!isLogin()) {
            this.backPrePage();
        } else {
            this.change(0);
        }
    }
    /**
     * 打开宝箱 
     * @param num 宝箱序数
     */
    public openBox(e: any, boxIndex: number) {
        if (this.props.isOpening) {

            return;
        }
        if (this.props.boxList[boxIndex] !== 0) {  // 宝箱已打开
            popNew('app-components1-message-message', { content: this.config.value.tips[1] });

            return;
        }
        if (this.props.selectChest.type === ActivityType.PrimaryChest) {
            if (this.props.freeCount <= 0) { // 没有免费次数
                // popNew('app-components1-message-message', { content: this.config.value.tips[0] });
                this.popNextTips();
                
                return;
            }
        } else if (this.state.KTbalance < this.props.selectChest.needTicketNum) {
            popNewMessage({ zh_Hans: '余额不足', zh_Hant: '餘額不足', en: '' });
            return;
        }
        this.startOpenChest(e);
        openChest(this.props.selectChest.type).then((order: any) => {
            if (this.props.selectChest.type !== ActivityType.PrimaryChest) {
                this.goLottery(e,boxIndex,order);
                this.props.freeCount = 0;
            } else {         // 免费机会开奖
                this.props.freeCount--;
                this.goLottery(e,boxIndex,order);
                setStore('flags/firstOpenBox',true);
            }    
        }).catch((err) => {
            this.endOpenChest(e,boxIndex,BoxState.unOpenBox);
        });
    }
    
    /**
     * 弹窗提示看广告或聊天
     */
    public popNextTips() {
        if (this.props.isOpening) return;

        if (this.props.watchAdAward < 10) {
            popModalBoxs('earn-client-app-components-lotteryModal-lotteryModal1', {
                img:'../../res/image/no_free.png',
                btn1:`更多免费机会(${this.props.watchAdAward}/${10})`,// 按钮1 
                btn2:'知道了'// 按钮2
            },(num) => {
                if (num === 1) {
                    wathcAdGetAward(4,(award) => {
                        this.props.freeCount = award.freeBox;
                        this.props.watchAdAward = award.adAwardBox;
                        this.setChestTip(2);
                    });
                } else {
                    this.paint();
                }
            });
        } else if (this.props.selectChest.type === ActivityType.PrimaryChest) {
            popModalBoxs('earn-client-app-components-lotteryModal-lotteryModal1', {
                img:'../../res/image/no_chance.png',
                btn1:`免费机会已用完(${this.props.watchAdAward}/${10})`,// 按钮1 
                btn2:'知道了',// 按钮2
                isColor:true
            },(num) => {
                this.paint();
            });
        }
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
        const stShow = getModulConfig('KT_SHOW');
        switch (tipIndex) {
            case 0:
                this.props.showTip = { zh_Hans:`免费次数: ${this.props.freeCount}`,zh_Hant:`免費次數: ${this.props.freeCount}`,en:'' };
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
                if (this.props.selectChest.type === ActivityType.PrimaryChest) {
                    this.setChestTip(0);
                } else {
                    this.props.showTip = { zh_Hans: `售价: ${this.props.selectChest.needTicketNum}${stShow}/个`, zh_Hant: `售價: ${this.props.selectChest.needTicketNum}${stShow}/個`, en: '' };
                }
                this.paint();
                break;

            default:
        }
    }

    /**
     * 开奖
     * @param order 中奖信息
     */
    public goLottery(e:any,boxIndex:number,order:any) {
        if (order.awardType !== 9527) {
            console.log('开出什么东西了！！！！！！！',order);
            popModalBoxs('earn-client-app-components-lotteryModal-lotteryModal', order);
            getKTbalance();  // 更新余额
            this.endOpenChest(e,boxIndex,BoxState.prizeBox);
        } else {
            this.endOpenChest(e,boxIndex,BoxState.emptyBox);
        }
    }

    /**
     * 结束开宝箱
     */
    public endOpenChest(e: any,boxIndex:number,boxState:number) {
        const $chest = getRealNode(e.node);
        $chest.style.animation = 'none';
        this.props.isOpening = false;
        this.props.boxList[boxIndex] = boxState;
        switch (boxState) {
            case BoxState.emptyBox:
                this.setChestTip(1);
                break;
            case BoxState.prizeBox:
                this.setChestTip(2);
                break;
            case BoxState.unOpenBox:
                this.setChestTip(2);
                // popNew('app-components1-message-message', { content: this.config.value.tips[2] });
                break;
            default:
        }
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
     * led定时器
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
            case 1:          // 看广告
                wathcAdGetAward(4,(award) => {
                    this.props.freeCount = award.freeBox;
                    this.props.watchAdAward = award.adAwardBox;
                    popNewMessage(this.config.value.chestTips[2]);
                    this.setChestTip(2);
                }); 
                break;
            case 2:          // 更换宝箱类型
                this.change(eventValue);
                break;
            
            default:
        }
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

register('balance/KT', (r: any) => {
    forelet.paint({ KTbalance:r });
});