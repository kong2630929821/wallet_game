/**
 * 竞猜主页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

export class GuessHome extends Widget {
    public ok: () => void;
    
    public props:any = {
        selectTopbar:{},
        topbarList:[
            {
                name:'filter',
                title:{ zh_Hans:'筛选',zh_Hant:'篩選',en:'' },
                component:'earn-client-app-view-guess-allGuess-filterGuess'
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
        ],
        showMoreSetting:false,
        needNotPassword:false
    };

    public create () {
        super.create();
        this.props.selectTopbar = this.props.topbarList[1];
        
    }

    /**
     * 更多设置
     */
    public goSetting() {
        this.props.showMoreSetting = !this.props.showMoreSetting;
        this.paint();
    }

    /**
     * 关闭设置
     */
    public closeSetting() {
        this.props.showMoreSetting = false;
        this.paint();
    }

    /**
     * 修改topbar
     */
    public changeTopbar(index:number) {
        this.props.selectTopbar = this.props.topbarList[index];
        this.paint();
    }

    /**
     * 设置免密支付
     */
    public setting() {
        if (!this.props.needNotPassword) {
            popNew('app-components1-modalBox-modalBox',{ 
                title:'开通小额免密',
                content:'累计未超过20ST不再验证密码，超过后直至下个20ST。' 
            },() => {
                console.log(11);
                this.props.needNotPassword = true;
            });
        } else {
            this.props.needNotPassword = false;
        }
        this.closeSetting();
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}