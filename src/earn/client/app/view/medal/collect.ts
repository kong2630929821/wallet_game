/**
 * 我的收藏 --主页
 */

import { Widget } from '../../../../../pi/widget/widget';
import { Forelet } from '../../../../../pi/widget/forelet';
import { popNew } from '../../../../../pi/ui/root';
import { getRealNode } from '../../../../../pi/widget/painter';
import { set } from '../../../../../pi/util/task_mgr';
// import { register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Collect extends Widget {
    public ok: () => void;
    public props = {
        scrollHeight:0,
        medalList:[
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal1'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal'},
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
    public scrollPage(e:any) {
        
        const scrollTop = e.target.scrollTop;
        this.props.scrollHeight = scrollTop;
        this.paint();
    }

    /**
     * 勋章展示
     */
    public medalShow(e:any,index:number){
        let place = {
            top:Math.floor(getRealNode(e.node).getBoundingClientRect().top),
            left:Math.floor(getRealNode(e.node).getBoundingClientRect().left),
        }
        let $style = getRealNode(e.node).style;
        $style.position = `relative`;
        $style.transform = `translateY(${355-place.top}px) translateX(${100-place.left}px) scale(2)`;
        $style.transition = `transform 0.5s ease`;
        console.log('place----------------',place);
        setTimeout(() => {
            popNew('earn-client-app-view-medal-medalShow',{...place});
            $style.position = ``;
            $style.transform = ``;
            $style.transition = `transform 0.5s ease`;
        }, 400);
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