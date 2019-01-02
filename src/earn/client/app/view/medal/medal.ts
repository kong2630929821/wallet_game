/**
 * 勋章成就 --主页
 */

import { makeScreenShot } from '../../../../../app/logic/native';
import { ShareToPlatforms } from '../../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../store/memstore';
import { getCoinCount, getMedalList } from '../../utils/util';
import { ItemType } from '../../xls/dataEnum.s';
// import { register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Medal extends Widget {
    public ok: () => void;
    public props: any = {
        scrollHeight: 0,
        medalList: [
            {
                name: '穷人',
                title: { zh_Hans: '穷人', zh_Hant: '窮人', en: '' },
                medal: []
            },
            {
                name: '中产',
                title: { zh_Hans: '中产', zh_Hant: '中產', en: '' },
                medal: []
            },
            {
                name: '富人',
                title: { zh_Hans: '富人', zh_Hant: '富人', en: '' },
                medal: []
            }
        ],
        mineMedal: {
            name: '穷人',
            desc: { zh_Hans: '穷人', zh_Hant: '窮人', en: '' },
            medal: ''
        }
    };

    public create() {
        super.create();
        this.initData();
    }

    /**
     * 更新props数据
     */
    public initData() {
        const medalList = getMedalList(ItemType.KT, 'coinType');
        const mineKT = getCoinCount(ItemType.KT); 
        
        medalList.forEach(element => {
            const medal = { title: { zh_Hans: element.desc, zh_Hant: element.descHant, en: '' }, img: `medal${element.id}`, id: element.id };
            
            this.props.medalList.forEach(element1 => {
                if (mineKT >= element.coinNum) {  // 判断用户勋章等级
                    this.props.mineMedal = {
                        rank:element1.title,
                        desc:{ zh_Hans: element.desc, zh_Hant: element.descHant, en: '' },
                        medal:`medal${element.id}`
                    };
                }

                if (element1.name === element.typeNum) { // 添加勋章列表
                    element1.medal.push(medal);
                }
            });
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

        popNew('earn-client-app-view-medal-medalShow', { medalId, medalSite }, () => {
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
            popNew('app-components-share-share',{ shareType:ShareToPlatforms.TYPE_SCREEN });
        },() => {
            popNew('app-components1-message-message',{ content:this.config.value.tips });
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
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行

// register('goods', (goods: Item[]) => {
//     const w: any = forelet.getWidget(WIDGET_NAME);
//     w && w.initData();
// });