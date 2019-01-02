/**
 * 我的收藏 --主页
 */

import { makeScreenShot } from '../../../../../app/logic/native';
import { ShareToPlatforms } from '../../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
// import { register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Collect extends Widget {
    public ok: () => void;
    public props:any = {
        scrollHeight: 0,
        medalList: [
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 },
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 },
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 },
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 },
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 },
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 },
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 },
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 },
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 },
            { title: { zh_Hans: '我的收集', zh_Hant: '我的收集', en: '' }, img: 'medal8001',id:8001 }
        ]
    };

    public create() {
        super.create();
        this.initData();
    }

    /**
     * 更新props数据
     */
    public initData() {
        // TODO
        this.paint();
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
        $realDomStyle.visibility  = `hidden`;

        popNew('earn-client-app-view-medal-medalShow', { medalId, medalSite }, () => {
            $realDomStyle.visibility = `visible`;
            this.paint();
        });

        this.paint();
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