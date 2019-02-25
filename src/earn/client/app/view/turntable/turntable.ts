/**
 * 大转盘 - 首页
 */

import { queryNoPWD } from '../../../../../app/api/JSAPI';
import { getModulConfig } from '../../../../../app/modulConfig';
import { walletSetNoPSW } from '../../../../../app/utils/pay';
import * as chatStore from '../../../../../chat/client/app/data/store';
import { inviteUsersToGroup } from '../../../../../chat/client/app/net/rpc';
import { TURNTABLE_GROUP } from '../../../../../chat/server/data/constant';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { FreePlay } from '../../../../server/data/db/item.s';
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
    freeCount: number; // 免费次数
    LEDTimer:any; // LED计时器
    ledShow:boolean; // LED灯
    watchAdAward:number; // 看广告已经获得的免费次数
    showMoreSetting: boolean; // 展开设置免密支付
    noPassword: boolean; // 免密支付是否打开
}
export class Turntable extends Widget {
    public ok: () => void;

    public props: Props = {
        selectTurntable: {},
        turnNum: 0,
        isTurn: false,
        STbalance:20,
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
        freeCount:0,
        LEDTimer:{},
        ledShow:false,
        watchAdAward:0,
        showMoreSetting: false,
        noPassword: false
    };

    public create() {
        super.create();
        if (isLogin()) {
            this.change(0);
            this.initTurntable();
            this.initData();
            this.ledTimer();
        }
        queryNoPWD('101', (res, msg) => {
            if (!res) {
                this.props.noPassword = true;
            } else {
                this.props.noPassword = false;
            }
        });
        
    }

    public attach() {
        if (!isLogin()) {
            this.backPrePage();
        }
    }
    
    /**
     * 更多设置
     */
    public showSetting() {
        this.props.showMoreSetting = !this.props.showMoreSetting;
        this.paint();
        
    }
    /**
     * 设置免密支付
     */
    public async setting() {
        let state = 0;
        if (this.props.noPassword === false) {
            state = 1;
        } 

        walletSetNoPSW('101', '15', state, (res, msg) => {
            console.log(res, msg);
            if (!res) {
                this.props.noPassword = !this.props.noPassword; 
                popNew('app-components1-message-message',{ content:this.config.value.tips[0] });
                this.paint();
            } else {
                popNew('app-components1-message-message',{ content:this.config.value.tips[1] });
            }

        });
        this.closeSetting();
    }
    
    /**
     * 关闭设置
     */
    public closeSetting() {
        this.props.showMoreSetting = false;
        this.paint();
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
        isFirstFree().then((res:FreePlay) => {
            this.props.freeCount = res.freeRotary;
            this.props.watchAdAward = res.adAwardRotary;
            this.setChestTip(2);
            if (this.props.STbalance < this.props.selectTurntable.needTicketNum && this.props.freeCount <= 0) {
                this.popNextTips();
            }
        });
        this.paint();
    }

    /**
     * 开奖
     */
    public goLottery() {
        if (this.props.STbalance < this.props.selectTurntable.needTicketNum) {    // 余额不足
            if (this.props.selectTurntable.type === ActivityType.PrimaryTurntable && this.props.freeCount <= 0) { // 没有免费次数
                // popNew('app-components1-message-message',{ content:this.config.value.tips[0] });
                this.popNextTips();

                return;

            }
        }

        this.props.isTurn = true;
        openTurntable(this.props.selectTurntable.type).then((order:any) => {
            if (order.oid) { // 非免费机会开奖
                queryTurntableOrder(order.oid).then((res:any) => {
                    console.log('转盘开奖成功！',res);
                    popNew('app-components1-message-message',{ content:this.config.value.tips[1] });
                    this.props.freeCount = 0;
                    this.setChestTip(2);
                    this.changeDeg(res);
                }).catch(err => {

                    console.log('查询转盘订单失败',err);
                });
                getSTbalance();  // 更新余额

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
            popNew('earn-client-app-components-lotteryModal-lotteryModal1', {
                img:'../../res/image/no_money.png',
                btn1:`更多免费机会(${this.props.watchAdAward}/${10})`,// 按钮1 
                btn2:'去充值'// 按钮2
            },(num) => {
                if (num === 1) {
                    wathcAdGetAward(3,(award) => {
                        this.props.freeCount = award.freeRotary;
                        this.props.watchAdAward = award.adAwardRotary;
                        this.setChestTip(2);
                    });
                } else {
                    popNew('app-view-wallet-cloudWallet-rechargeKT');
                }
            });
        } else {
            const chatUid = chatStore.getStore('uid');
            const group = chatStore.getStore(`contactMap/${chatUid}`,{ group:[] }).group; // 聊天加入群组
            if (group.indexOf(TURNTABLE_GROUP) > -1) {
                popNew('earn-client-app-components-lotteryModal-lotteryModal1', {
                    img:'../../res/image/no_money.png',
                    btn1:'去聊天',// 按钮1 
                    btn2:'去充值'// 按钮2
                },(num) => {
                    if (num === 1) {
                        // TODO 去聊天
                        console.log('大转盘去聊天');
                    } else {
                        popNew('app-view-wallet-cloudWallet-rechargeKT');
                    }
                });
            } else {
                popNew('earn-client-app-components-lotteryModal-lotteryModal1', {
                    img:'../../res/image/no_money.png',
                    btn1:'加入游戏聊天群组',// 按钮1 
                    btn2:'去充值'// 按钮2
                },(num) => {
                    if (num === 1) {
                        inviteUsersToGroup(TURNTABLE_GROUP,[chatUid],(r) => {
                            console.log('加群回调TURNTABLE_GROUP---------------',r);
                        });
                    } else {
                        popNew('app-view-wallet-cloudWallet-rechargeKT');
                    }
                });
            }
        }
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
                wathcAdGetAward(3,(award) => {
                    this.props.freeCount = award.freeRotary;
                    this.props.watchAdAward = award.adAwardRotary;
                    this.setChestTip(2);
                });
                break;
            case 1:          // 充值
                popNew('app-view-wallet-cloudWallet-rechargeKT',null,() => {
                    this.refresh();
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
        const stShow = getModulConfig('ST_SHOW');
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
                if (this.props.freeCount > 0 && this.props.selectTurntable.type === ActivityType.PrimaryTurntable) {
                    this.setChestTip(0);
                } else {
                    this.props.showTip = { zh_Hans:`售价: ${this.props.selectTurntable.needTicketNum}${stShow}/个`,zh_Hant:`售價: ${this.props.selectTurntable.needTicketNum}${stShow}/個`,en:'' };
                }
                this.paint();
                break;

            default:
        }  
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