/**
 * earn home 
 */
// ================================ 导入
import { OfflienType } from '../../../../../app/components1/offlineTip/offlineTip';
import { getModulConfig } from '../../../../../app/modulConfig';
import { getStore as walletGetStore,register as walletRegister } from '../../../../../app/store/memstore';
import { getWalletToolsMod } from '../../../../../app/utils/commonjsTools';
import { getUserInfo, hasWallet, popNew3, popPswBox, rippleShow } from '../../../../../app/utils/tools';
import { gotoChat } from '../../../../../app/view/base/app';
import * as chatStore from '../../../../../chat/client/app/data/store';
import { Json } from '../../../../../pi/lang/type';
import { popModalBoxs } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Result } from '../../../../server/data/db/guessing.s';
import { SeriesDaysRes } from '../../../../server/rpc/itemQuery.s';
import { bind_accID } from '../../../../server/rpc/user.p';
import { get_task_award } from '../../../../server/rpc/user_item.p';
import { clientRpcFunc } from '../../net/init';
import { getCompleteTask, getLoginDays } from '../../net/rpc';
import { getStore, Mine, register, setStore } from '../../store/memstore';
import { getHoeCount, getMaxMineType, getSeriesLoginAwards } from '../../utils/util';
import { HoeType } from '../../xls/hoeType.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

// tslint:disable-next-line:completed-docs
export class EarnHome extends Widget {
    public ok: () => void;
    public language: any;
    public props: any;
    public config: any;
    
    public create() {
        super.create();
        this.init();
        this.state = STATE;
    }
    
