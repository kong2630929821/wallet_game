/**
 * earn home 
 */
// ================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { getLang } from '../../../../../pi/util/lang';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Item } from '../../../../server/data/db/item.s';
import { getAllGoods } from '../../net/rpc';
import { register } from '../../store/memstore';
import { getHoeCount } from '../../utils/util';
import { HoeType } from '../../xls/hoeType.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class PlayHome extends Widget {
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
        this.props = {
            ...this.props,
            page: [
                'app-view-earn-client-view-mining-rankList', // 挖矿排名
                'app-view-earn-client-view-mining-dividend', // 领分红
                'app-view-earn-client-view-redEnvelope-writeRedEnv', // 发红包
                'app-view-earn-client-view-exchange-exchange', // 兑换
                'app-view-earn-client-view-mining-addMine'  // 任务
            ],
            scroll: false,
            scrollHeight: 0,
            refresh: false,
            avatar: '../../res/image1/default_avatar.png',
            welfareActivities: [{
                img: 'btn_yun_5.png',
                title: '邀请好友',
                desc: '累计邀请有好礼'
            }, {
                img: 'btn_yun_6.png',
                title: '验证手机',
                desc: '额外赠送2500KT'
            }, {
                img: 'btn_yun_7.png',
                title: '开宝箱',
                desc: '不定期上新物品'
            }, {
                img: 'btn_yun_8.png',
                title: '大转盘',
                desc: '试试我的手气'
            }, {
                img: 'btn_yun_9.png',
                title: '奖券中心',
                desc: '可以抽奖兑换物品'
            }, {
                img: 'btn_yun_10.png',
                title: '兑换物品',
                desc: '不定期上新物品'
            }, {
                img: 'btn_yun_11.png',
                title: '我的物品',
                desc: '兑换和中奖的物品'
            }],
            ironHoe:getHoeCount(HoeType.IronHoe),
            goldHoe:getHoeCount(HoeType.GoldHoe),
            diamondHoe:getHoeCount(HoeType.DiamondHoe),
            hoeType:HoeType
        };

        setTimeout(() => {
            this.scrollPage();
        }, 17);
        setTimeout(() => {
            getAllGoods();
        }, 2000);
        console.log(this.props.hoeType);
    }
    /**
     * 福利活动进入
     * @param ind 福利顺序
     */
    public goActivity(ind: number) {
        switch (ind) {
            case 0:
                popNew('earn-client-app-view-activity-inviteFriend');// 邀请好友
                break;
            case 1:
                popNew('earn-client-app-view-activity-verifyPhone');// 验证手机
                break;
            case 2:
                popNew('earn-client-app-view-openBox-openBox');// 开宝箱
                break;
            case 3:
                popNew('earn-client-app-view-turntable-turntable');// 大转盘
                break;
            case 4:
                popNew('earn-client-app-view-ticketCenter-ticketCenter');// 奖券中心
                break;
            case 5:
                popNew('earn-client-app-view-exchange-exchange');// 奖券兑换
                break;
            case 6:
                popNew('earn-client-app-view-myProduct-myProduct');// 我的物品
                break;
            default:
        }
    }

    public miningClick() {
        popNew('earn-client-app-view-activity-mining-home');
    }

    /**
     * 打开我的设置
     */
    public showMine() {
        popNew('app-view-mine-home-home');
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
     * 采矿说明点击..
     */
    public miningInstructionsClick() {
        popNew('earn-client-app-view-activity-mining-miningRule');
    }

    public updateHoe() {
        this.props.ironHoe = getHoeCount(HoeType.IronHoe);
        this.props.goldHoe = getHoeCount(HoeType.GoldHoe);
        this.props.diamondHoe = getHoeCount(HoeType.DiamondHoe);
        this.paint();
    }
}

// ===================================================== 本地
// ===================================================== 立即执行

register('goods', (goods: Item[]) => {
    console.log('goods change ', goods);
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.updateHoe();
});