/**
 * earn home 
 */
// ================================ 导入
import { OfflienType } from '../../../../../app/components1/offlineTip/offlineTip';
import { getModulConfig } from '../../../../../app/public/config';
import { CloudCurrencyType } from '../../../../../app/public/interface';
import { getCloudBalances, register as walletRegister } from '../../../../../app/store/memstore';
import { piRequire } from '../../../../../app/utils/commonjsTools';
import { rippleShow, throttle } from '../../../../../app/utils/pureUtils';
import { gotoChat } from '../../../../../app/view/base/app';
import { loadExchaneSource, loadMiningSource ,loadOpenBoxSource, loadRedEnvelopeSource, loadSettingSource, loadShareSource, loadTurntableSource } from '../../../../../app/view/base/sourceLoaded';
import * as chatStore from '../../../../../chat/client/app/data/store';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Result } from '../../../../server/data/db/guessing.s';
import { bind_accID } from '../../../../server/rpc/user.p';
import { get_task_award, task_query } from '../../../../server/rpc/user_item.p';
import { clientRpcFunc } from '../../net/init';
import { getStore, Mine, register, setStore } from '../../store/memstore';
import { getSeriesLoginAwards } from '../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

/**
 * 获取用户已完成的任务
 */
export const getCompleteTask = ():Promise<any> => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(task_query,null,(res:Result) => {
            console.log('[活动]rpc-getCompleteTask---------------', res);
            if (res && res.reslutCode === 1) {
                const data = JSON.parse(res.msg);
                resolve(data);
            } else {
                reject(res);
            }
        });
    });
};

// tslint:disable-next-line:completed-docs
export class EarnHome extends Widget {
    public ok: () => void;
    public language: any;
    public props: any;
    public config: any;
    public $earnHome:any;
    public scrollCb:Function;
    
    public create() {
        super.create();
        this.init();
        this.state = STATE;
    }
    
