/**
 * 大转盘 - 首页
 */

import { watchAd } from '../../../../../app/logic/native';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { addST, getSTbalance, isFirstFree, openTurntable } from '../../net/rpc';
import { getStore, register } from '../../store/memstore';
import { getPrizeList, getTicketNum, isLogin } from '../../utils/util';
import { ActivityType } from '../../xls/dataEnum.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    selectTurntable: any;
    prizeList: any;    // 奖品列表
    turnNum: number;   // 旋转角度
    isTurn: boolean;   // 正在转
    STbalance:number;  // 账户余额(st)
    turntableList: any;   // 转盘列表
    showTip:any; // 转盘显示提醒
    isFirstPlay: boolean; // 每日第一次免费
}
export class Turntable extends Widget {
    public ok: () => void;

    public props: Props = {
        selectTurntable: {},
        turnNum: 0,
        isTurn: false,
        STbalance:0,
        prizeList: [],
        turntableList: [
            {
                type: ActivityType.PrimaryTurntable,
                name: { zh_Hans: '银券', zh_Hant: '銀券', en: '' },
                needTicketNum: getTicketNum(ActivityType.PrimaryTurntable),
                turntableName: { zh_Hans: '初级转盘', zh_Hant: '初級轉盤', en: '' }
            },
            {
                type:  ActivityType.MiddleTurntable,
                name: { zh_Hans: '金券', zh_Hant: '金券', en: '' },
                needTicketNum: getTicketNum(ActivityType.MiddleTurntable),
                turntableName: { zh_Hans: '中级转盘', zh_Hant: '中級轉盤', en: '' }
            },
            {
                type: ActivityType.AdvancedTurntable,
                name: { zh_Hans: '彩券', zh_Hant: '彩券', en: '' },
                needTicketNum: getTicketNum(ActivityType.AdvancedTurntable),
                turntableName: { zh_Hans: '高级转盘', zh_Hant: '高級轉盤', en: '' }
            }
        ],
        showTip:{ zh_Hans:'',zh_Hant:'',en:'' },
        isFirstPlay:true
    };

    public create() {
        super.create();
        if (isLogin()) {
            this.change(0);
            this.initTurntable();
            this.initData();
        }
        // inviteUsersToGroup();
    }

    public attach() {
        if (!isLogin()) {
            this.backPrePage();
        }
    }

    /**
     * 初始转盘
     */
    public initTurntable() {
        // 奖品配置  
        const prizeList = getPrizeList(this.props.selectTurntable.type);
        this.props.prizeList = [];
        
        for (let i = 0, length = prizeList.length; i < length; i++) {
            const prizeItem = {
                awardType: prizeList[i],
                deg: (-360 / length) * i
            };
            this.props.prizeList.push(prizeItem);
        }
        
        this.paint();
    }

    /**
     * 初始数据
     */
    public initData() {
        this.props.STbalance = getStore('balance/ST');
        isFirstFree().then((res:any) => {
            this.props.isFirstPlay = res.freeRotary;
            this.setChestTip(2);
        });
        this.paint();
    }

    /**
     * 开奖
     */
    public goLottery(e:any) {
        if (this.props.isTurn) {// 正在转

            return;
        }
        const $turnTableBtn = getRealNode(e.node);
        $turnTableBtn.className = 'startTurnTable';
        setTimeout(() => {
            $turnTableBtn.className = '';
        }, 100);
        if (this.props.STbalance < this.props.selectTurntable.needTicketNum); {    // 余票不足
            if (!((this.props.selectTurntable.type === ActivityType.PrimaryTurntable) && this.props.isFirstPlay)) {
                popNew('app-components1-message-message',{ content:this.config.value.tips[0] });

                return;

            }
        }
        this.props.isFirstPlay = false;
        this.setChestTip(2);

        this.startLottery();

        openTurntable(this.props.selectTurntable.type).then((res) => {
            this.changeDeg(res);
        }).catch((err) => {
            this.changeDeg(err);
        });

    }

    /**
     * 转盘开奖动画
     */
    // public goLotteryAnimation(isTurn:boolean,resData?: any) {
    //     const $turnStyle = document.getElementById('turntable').style;
    //     this.props.isTurn = isTurn;
    //     this.paint();

    //     if (!isTurn) {          // 停止转动
    //         $turnStyle.transition = 'none';
    //         $turnStyle.transform = `rotate(${this.props.turnNum}deg)`;

    //         return;
    //     }
    //     if (!resData) {         // 不传resData,开始转动
    //         $turnStyle.transition = 'transform 2s linear';
    //         $turnStyle.transform = `rotate(720deg)`;

