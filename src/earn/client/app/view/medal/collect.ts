/**
 * 我的收藏 --主页
 */

import { Widget } from '../../../../../pi/widget/widget';
import { Forelet } from '../../../../../pi/widget/forelet';
import { popNew } from '../../../../../pi/ui/root';
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
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
            {title:{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""},img:'medal2'},
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
    public medalShow(index:number){
        popNew('earn-client-app-view-medal-medalShow');
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