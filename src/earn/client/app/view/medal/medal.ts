/**
 * 勋章成就 --主页
 */

import { makeScreenShot } from '../../../../../app/logic/native';
import { getModulConfig } from '../../../../../app/modulConfig';
import { popNewMessage } from '../../../../../app/utils/tools';
import { ShareType } from '../../../../../pi/browser/shareToPlatforms';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { Item } from '../../../../server/data/db/item.s';
import { getACHVmedal, getKTbalance } from '../../net/rpc';
import { getStore, register } from '../../store/memstore';
import { getACHVmedalList, getMedalList } from '../../utils/util';
import { CoinType } from '../../xls/dataEnum.s';
import { MedalType } from './medalShow';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Medal extends Widget {
    public ok: () => void;
    public props: any;

    public create() {
        super.create();
        this.props = {
            ktShow:getModulConfig('KT_SHOW'),
            scrollHeight: 0,
            medalList: [
                {
                    name: '平民',
                    title: this.config.value.rankName[0],
                    medal: []
                },
                {
                    name: '中产',
                    title: this.config.value.rankName[1],
                    medal: []
                },
                {
                    name: '富人',
                    title: this.config.value.rankName[2],
                    medal: []
                }
            ],
            mineMedal: {
                rankMedal: 8000,
                desc: { zh_Hans: '无', zh_Hant: '无', en: '' },
                nextNeedKt: 1,
                nowClass:'无',
                ktNum:0
            },
            totalMedal:0,
            collectMedal:0
            
        };
        getKTbalance();
        this.initData();
    }

    /**
     * 更新props数据
     */
    public initData() {
        const medalList = getMedalList(CoinType.KT, 'coinType');
        // this.props.mineMedal = computeRankMedal();
        const ktNum = getStore('balance/KT'); 
        for (const element1 of this.props.medalList) {
            element1.medal = [];
            medalList.forEach((element,i) => {
                const medal = { title: { zh_Hans: element.desc, zh_Hant: element.descHant, en: '' }, img: `medal${element.id}`, id: element.id ,isHave:false };
                if (element.coinNum < ktNum) {
                    medal.isHave = true;
                    this.props.mineMedal.rankMedal = element.id;
                    this.props.mineMedal.desc = medal.title;
                    this.props.mineMedal.nextNeedKt = medalList[i + 1].coinNum - ktNum;
                    this.props.mineMedal.nowClass = element.typeNum;
                    this.props.mineMedal.ktNum = ktNum;
                }
                if (element1.name === element.typeNum) { // 添加到勋章等级列表
                    element1.medal.push(medal);
                }
            });
        }
        console.log(this.props.medalList);
        console.log(this.props.mineMedal);
        
        this.props.totalMedal = getACHVmedalList('偶然成就','typeNum').length;
        getACHVmedal().then((res:any) => {
            this.props.collectMedal = res.achievements.length;
            this.paint();
        });
        this.paint();
    }

    /**
     * 勋章展示
     */
    public medalShow(e: any, medalId: number) {

        const $realDom = getRealNode(e.node);
        const medalSite = {
            top: Math.floor($realDom.getBoundingClientRect().top),
            left: Math.floor($realDom.getBoundingClientRect().left),
            width: $realDom.getBoundingClientRect().width,
            height: $realDom.getBoundingClientRect().height
        };

        const $realDomStyle = $realDom.style;
        $realDomStyle.visibility = `hidden`;
        
        popModalBoxs('earn-client-app-view-medal-medalShow', {
            medalId,
            medalSite,
            isHave: (this.props.mineMedal.rankMedal >= medalId),
            medalType:MedalType.rankMedal
        }, () => {
            $realDomStyle.visibility = `visible`;
            this.paint();
        });

        this.paint();
    }

    /**
     * 分享
     */
    public shareClick() {
        makeScreenShot(() => {
            popNew('app-components-share-share', { shareType: ShareType.TYPE_SCREEN });
        }, () => {
            popNewMessage(this.config.value.tips);
        });
    }

    /**
     * 屏幕滑动
     */
    public scrollPage(e: any) {

        const scrollTop = e.target.scrollTop;
        this.props.scrollHeight = scrollTop;
        this.paint();
    }
    /**
     * 跳转我的收藏
     */
    public goMyCollect() {
        popNew('earn-client-app-view-medal-collect');
    }

    /**
     * 刷新页面
     */
    public refresh() {
        this.initData();
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行

register('good', (goods: Item[]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});

register('balance/KT', (goods: Item[]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});