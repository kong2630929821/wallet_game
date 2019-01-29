/**
 * earn home 
 */
// ================================ 导入
import { hasWallet } from '../../../../../app/utils/tools';
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { getLang } from '../../../../../pi/util/lang';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore, Mine, register, setStore } from '../../store/memstore';
import { getHoeCount, getMaxMineType } from '../../utils/util';
import { HoeType } from '../../xls/hoeType.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class EarnHome extends Widget {
    public ok: () => void;
    public language: any;
    public props: any;
    public config: any;
    public setProps(props: Json, oldProps: Json) {
        super.setProps(props, oldProps);
        this.init();
    }
    /**
     * 初始化数据
     */
    public init() {
        this.language = this.config.value[getLang()];
        const mine = getStore('mine');
        console.log('home--------mine-----------------',mine);
        
        this.props = {
            ...this.props,
            scroll: false,
            scrollHeight: 0,
            refresh: false,
            avatar: '../../res/image1/default_avatar.png',
            hotActivities: [{
                img: 'btn_yun_1.png',
                title: '每日登录',
                desc: '连续登录有大奖',
                components:'earn-client-app-view-activity-signIn'
            }, {
                img: 'btn_yun_2.png',
                title: '做任务',
                desc: '可以抽奖兑换物品',
                components:'app-view-earn-mining-addMine'
            }, {
                img: 'btn_yun_3.png',
                title: '邀请好友',
                desc: '累计邀请有好礼',
                components:'earn-client-app-view-activity-inviteFriend'
            }, {
                img: 'btn_yun_4.png',
                title: '验证手机',
                desc: '确认是真实用户',
                components:'earn-client-app-view-activity-verifyPhone'
            }],
            applicationWelfares:[{
                img: 'btn_yun_5.png',
                title: '领分红',
                desc: '根据KT领分红',
                components:'app-view-earn-mining-dividend'
            }, {
                img: 'btn_yun_6.png',
                title: '发红包',
                desc: '试试朋友的手气',
                components:'app-view-earn-redEnvelope-writeRedEnv'
            }, {
                img: 'btn_yun_7.png',
                title: '充KT送ST',
                desc: '赠品可以玩游戏',
                components:'app-view-wallet-cloudWallet-rechargeKT'
            }, {
                img: 'btn_yun_8.png',
                title: '兑换码',
                desc: '兑换礼物和红包',
                components:'app-view-earn-exchange-exchange'
            }],
            ironHoe: getHoeCount(HoeType.IronHoe),
            goldHoe: getHoeCount(HoeType.GoldHoe),
            diamondHoe: getHoeCount(HoeType.DiamondHoe),
            hoeType: HoeType,
            hoeSelected:-1,
            maxMineType:getMaxMineType(),
            upAnimate:'',
            downAnimate:'',
            animateStart:false,
            miningKTnum:mine.miningKTnum,
            miningRank:mine.miningRank,
            miningMedalId:mine.miningMedalId
        };
        this.paint();
        setTimeout(() => {
            this.scrollPage();
        }, 17);
        // this.getMiningInfo();
        // console.log(this.props.hoeType);
    }
    /**
     * 热门活动进入
     */
    public goHotActivity(ind: number) {
        if (!hasWallet()) return;
        const page = this.props.hotActivities[ind].components;
        popNew(page);
    }

    /**
     * 应用福利
     */
    public goApplicationWelfares(ind:number) {
        if (!hasWallet()) return;
        const page = this.props.applicationWelfares[ind].components;
        popNew(page);
    }

    /**
     * 挖矿点击展开
     */
    public miningClick() {
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
     * 屏幕滑动
     */
    public scrollPage() {
        const scrollTop = document.getElementById('earn-home').scrollTop;
        this.props.scrollHeight = scrollTop;
        if (scrollTop > 0) {
            this.props.scroll = true;
            if (this.props.scroll) {
                this.paint();
            }

        } else {
            this.props.scroll = false;
            this.paint();
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

    /**
     * 采矿说明点击..
     */
    public miningInstructionsClick() {
        popNew('earn-client-app-view-activity-miningRule');
    }

    public goMineRank() {
        if (!hasWallet()) return;
        popNew('earn-client-app-view-mineRank-mineRank');
    }
}

// ===================================================== 本地
// ===================================================== 立即执行

register('flags/earnHomeHidden',(earnHomeHidden:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (!earnHomeHidden) {
        w.props.upAnimate = 'reset-put-out';
        w.props.downAnimate = 'reset-put-out';
        setTimeout(() => {
            w.props.upAnimate = '';
            w.props.downAnimate = '';
            w.props.animateStart = false;
            w.paint();
        },500);
        w.paint();
    } 
});

register('mine',(mine:Mine) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateMiningInfo(mine);
});
