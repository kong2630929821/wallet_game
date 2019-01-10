/**
 * 竞猜主页
 */

import { Widget } from '../../../../../pi/widget/widget';

export class GuessHome extends Widget {
    public ok: () => void;
    
    public props:any = {
        selectTopbar:{},
        topbarList:[
            {
                name:'filter',
                title:{ zh_Hans:'筛选',zh_Hant:'篩選',en:'' },
                component:'earn-client-app-view-guess-allGuess-allGuess'
            },
            {
                name:'all',
                title:{ zh_Hans:'全部',zh_Hant:'全部',en:'' },
                component:'earn-client-app-view-guess-allGuess-allGuess'
            },
            {
                name:'self',
                title:{ zh_Hans:'我的',zh_Hant:'我的',en:'' },
                component:'earn-client-app-view-guess-selfGuess-selfGuess'
            }
        ]
    };

    public create () {
        super.create();
        this.props.selectTopbar = this.props.topbarList[1];
        
    }

    /**
     * 修改topbar
     */
    public changeTopbar(index:number) {
        this.props.selectTopbar = this.props.topbarList[index];
        this.paint();
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}