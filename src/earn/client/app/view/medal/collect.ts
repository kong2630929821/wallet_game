/**
 * 我的收藏 --主页
 */

import { Widget } from '../../../../../pi/widget/widget';
import { Forelet } from '../../../../../pi/widget/forelet';
import { popNew } from '../../../../../pi/ui/root';
import { getRealNode } from '../../../../../pi/widget/painter';
// import { register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Collect extends Widget {
    public ok: () => void;
    public props = {
        scrollHeight: 0,
        medalList: [
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal1' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal2' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal2' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
            { title: { "zh_Hans": "我的收集", "zh_Hant": "我的收集", "en": "" }, img: 'medal' },
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
        //TODO
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
     * 勋章展示
     */
    public medalShow(e: any, index: number) {

            // this.props.medalIsShow = true;
            const $realDom = getRealNode(e.node);
            let medalSite = {
                top: Math.floor($realDom.getBoundingClientRect().top),
                left: Math.floor($realDom.getBoundingClientRect().left),
                width: $realDom.getBoundingClientRect().width,
                height: $realDom.getBoundingClientRect().height
            }
            // console.log('medalSite----------------', medalSite);
            // const imgScale = Math.round((imgWidth / medalSite.width) * 100) / 100; //图片缩放比例
            // const moveY = ((440-medalSite.height*imgScale)  - (medalSite.top - 0.5 * (medalSite.height*(imgScale-1))))/scaling;
            // const moveX = ((clientWidth - imgWidth) / 2 - (medalSite.left - 0.5 * (imgWidth - medalSite.width))) / scaling;
            // console.log('moveX--------------', moveX);
            // console.log('moveY--------------', moveY);


            let $realDomStyle = $realDom.style;
            $realDomStyle.visibility  = `hidden`;
            // $realDomStyle.position = `relative`;
            // $realDomStyle.zIndex = `1`;
            // $realDomStyle.transform = `translateY(${moveY}px) translateX(${moveX}px) scale(${imgScale})`;
            // $realDomStyle.transition = `all 0.5s ease`;


            popNew('earn-client-app-view-medal-medalShow', { img: this.props.medalList[index].img, medalSite, }, () => {
                $realDomStyle.visibility = `visible`;
                // $realDomStyle.position = ``;
                // $realDomStyle.transform = ``;
                // $realDomStyle.transition = `transform 0.5s ease`;
                // $realDomStyle.zIndex = `auto`;
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