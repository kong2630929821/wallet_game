/**
 * 大转盘 - 首页
 */

import { CloudCurrencyType } from '../../../../../app/publicLib/interface';
import { getModulConfig } from '../../../../../app/publicLib/modulConfig';
import { popNewMessage } from '../../../../../app/utils/tools';
import { getCloudBalances, registerStoreData } from '../../../../../app/viewLogic/common';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { FreePlay } from '../../../../server/data/db/item.s';
import { getKTbalance } from '../../net/rpc';
import { isFirstFree, openTurntable } from '../../net/rpc_order';
import { Mine, register, setStore } from '../../store/memstore';
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
    turntableList: any;   // 转盘列表
    showTip:any; // 转盘显示提醒
    freeCount: number; // 免费次数
    LEDTimer:any; // LED计时器
    ledShow:boolean; // LED灯
    watchAdAward:number; // 看广告已经获得的免费次数
    moneyName:string; // 消费的金钱种类
}
// tslint:disable-next-line:completed-docs
export class Turntable extends Widget {
    public ok: () => void;

    public props: Props = {
        selectTurntable: {},
        turnNum: 0,
        isTurn: false,
        prizeList: [],
        turntableList: [
            {
                type: ActivityType.PrimaryTurntable,
                needTicketNum: getTicketNum(ActivityType.PrimaryTurntable),
                turntableName: { zh_Hans: '初级转盘', zh_Hant: '初級轉盤', en: '' }
            },
            {
                type:  ActivityType.MiddleTurntable,
                needTicketNum: getTicketNum(ActivityType.MiddleTurntable),
                turntableName: { zh_Hans: '中级转盘', zh_Hant: '中級轉盤', en: '' }
            },
            {
                type: ActivityType.AdvancedTurntable,
                needTicketNum: getTicketNum(ActivityType.AdvancedTurntable),
                turntableName: { zh_Hans: '高级转盘', zh_Hant: '高級轉盤', en: '' }
            }
        ],
        showTip:{ zh_Hans:'',zh_Hant:'',en:'' },
        freeCount:0,
        LEDTimer:{},
        ledShow:false,
        watchAdAward:0,
        moneyName:''
    };
    public create() {
        super.create();
        this.state = STATE;
        if (isLogin()) {
            this.change(0);
            this.initTurntable();
            this.ledTimer();
            this.props.moneyName = getModulConfig('KT_SHOW');
            console.log('我的余额是：--------------------------------',this.state.KTbalance);
            isFirstFree().then((res:FreePlay) => {
                this.props.freeCount = res.freeRotary;
                this.props.watchAdAward = res.adAwardRotary;
                this.setChestTip(2);

            });    
        }
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
                awardType: prizeList[i].prop,
                num:prizeList[i].num,
                deg: (-360 / length) * i
            };
            this.props.prizeList.push(prizeItem);
        }
    }

    /**
     * 开奖
     */
    public goLottery() {
        if (this.props.isTurn) return;
        if (this.props.selectTurntable.type === ActivityType.PrimaryTurntable) {
            if (this.props.freeCount <= 0) { // 没有免费次数
                this.popNextTips();

                return;
            }
        } else if (this.state.KTbalance < this.props.selectTurntable.needTicketNum) {
            popNewMessage({ zh_Hans: '余额不足', zh_Hant: '餘額不足', en: '' });

            return;
        }
        this.props.isTurn = true;
        // this.startLottery();
        openTurntable(this.props.selectTurntable.type).then((order:any) => {
            console.log('11111111111',order);
            if (this.props.selectTurntable.type !== ActivityType.PrimaryTurntable) { // 非免费机会开奖
                console.log('转盘开奖成功！',1);
                this.props.freeCount = 0;
                this.setChestTip(2);
                this.changeDeg(order);
                this.paint();    
            } else {         // 免费机会开奖
                this.props.freeCount--;
                this.setChestTip(2);
                this.changeDeg(order);
                setStore('flags/firstTurntable',true);
            }
            
        }).catch((err) => {
            // this.changeDeg(err);
            console.log('转盘下单失败',err);
            this.props.isTurn = false;
        });

    }

    /**
     * 弹窗提示看广告或聊天
     */
    public popNextTips() {
        if (this.props.isTurn) return;

        if (this.props.watchAdAward < 10) {
            popModalBoxs('earn-client-app-components-lotteryModal-lotteryModal1', {
                img:'../../res/image/no_free.png',
                btn1:`更多免费机会(${this.props.watchAdAward}/${10})`,// 按钮1 
                btn2:'知道了'// 按钮2
            },(num) => {
                if (num === 1) {
                    wathcAdGetAward(3,(award) => {
                        this.props.freeCount = award.freeRotary;
                        this.props.watchAdAward = award.adAwardRotary;
                        this.setChestTip(2);
                    });
                } else {
                    this.paint();
                }
            });
        } else if (this.props.selectTurntable.type === ActivityType.PrimaryTurntable) {
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
     * 开始开奖
     */
    public startLottery() {
        const $turnStyle = document.getElementById('turntable').style;
        this.props.isTurn = true;
        $turnStyle.transition = 'transform 2s ease-in';
        $turnStyle.transform = 'rotate(180deg)';
        popNew('app-components1-message-message',{ content:this.config.value.tips[1] });
    }

    /**
     * 修改转动角度
     */
    public changeDeg(resData:any) {
        console.log('changeDeg------------------',resData);
        this.props.isTurn = true;
        const $turnStyle = document.getElementById('turntable').style;
        this.props.prizeList.forEach(element => {
            if (element.awardType === resData.awardType && element.num === resData.count) {
                this.props.turnNum = element.deg;
            }
        });

        $turnStyle.transition = 'transform 3.5s ease-in-out';
        $turnStyle.transform = `rotate(${this.props.turnNum + 1440}deg)`;

        setTimeout(() => {
            this.endLottery();
            if (resData.awardType !== 9527) {
                popNew('earn-client-app-components-lotteryModal-lotteryModal', resData);
            }
            this.paint();
        }, 3500);
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
                if (this.props.watchAdAward < 10) {
                    wathcAdGetAward(3,(award) => {
                        this.props.freeCount = award.freeRotary;
                        this.props.watchAdAward = award.adAwardRotary;
                        popNewMessage(this.config.value.turntableTips[2]);
                        this.setChestTip(2);
                    });
                } else {
                    popModalBoxs('earn-client-app-components-lotteryModal-lotteryModal1', {
                        img:'../../res/image/no_chance.png',
                        btn1:`免费机会已用完(${this.props.watchAdAward}/${10})`,// 按钮1 
                        btn2:'知道了',// 按钮2
                        isColor:true
                    },(num) => {
                        this.paint();
                    });
                }
                break;
            case 1:          // 充值
                popNew('app-view-wallet-cloudWallet-rechargeKT',null,() => {
                    getKTbalance();   // 更新余额
                });
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
        const stShow = getModulConfig('KT_SHOW');
        switch (tipIndex) {
            case 0:
                this.props.showTip = { zh_Hans:`免费次数: ${this.props.freeCount}`,zh_Hant:`免費次數: ${this.props.freeCount}`,en:'' };
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
                if (this.props.selectTurntable.type === ActivityType.PrimaryTurntable) {
                    this.setChestTip(0);
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.props.showTip = { zh_Hans:`售价: ${this.props.selectTurntable.needTicketNum}${stShow}/个`,zh_Hant:`售價: ${this.props.selectTurntable.needTicketNum}${stShow}/個`,en:'' };
                }
                this.paint();
                break;

            default:
        }  
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
const STATE = {
    KTbalance:0
};

/**
 * 云端余额变化
 */
registerStoreData('cloud/cloudWallets',() => {
    getCloudBalances().then(cloudBalances => {
        const KTbalance = cloudBalances.get(CloudCurrencyType.KT) || 0; 
        if (KTbalance < STATE.KTbalance) {   // 余额减少表示使用中级或者高级挖矿  余额变化立即显示
            STATE.KTbalance = KTbalance;
            forelet.paint(STATE);
        } else {
            setTimeout(() => {  // 余额增加  挖矿挖到嗨豆  余额变化延迟到动画完成显示
                STATE.KTbalance = KTbalance;
                forelet.paint(STATE);
            },3500);
        }
        
    });
});