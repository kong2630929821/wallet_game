/**
 * earn home 
 */
// ================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { getLang } from '../../../../../pi/util/lang';
import { Widget } from '../../../../../pi/widget/widget';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class PlayHome extends Widget {
    public ok: () => void;
    public language:any;
    public props:any;
    public config:any;
    public setProps(props: Json, oldProps: Json) {
        super.setProps(props, oldProps);
        this.init();
    }
    /**
     * 初始化数据
     */
    public init() {
        this.language = this.config.value[getLang()];
        
        this.props = {
            ...this.props,
            ktBalance: 0.00,// kt余额
            ethBalance: 0.00,// eth余额
            holdMines: 0,// 累计挖矿
            mines: 0,// 今日可挖数量
            hasWallet: false, // 是否已经创建钱包
            mineLast: 0,// 矿山剩余量
            rankNum: 1,// 挖矿排名
            page: [
                'earn-client-view-mining-rankList', // 挖矿排名
                'earn-client-view-mining-dividend', // 领分红
                'earn-client-view-redEnvelope-writeRedEnv', // 发红包
                'earn-client-view-exchange-exchange', // 兑换
                'earn-client-view-mining-addMine'  // 任务
            ],
            doMining: false,  // 点击挖矿，数字动画效果执行
            firstClick: true,
            isAbleBtn: false,  // 点击挖矿，按钮动画效果执行
            miningNum: ` <div class="miningNum" style="animation:{{it1.doMining?'move 0.5s':''}}">
                <span>+{{it1.thisNum}}</span>
            </div>`,
            scroll: false,
            scrollHeight: 0,
            refresh: false,
            avatar: '../../res/image1/default_avatar.png',
            welfareActivities:[{
                img:'btn_yun_5.png',
                title:'邀请好友',
                desc:'累计邀请有好礼'
            },{
                img:'btn_yun_6.png',
                title:'验证手机',
                desc:'额外赠送2500KT'
            },{
                img:'btn_yun_7.png',
                title:'开宝箱',
                desc:'不定期上新物品'
            },{
                img:'btn_yun_8.png',
                title:'大转盘',
                desc:'试试我的手气'
            },{
                img:'btn_yun_9.png',
                title:'奖券中心',
                desc:'可以抽奖兑换物品'
            },{
                img:'btn_yun_10.png',
                title:'兑换物品',
                desc:'不定期上新物品'
            },{
                img:'btn_yun_11.png',
                title:'我的物品',
                desc:'兑换和中奖的物品'
            }]
        };
        setTimeout(() => {
            this.scrollPage();
        });
        
    }

        /**
     * 福利活动进入
     * @param ind 福利顺序
     */
    public goActivity(ind: number) {
        switch (ind) {
            case 0:
                popNew('earn-client-app-view-activity-inviteFriend');//邀请好友
                break;
            case 1:
                popNew('earn-client-app-view-activity-verifyPhone');//验证手机
                break;
            case 2:
                popNew('earn-client-app-view-openBox-openBox');//开宝箱
                break;
            case 3:
                popNew('earn-client-app-view-turntable-turntable');//大转盘
                break;
            case 4:
                popNew('earn-client-app-view-ticketCenter-ticketCenter');//奖券中心
                break;

            default:

                break;
        }
    }

    public diggingStoneClick() {
        popNew('earn-client-activity-diggingStones-home');
    }

    /**
     * 打开我的设置
     */
    public showMine() {
        popNew('mine-home-home');
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
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
     * 采矿说明点击
     */
    public miningInstructionsClick() {
        popNew('earn-client-view-activity-diggingStones-diggingRule');
    }

}

// ===================================================== 本地
// ===================================================== 立即执行