    public setProps(props: any, oldProps: any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props, oldProps);
        const item0 = this.props.noviceTask[0];
        if (item0) {
            item0.complete =  !!this.props.userInfo.phoneNumber;
        }
    }

    /**
     * 初始化数据
     */
    public init() {
        console.log('hom1 init called');
        const ktShow = getModulConfig('KT_SHOW');
        const isLogin = getStore('userInfo/uid', 0) > 0;
        this.props = {
            ...this.props,
            offlienType:OfflienType.EARN,
            ktShow,
            scrollHeight: 0,            
            refresh: false,
            // 热门活动
            hoeSelected:-1,
            upAnimate:'',
            downAnimate:'',
            animateStart:false,
            isLogin,  // 活动是否登录成功
            animationed:true, // 动画完成
            noviceTask:[]
        };
        this.initHotActivities();
        if (isLogin) {
            this.initPropsNoviceTask();
        }
        const cloudBalances = getCloudBalances();
        STATE.miningKTnum = cloudBalances.get(CloudCurrencyType.KT) || 0;
        forelet.paint(STATE);
    }

    public initHotActivities() {
        this.props.hotActivities =  [{
            img: '../../res/image/task/mining.png',
            title: '极限挖矿',
            desc: `新版本整装待发`,
            components:'earn-client-app-view-activity-miningHome'
        },{
            img: '../../res/image/task/invitationCode.png',
            title: '兑换码',
            desc: '兑换礼物和红包',
            components:'app-view-earn-exchange-exchange'
        },{
            img: '../../res/image/task/sedRed.png',
            title: '发红包',
            desc: '试试朋友的手气',
            components:'app-view-earn-redEnvelope-writeRedEnv'
        },{
            img: '../../res/image/task/invitation.png',
            title: '邀请好友',
            desc: '累计邀请有好礼',
            components:'earn-client-app-view-activity-inviteFriend'
        }];
    }
    /**
     * 初始化任务列表
     */
    public initPropsNoviceTask(wallet?:any) {
        Promise.all([getCompleteTask()]).then(([data]) => {
            const flags:any = {};
            for (const v of data.taskList) {
                if (v.state) {
                    if (v.id === 2) {
                        flags.helpWord = true;
                    } else if (v.id === 3) {
                        flags.sharePart = true;
                    } else if (v.id === 4) {
                        flags.firstChat = true;
                    } else if (v.id === 5) {
                        flags.firstTurntable = true;
                    } else if (v.id === 6) {
                        flags.firstOpenBox = true;
                    } else if (v.id === 7) {
                        flags.firstRecharge = true;
                    }
                }
            }

            this.props.noviceTask = [
                {
                    img: '',
                    title: '绑定手机号',
                    desc: '凭借手机验证可找回云端资产',
                    btn:'做任务',
                    addOne:false,
                    components:'app-view-mine-setting-phone',
                    complete: !!this.props.userInfo.phoneNumber,
                    show:true
                },{
                    img: '2003.png',
                    title: '首次充值成功',
                    desc: '充值玩更多游戏',
                    btn:'做任务',
                    addOne:true,
                    components:'goRecharge',
                    complete: !!flags.firstRecharge,
                    show:true
                },{
                    img: '2001.png',
                    title: '参与聊天',
                    desc: '和大家聊一聊最近的热点',
                    btn:'做任务',
                    addOne:true,                
                    components:'goChat',
                    complete:!!flags.firstChat,
                    show:true
                },{
                    img: 'task_gift.png',
                    title: '玩一把大转盘',
                    desc: '每天赠送初级大转盘一次抽奖机会',
                    btn:'做任务',
                    addOne:false,
                    components:'earn-client-app-view-turntable-turntable',
                    complete: !!flags.firstTurntable,
                    show:true
                },{
                    img: 'task_gift.png',
                    title: '开个初级宝箱',
                    desc: '每天免费开初级宝箱一次',
                    btn:'做任务',
                    addOne:false,                
                    components:'earn-client-app-view-openBox-openBox',
                    complete: !!flags.firstOpenBox,
                    show:true
                }];
            this.paint();
        });
    }

    /**
     * 热门活动进入
     */
    public goHotActivity(ind: number) {
        const loading = popNew('app-components1-loading-loading1');
        switch (ind) {
            case 0:
                loadMiningSource().then(() => {
                    popNew('earn-client-app-view-mining-miningHome');
                    loading.callback(loading.widget);
                });
                break;
            case 1:
                loadRedEnvelopeSource().then(() => {
                    popNew('app-view-redEnvelope-exchange');
                    loading.callback(loading.widget);
                });
                break;
            case 2:
                loadRedEnvelopeSource().then(() => {
                    popNew('app-view-redEnvelope-writeRedEnv');
                    loading.callback(loading.widget);
                });
                break;
            case 3:
                loadShareSource().then(() => {
                    popNew('earn-client-app-view-share-inviteFriend');
                    loading.callback(loading.widget);
                });
                break;
            default:
        }
        
    }

    /**
     * 新手任务
     */
    public async goNoviceTask(e:any,ind:number) {
        console.log('on-tap');
        const page = this.props.noviceTask[ind].components;
        if (page === 'goRecharge') {  // 去充值
           
        } else if (page === 'goChat') { // 去聊天
            gotoChat();
        } else {
            const loading = popNew('app-components1-loading-loading1');
            switch (ind) {
                case 0:
                    // 绑定手机号码
                    loadSettingSource().then(() => {
                        popNew('app-view-setting-phone');
                        loading.callback(loading.widget);
                    });
                    break;
                case 1:
                    // 充值
                    piRequire(['app/utils/recharge']).then(mods => {
                        mods[0].goRecharge();
                    });
                    break;
                case 2:
                    // 去聊天
                    gotoChat();
                    break;
                case 3:
                    // 大转盘
                    loadTurntableSource().then(() => {
                        popNew('earn-client-app-view-turntable-turntable');
                        loading.callback(loading.widget);
                    });
                    break;
                case 4:
                    // 开宝箱
                    loadOpenBoxSource().then(() => {
                        popNew('earn-client-app-view-openBox-openBox');
                        loading.callback(loading.widget);
                    });
                    break;
                default:
            }            
        }
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.props.refresh = true;
        this.paint();
        setTimeout(() => {
            this.props.refresh = false;
            this.paint();
        }, 1000);

    }

    /**
     * 获取挖矿排名信息
     */
    public updateMiningInfo(mine:Mine) {
        this.props.miningRank = mine.miningRank;
        this.props.miningKTnum = mine.miningKTnum;
        this.props.miningMedalId = mine.miningMedalId;
        this.paint();
    }

    public goMineRank() {
        popNew('earn-client-app-view-mineRank-mineRank');
    }
    
    /**
     * 屏幕滑动
     */
    public scrollPage() {
        if (!this.scrollCb) {
            this.scrollCb = throttle(() => {
                
                if (!this.$earnHome) {
                    this.$earnHome = document.getElementById('earn-home');
                }
                const scrollTop = this.$earnHome.scrollTop;
                this.props.scrollHeight = scrollTop;
                console.log('scroll page------------------',scrollTop);
            });
        }
        this.scrollCb();
    }

    // 动画效果执行
    public onShow(e:any) {
        console.log('on-down');
        rippleShow(e);
    }
}

// ===================================================== 本地
// ===================================================== 立即执行
register('userInfo/isLogin',(isLogin:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (isLogin && w) {
        w.props.isLogin = true;
        w.initPropsNoviceTask();
        w.paint();
    }
});

register('flags/logout',() => {  // 退出钱包时刷新页面
    console.log('home1 -----flags/logout');
    setStore('flags',{});
    const w:any = forelet.getWidget(WIDGET_NAME);
    STATE.miningKTnum = 0;
    STATE.miningRank = 0;
    STATE.miningMedalId = 8001;
    STATE.signInDays = 0;
    STATE.awards = getSeriesLoginAwards(1);
    w.init();
    forelet.paint(STATE);
});
// register('mine',(mine:Mine) => {
//     const w:any = forelet.getWidget(WIDGET_NAME);
//     w && w.updateMiningInfo(mine);
// });
const STATE = {
    miningKTnum:0,
    miningRank:0,
    miningMedalId:8001,
    signInDays: 0,   // 签到总天数
    awards:[] // 签到奖励
};

