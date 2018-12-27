/**
 * 勋章成就 --主页
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

export class Medal extends Widget {
    public ok: () => void;
    public props = {
        scrollHeight:0,
        medalList:[
            {
                name:'one',
                title:{"zh_Hans":"穷人","zh_Hant":"窮人","en":""},
                medal:[
                    {title:{"zh_Hans":"孑然一身","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"家徒四壁","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"入不敷出","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"身无分文","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"囊中羞涩","zh_Hant":"窮人","en":""},img:'btn_yun_9'}
                ]
            },
            {
                name:'two',
                title:{"zh_Hans":"中产","zh_Hant":"中產","en":""},
                medal:[
                    {title:{"zh_Hans":"清贫乐道","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"饱食暖衣","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"安居乐业","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"丰衣足食","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"锦衣玉食","zh_Hant":"窮人","en":""},img:'btn_yun_9'}
                ]
            },
            {
                name:'three',
                title:{"zh_Hans":"富人","zh_Hant":"富人","en":""},
                medal:[
                    {title:{"zh_Hans":"荣华富贵","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"金玉满堂","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"家财万贯","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"富甲一方","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"富甲天下","zh_Hant":"窮人","en":""},img:'btn_yun_9'}
                ]
            },
            {
                name:'four',
                title:{"zh_Hans":"偶然成就","zh_Hant":"偶然成就","en":""},
                medal:[
                    {title:{"zh_Hans":"天选之子","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"活体锦鲤","zh_Hant":"窮人","en":""},img:'btn_yun_9'},
                    {title:{"zh_Hans":"鸿运当头","zh_Hant":"窮人","en":""},img:'btn_yun_9'}
                ]
            }
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
     * 跳转我的收藏
     */
    public goMyCollect(){
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