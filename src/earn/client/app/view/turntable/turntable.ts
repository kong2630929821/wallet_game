/**
 * 大转盘 - 首页
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { getStore as getChatStore } from '../../../../../chat/client/app/data/store';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { getSTbalance, isFirstFree, openTurntable, queryTurntableOrder } from '../../net/rpc';
import { getStore, register, setStore } from '../../store/memstore';
import { wathcAdGetAward } from '../../utils/tools';
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
    LEDTimer:any; // LED计时器
    ledShow:boolean; // LED灯
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
        isFirstPlay:true,
        LEDTimer:{},
        ledShow:false
    };

    public create() {
        super.create();
        if (isLogin()) {
            this.change(0);
            this.initTurntable();
            this.initData();
            this.ledTimer();
        }
        console.log('聊天uid',[getChatStore('uid')]);
        
        // inviteUsersToGroup(10001,[getChatStore('uid')],(r) => {
        //     console.log('加群回调---------------',r);
            
        // });
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
        console.log(this.props.STbalance);
        isFirstFree().then((res:any) => {
            this.props.isFirstPlay = res.freeRotary;
            this.setChestTip(2);
        });
        this.paint();
    }

    /**
     * 开奖
     */
    public goLottery() {
        if (this.props.STbalance < this.props.selectTurntable.needTicketNum) {    // 余票不足
            if (!((this.props.selectTurntable.type === ActivityType.PrimaryTurntable) && this.props.isFirstPlay)) {
                popNew('app-components1-message-message',{ content:this.config.value.tips[0] });

                return;

            }
        }

        this.props.isTurn = true;
        openTurntable(this.props.selectTurntable.type).then((order:any) => {
            if (order.oid) { // 非免费机会开奖
                queryTurntableOrder(order.oid).then((res:any) => {
                    console.log('转盘开奖成功！',res);
                    popNew('app-components1-message-message',{ content:this.config.value.tips[1] });
                    this.props.isFirstPlay = false;
                    this.setChestTip(2);
                    this.changeDeg(res);
                }).catch(err => {

                    console.log('查询转盘订单失败',err);
                });
            } else {         // 免费机会开奖
                this.props.isFirstPlay = false;
                this.setChestTip(2);
                this.changeDeg(order);
            }
            
        }).catch((err) => {
            // this.changeDeg(err);
            console.log('转盘下单失败',err);
            this.props.isTurn = false;
        });

    }

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
        this.props.isTurn = true;
        const $turnStyle = document.getElementById('turntable').style;
        // if (resData.resultNum && resData.resultNum === 1) {   // 请求成功
        //     this.props.prizeList.forEach(element => {
        //         if (element.awardType === resData.award.awardType) {
        //             this.props.turnNum = element.deg;
        //             if (resData.award.awardType === 5001) {
        //                 console.log(this.props.turnNum);
                        
        //             }
        //         }
        //     });
        // } else { // 请求失败
        //     this.props.prizeList.forEach(element => {
        //         if (element.awardType === 9527) {
        //             this.props.turnNum = element.deg;   
        //         }
        //     });
        // }
        this.props.prizeList.forEach(element => {
            if (element.awardType === resData.awardType) {
                this.props.turnNum = element.deg;
            }
        });

        $turnStyle.transition = 'transform 7s ease-in-out';
        $turnStyle.transform = `rotate(${this.props.turnNum + 2880}deg)`;

        setTimeout(() => {
            this.endLottery();
            if (resData.awardType !== 9527) {
                popNew('earn-client-app-components-lotteryModal-lotteryModal', resData);
            }
            this.paint();
        }, 7000);
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
        popNew('app-view-wallet-cloudWallet-rechargeKT',null,() => {
            this.refresh();
        });
    }

    /**
     * 更改宝箱类型
     * @param index 序号
     */
    public change(index: number) {
        this.props.selectTurntable = this.props.turntableList[index];
        this.setChestTip(2);
        this.initTurntable();
        this.paint();
    }

    /**
     * 点击效果
     */
    public btnClick(e: any , eventType: number, eventValue?:any) {
        if (this.props.isTurn) {

            return;
        }
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
            case 3:          // 开奖
                this.goLottery();
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
        const stShow = getModulConfig('ST_SHOW');
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
                    this.props.showTip = { zh_Hans:`售价：${this.props.selectTurntable.needTicketNum}${stShow}/1个`,zh_Hant:`售價：${this.props.selectTurntable.needTicketNum}${stShow}/1個`,en:'' };
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
        wathcAdGetAward();
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
     * led定时器
     */
    public ledTimer() {

        this.props.LEDTimer = setInterval(() => {
            this.props.ledShow = !this.props.ledShow;
            this.paint();
        }, 1000);
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

register('userInfo/uid',(r:any) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});

register('balance/ST',(r:any) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});