    public setProps(props: Json, oldProps: Json) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props, oldProps);
        if (props.isActive) {
            this.updateTasks();
        }
    }

    /**
     * 初始化数据
     */
    public init() {
        console.log('hom1 init called');
        const ktShow = getModulConfig('KT_SHOW');
        const flags = getStore('flags');
        this.props = {
            ...this.props,
            offlienType:OfflienType.EARN,
            ktShow,
            scrollHeight: 0,            
            refresh: false,
            avatar: getUserInfo().avatar ||  '../../res/image1/default_avatar.png',
            // 热门活动
            ironHoe: getHoeCount(HoeType.IronHoe),
            goldHoe: getHoeCount(HoeType.GoldHoe),
            diamondHoe: getHoeCount(HoeType.DiamondHoe),
            hoeType: HoeType,
            hoeSelected:-1,
            maxMineType:getMaxMineType(),
            upAnimate:'',
            downAnimate:'',
            animateStart:false,
            isLogin:getStore('userInfo/uid', 0) > 0,  // 活动是否登陆成功
            signInDays: flags.signInDays || 0,   // 签到总天数
            awards: flags.loginAwards || getSeriesLoginAwards(1),  // 签到奖励
            animationed:true // 动画完成
        };
        this.initHotActivities();
        this.initPropsNoviceTask();
    }

    public initHotActivities() {
        const ktShow = getModulConfig('KT_SHOW');
        const scShow = getModulConfig('SC_SHOW');
        this.props.hotActivities =  [{
            img: 'btn_yun_5.png',
            title: '领分红',
            desc: `根据${ktShow}领分红`,
            components:'app-view-earn-mining-dividend'
        }, {
            img: 'btn_yun_6.png',
            title: '发红包',
            desc: '试试朋友的手气',
            components:'app-view-earn-redEnvelope-writeRedEnv'
        }, {
            img: 'btn_yun_7.png',
            title: `充${scShow}送${ktShow}`,
            desc: '赠品可以玩游戏',
            components:'app-view-wallet-cloudWalletCustomize-rechargeSC'
        }, {
            img: 'btn_yun_8.png',
            title: '兑换码',
            desc: '兑换礼物和红包',
            components:'app-view-earn-exchange-exchange'
        },{
            img: 'btn_yun_3.png',
            title: '邀请好友',
            desc: '累计邀请有好礼',
            components:'earn-client-app-view-activity-inviteFriend'
        }];
    }
    /**
     * 初始化任务列表
     */
    public initPropsNoviceTask() {
        const wallet = walletGetStore('wallet');
        const flags = getStore('flags');
        // tslint:disable-next-line:ban-comma-operator
        this.props.noviceTask = [
            {
                img: '',
                title: '验证手机号',
                desc: '凭借手机验证可找回云端资产',
                btn:'去绑定',
                addOne:false,
                components:'app-view-mine-setting-phone',
                complete: !!getUserInfo().phoneNumber,
                show:true
            },{
                img: '2003.png',
                title: '首次充值成功',
                desc: '充值玩更多游戏',
                btn:'去充值',
                addOne:true,
                components:'app-view-wallet-cloudWalletCustomize-rechargeSC',
                complete: !!flags.firstRecharge,
                show:true
            },{
                img: '2001.png',
                title: '参与聊天',
                desc: '和大家聊一聊最近的热点',
                btn:'去聊天',
                addOne:true,                
                components:'goChat',
                complete:!!flags.firstChat,
                show:true
            },{
                img: 'task_gift.png',
                title: '玩一把大转盘',
                desc: '每天赠送初级大转盘一次抽奖机会',
                btn:'去抽奖',
                addOne:false,
                components:'earn-client-app-view-turntable-turntable',
                complete: !!flags.firstTurntable,
                show:true
            },{
                img: 'task_gift.png',
                title: '开个初级宝箱',
                desc: '每天免费开初级宝箱一次',
                btn:'开个宝箱',
                addOne:false,                
                components:'earn-client-app-view-openBox-openBox',
                complete: !!flags.firstOpenBox,
                show:true
            },{
                img: '2002.png',
                title: '去备份助记词',
                desc: '助记词是您找回账号的唯一凭证',
                btn:'去备份',
                addOne:true,                
                components:'backUp',
                complete: !!flags.helpWord,
                show:wallet && wallet.setPsw
            }, {
                img: '2003.png',
                title: `去分享秘钥片段`,
                desc: '分享使保存更安全',
                btn:'分享片段',
                addOne:true,                
                components:'sharePart',
                complete: !!flags.sharePart,
                show:wallet && wallet.setPsw
            }];
    }
    /**
     * 刷新任务数据
     */

    public async updateTasks() {
        if (getStore('userInfo/uid',0) <= 0) {
            return;
        }
        if (!getStore('flags').loginAwards) {
            getLoginDays().then((r:SeriesDaysRes) => {
                this.props.signInDays = r.days;
                this.props.awards = getSeriesLoginAwards(r.days);
                setStore('flags/loginAwards',this.props.awards);
                setStore('flags/signInDays',this.props.signInDays);

                this.paint();
            });
        }
        getCompleteTask().then((data:any) => {
            console.log('home1 getCompleteTask',data);
            const flags = getStore('flags');
            for (const v of data.taskList) {
                if (v.state) {
                    this.props.noviceTask[v.id - 1].complete = true;
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
            setStore('flags',flags);
            this.initPropsNoviceTask();
            this.paint();
        });
    }

    /**
     * 热门活动进入
     */
    public goHotActivity(ind: number) {
        if (!hasWallet()) return;
        const page = this.props.hotActivities[ind].components;
        popNew3(page);
    }

    /**
     * 新手任务
     */
    public async goNoviceTask(ind:number) {
        if (!hasWallet()) return;
        const page = this.props.noviceTask[ind].components;
        if (page === 'backUp') {  // 去备份
            const psw = await popPswBox();
            if (!psw) return;
            const walletToolsMod = await getWalletToolsMod();
            const ret = await walletToolsMod.backupMnemonic(psw);
            if (ret) {
                popNew3('app-view-wallet-backup-index',{ ...ret,pi_norouter:true });
                // this.backPrePage();
            }
        } else if (page === 'sharePart') { // 分享片段
            const psw = await popPswBox();
            if (!psw) return;
            const walletToolsMod = await getWalletToolsMod();
            const ret = await walletToolsMod.backupMnemonic(psw);
            if (ret) {
                popNew3('app-view-wallet-backup-shareMnemonic',{ fragments:ret.fragments });
            }
        } else if (page === 'goChat') { // 去聊天
            gotoChat();
        } else {
            popNew3(page);            
        }
    }

    /**
     * 挖矿点击展开
     */
    public miningClick() {
        if (!this.props.animationed) return;  // 如果没完成就禁用打开挖矿
        if (!hasWallet()) return;
        this.props.upAnimate = 'put-out-up';
        this.props.downAnimate = 'put-out-down';
        this.props.animateStart = true;
        setStore('flags/earnHomeHidden',true);
        setTimeout(() => {
            document.getElementById('earn-home').scrollTop = 0;
        },500);
        this.paint();
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

    /**
     * 采矿说明点击..
     */
    public miningInstructionsClick() {
        popNew3('earn-client-app-view-activity-miningRule');
    }

    public goMineRank() {
        if (!hasWallet()) return;
        popNew3('earn-client-app-view-mineRank-mineRank');
    }
    
    /**
     * 屏幕滑动
     */
    public scrollPage() {
        const scrollTop = document.getElementById('earn-home').scrollTop;
        this.props.scrollHeight = scrollTop;
        this.paint();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}

// ===================================================== 本地
// ===================================================== 立即执行
register('userInfo/isLogin',(isLogin:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (isLogin && w) {
        w.props.isLogin = true;
        w.paint();
    }
});

register('flags/earnHomeHidden',(earnHomeHidden:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (!earnHomeHidden) {
        w.props.animationed = false;  // 当它在执行时把开关关掉挖矿
        w.props.upAnimate = 'reset-put-out';
        w.props.downAnimate = 'reset-put-out';
        setTimeout(() => {
            w.props.upAnimate = '';
            w.props.downAnimate = '';
            w.props.animateStart = false;
            w.props.animationed = true; // 执行完了在打开挖矿
            w.paint();
        },500);
        w.paint();
    } 
});

register('flags/logout',() => {  // 退出钱包时刷新页面
    console.log('home1 -----flags/logout');
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.init();
    w && w.paint();
});
// register('mine',(mine:Mine) => {
//     const w:any = forelet.getWidget(WIDGET_NAME);
//     w && w.updateMiningInfo(mine);
// });
const STATE = {
    miningKTnum:0,
    miningRank:0,
    miningMedalId:0
};
register('mine',(mine:Mine) => {
    // const data = walletGetStore('mine');
    STATE.miningKTnum = mine.miningKTnum;
    STATE.miningRank = mine.miningRank;
    STATE.miningMedalId = mine.miningMedalId;
    forelet.paint(STATE);
});

let firstLoginDelay = false;
// 首次登陆奖励
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
    const user = walletGetStore('user',{ info:{}, id:'' });
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
// 监听活动第一次登录 创建钱包
register('flags/firstLogin',() => {
    const level_3_page_loaded = walletGetStore('flags').level_3_page_loaded;
    if (level_3_page_loaded) {
        firstloginAward();
    } else {
        firstLoginDelay = true;
    }
        
});

walletRegister('wallet', () => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initPropsNoviceTask();
    w && w.paint();
});

// 二级目录资源加载完成
walletRegister('flags/level_3_page_loaded', (loaded: boolean) => {
    if (firstLoginDelay) {
        firstloginAward();
        firstLoginDelay = false;
    }
});

// ================================================新手活动奖励

walletRegister('wallet/helpWord',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    // 备份
    if (!getStore('flags',{}).helpWord) { 
        clientRpcFunc(get_task_award,2,(res:Result) => {
            console.log('备份成功',res);
            if (res && res.reslutCode === 1) {
                popModalBoxs('earn-client-app-components-noviceTaskAward-noviceTaskAward',{
                    title:'备份成功',
                    awardType:JSON.parse(res.msg).awardType,
                    awardNum:JSON.parse(res.msg).count
                });
                setStore('flags/helpWord',true);
                w.updateTasks();
            }
        });
    }
    
});
walletRegister('wallet/sharePart',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    // 分享密钥
    if (!getStore('flags',{}).sharePart) {  
        clientRpcFunc(get_task_award,3,(res:Result) => {
            console.log('成功分享片段',res);
            if (res && res.reslutCode === 1) {
                popModalBoxs('earn-client-app-components-noviceTaskAward-noviceTaskAward',{
                    title:'成功分享片段',
                    awardType:JSON.parse(res.msg).awardType,
                    awardNum:JSON.parse(res.msg).count
                });
                setStore('flags/sharePart',true);
                w.updateTasks();
            }
        });
    }
});
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
                w.updateTasks();
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
            w.updateTasks();
        }
    });
});
register('flags/firstOpenBox',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    // 首次玩开宝箱
    clientRpcFunc(get_task_award,6,(res:Result) => {
        console.log('开宝箱',res);
        if (res && res.reslutCode === 1) {
            w.updateTasks();
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
                w.updateTasks();
            }
        });
    }
});

walletRegister('user/info',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        // tslint:disable-next-line:ban-comma-operator
        w.props.avatar = getUserInfo().avatar ||  '../../res/image1/default_avatar.png';
        w.initHotActivities();
        w.initPropsNoviceTask();
        w.paint();
    }
});