// 监听矿山
register('mine',(mine:Mine) => {
    STATE.miningRank = mine.miningRank;
    STATE.miningMedalId = mine.miningMedalId;
    forelet.paint(STATE);
});

// 云端余额变化
walletRegister('cloud/cloudWallets',(cloudBalances:any) => {

    STATE.miningKTnum = cloudBalances.get(CloudCurrencyType.KT) || 0;
    forelet.paint(STATE);
});

const firstLoginDelay = false;
// 首次登录奖励
const firstloginAward = () => {
    // popModalBoxs('earn-client-app-components-noviceTaskAward-noviceTaskAward',{
    //     title:'新用户',
    //     awardType:2001,
    //     awardNum:2
    // },() => {
    //     popModalBoxs('earn-client-app-components-noviceTaskAward-noviceTaskAward',{
    //         title:'签到奖励',
    //         awardType:2001,
    //         awardNum:1
    //     });
    // });

    // // 绑定聊天UID
    // const uid = chatStore.getStore('uid',0);
    // if (uid > 0) {
    //     clientRpcFunc(bind_chatID,uid,(r:Result) => {
    //         if (r && r.reslutCode) {
    //             console.log('绑定聊天UID成功，聊天uid:',uid);
    //         }
    //     });
    // }
    // 绑定accID
    getStore('user',{ info:{}, id:'' }).then(user => {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!get userinfo:', user);
        const accID = user.info.acc_id;
        if (accID) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!get userinfo accid:', accID);
            
            clientRpcFunc(bind_accID,accID,(r:Result) => {
                if (r && r.reslutCode) {
                    console.log('绑定AccUID成功，accuid:',r);
                }
            });
        }
    });
    
};

// chatStore.register('uid',(r) => {
//     const user = getStore('userInfo');
//     if (user.uid > 0) {
//         // 绑定聊天UID
//         clientRpcFunc(bind_chatID,r,(r:Result) => {
//             if (r && r.reslutCode) {
//                 console.log('绑定聊天UID成功，聊天uid:',r);
//             }
//         });
//     }
// });
// // 监听活动第一次登录 创建钱包
// register('flags/firstLogin',() => {
//     if (getSourceLoaded()) {
//         firstloginAward();
//     } else {
//         firstLoginDelay = true;
//     }
// });

// // 二级目录资源加载完成
// setSourceLoadedCallbackList(() => {
//     if (firstLoginDelay) {
//         firstloginAward();
//         firstLoginDelay = false;
//     }
// });

// ================================================新手活动奖励
chatStore.register('flags/firstChat',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    // 首次聊天
    if (!getStore('flags',{}).firstChat) {
        clientRpcFunc(get_task_award,4,(res:Result) => {
            console.log('参与聊天',res);
            if (res && res.reslutCode === 1) {
                popModalBoxs('earn-client-app-components-noviceTaskAward-noviceTaskAward',{
                    title:'参与聊天',
                    awardType:JSON.parse(res.msg).awardType,
                    awardNum:JSON.parse(res.msg).count
                });
                setStore('flags/firstChat',true);
                w.initPropsNoviceTask();
            }
        });
    }
});

register('flags/firstTurntable',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    // 首次玩大转盘
    clientRpcFunc(get_task_award,5,(res:Result) => {
        console.log('大转盘',res);
        if (res && res.reslutCode === 1) {
            w.initPropsNoviceTask();
        }
    });
});
register('flags/firstOpenBox',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    // 首次玩开宝箱
    clientRpcFunc(get_task_award,6,(res:Result) => {
        console.log('开宝箱',res);
        if (res && res.reslutCode === 1) {
            w.initPropsNoviceTask();
        }
    });
});

register('flags/firstRecharge',(firstRecharge:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    // 首次充值
    if (firstRecharge) {
        clientRpcFunc(get_task_award,7,(res:Result) => {
            console.log('首冲奖励',res);
            if (res && res.reslutCode === 1) {
                popModalBoxs('earn-client-app-components-noviceTaskAward-noviceTaskAward',{
                    title:'首充奖励',
                    awardType:JSON.parse(res.msg).awardType,
                    awardNum:JSON.parse(res.msg).count
                });
                setStore('flags/firstRecharge',true);
                w.initPropsNoviceTask();
            }
        });
    }
});

// 监听签到天数
register('flags/signInDays',(r:any) => {
    STATE.signInDays = r;
    forelet.paint(STATE);
});

// 监听签到奖励刷新
register('flags/loginAwards',(r:any) => {
    STATE.awards = r;
    forelet.paint(STATE);
});