    //         return;
    //     } else {                // 传入resData,确认结束转动旋转角度
    //         if (resData.resultNum === 1) { // 抽奖接口成功，修改旋转角度
    //             this.props.prizeList.forEach(element => {
    //                 if (element.awardType === resData.award.awardType) {
    //                     this.props.turnNum = element.deg;
                        
    //                 }
    //             });
    //         } else {                      // 抽奖接口失败，修改旋转角度
    //             this.props.prizeList.forEach(element => {
    //                 if (element.awardType === 1001) {
    //                     this.props.turnNum = element.deg;
    
    //                 }
    //             });
    //         }
    //         $turnStyle.transition = 'transform 6s ease-out';
    //         $turnStyle.transform = `rotate(${this.props.turnNum + 720}deg)`;
            
    //         setTimeout(() => {
    //             this.goLotteryAnimation(false);
    //             if (resData.resultNum === 1 && resData.award.awardType !== 9527) {
    //                 popNew('earn-client-app-view-components-lotteryModal', resData.award);
    //             }
    //             this.paint();
    //         }, 4000);
    //     }
        
    // }

    /**
     * 开始开奖
     */
    public startLottery() {
        const $turnStyle = document.getElementById('turntable').style;
        this.props.isTurn = true;
        $turnStyle.transition = 'transform 2s linear';
        $turnStyle.transform = 'rotate(720deg)';
    }

    /**
     * 修改转动角度
     */
    public changeDeg(resData:any) {
        console.log('changeDeg------------------',resData);
        
        const $turnStyle = document.getElementById('turntable').style;
        if (resData.resultNum && resData.resultNum === 1) {   // 请求成功
            this.props.prizeList.forEach(element => {
                if (element.awardType === resData.award.awardType) {
                    this.props.turnNum = element.deg;
                    if (resData.award.awardType === 5001) {
                        console.log(this.props.turnNum);
                        
                    }
                }
            });
        } else { // 请求失败
            this.props.prizeList.forEach(element => {
                if (element.awardType === 9527) {
                    this.props.turnNum = element.deg;   
                }
            });
        }
        $turnStyle.transition = 'transform 4s ease-out';
        $turnStyle.transform = `rotate(${this.props.turnNum + 1440}deg)`;

        setTimeout(() => {
            this.endLottery();
            if (resData.resultNum === 1 && resData.award.awardType !== 9527) {
                popNew('earn-client-app-components-lotteryModal-lotteryModal', resData.award);
            }
            this.paint();
        }, 4000);
    }

    /**
     * 结束开奖
     */
    public endLottery() {
        const $turnStyle = document.getElementById('turntable').style;
        this.props.isTurn = false;
        $turnStyle.transition = 'none';
        $turnStyle.transform = `rotate(${this.props.turnNum}deg)`;
    }

    /**
     * 去充值
     */
    public goRecharge() {
        // addST();
        popNew('app-view-wallet-cloudWallet-rechargeKT',null,() => {
            this.refresh();
        });
    }

    /**
     * 更改宝箱类型
     * @param index 序号
     */
    public change(index: number) {
        if (this.props.isTurn) {

            return;
        }
        this.props.selectTurntable = this.props.turntableList[index];
        this.setChestTip(2);
        this.initTurntable();
        this.paint();
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
        switch (eventType) { // 看广告
            case 0:
                this.toWatchAd();
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
     * 设置转盘提示
     * @param tipIndex 提示序号 0:免费,1:空,2:售价
     */
    public setChestTip(tipIndex:number = 1) {
        const turntableTips = this.config.value.turntableTips;
        
        switch (tipIndex) {
            case 0:
                this.props.showTip = turntableTips[0];
                this.paint();
                break;
            case 1:
                this.props.showTip = turntableTips[1];
                this.paint();
                setTimeout(() => {
                    this.setChestTip(2);
                    this.paint();
                }, 2000);
                break;
            case 2:
                if (this.props.isFirstPlay && this.props.selectTurntable.type === ActivityType.PrimaryTurntable) {
                    this.setChestTip(0);
                } else {
                    this.props.showTip = { zh_Hans:`售价：${this.props.selectTurntable.needTicketNum}ST/1个`,zh_Hant:`售價：${this.props.selectTurntable.needTicketNum}ST/1個`,en:'' };
                }
                this.paint();
                break;

            default:
        }  
    }
    
    /**
     * 去看广告
     */
    public toWatchAd() {
        watchAd(1,(err,res) => {
            console.log('ad err = ',err);
            console.log('ad res = ',res);
        });
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

register('userInfo/uid',(r:any) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});

register('balance/ST',(r:any) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});