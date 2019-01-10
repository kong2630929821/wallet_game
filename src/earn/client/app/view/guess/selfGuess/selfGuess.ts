/**
 * 竞猜主页-我的
 */

import { Widget } from '../../../../../../pi/widget/widget';

export class SelfGuess extends Widget {
    public ok: () => void;
    
    public props:any = {
        selectTopbar:{},
        topbarList:[
            {
                name:'filter',
                title:{ zh_Hans:'筛选',zh_Hant:'篩選',en:'' },
                component:''
            },
            {
                name:'all',
                title:{ zh_Hans:'全部',zh_Hant:'全部',en:'' },
                component:''
            },
            {
                name:'self',
                title:{ zh_Hans:'我的',zh_Hant:'我的',en:'' },
                component:''
            }
        ]
    };

    public create () {
        super.create();
        this.props.selectTopbar = this.props.topbarList[1];
        
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}