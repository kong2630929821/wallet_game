/**
 * 竞猜主页
 */

import { queryNoPWD } from '../../../../../app/api/JSAPI';
import { register as walletRegister } from '../../../../../app/store/memstore';
import { walletSetNoPSW } from '../../../../../app/utils/pay';
import { inviteUserToGroup } from '../../../../../chat/client/app/net/rpc';
import { LOLGUESS_GROUP } from '../../../../../chat/server/data/constant';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import * as store from '../../store/memstore';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class GuessHome extends Widget {
    public ok: () => void;

    public props: any = {
        selectTopbar: {},
        topbarList: [
            {
                name: 'filter',
                title: { zh_Hans: '筛选', zh_Hant: '篩選', en: '' },
                component: 'earn-client-app-view-guess-allGuess-filterGuess'
            },
            {
                name: 'all',
                title: { zh_Hans: '全部', zh_Hant: '全部', en: '' },
                component: 'earn-client-app-view-guess-allGuess-allGuess'
            },
            {
                name: 'self',
                title: { zh_Hans: '我的', zh_Hant: '我的', en: '' },
                component: 'earn-client-app-view-guess-selfGuess-selfGuess'
            }
        ],
        showMoreSetting: false,
        noPassword: store.getStore('flags').noPassword
    };

    public create() {
        super.create();
        this.props.selectTopbar = this.props.topbarList[1];
        queryNoPWD('101', (res, msg) => {
            store.setStore('flags/noPassword',!!res);
            if (!res) {
                this.props.noPassword = true;
            } else {
                this.props.noPassword = false;
            }
            this.paint();
        });
        inviteUserToGroup(LOLGUESS_GROUP,(r) => {
            console.log('加群回调LOLGUESS_GROUP---------------',r);
        });
        
    }

    /**
     * 更多设置
     */
    public showSetting() {
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
    public changeTopbar(index: number) {
        this.props.selectTopbar = this.props.topbarList[index];
        this.paint();
    }

    /**
     * 设置免密支付
     */
    public async setting() {
        let state = 0;
        if (this.props.noPassword === false) {
            state = 1;
        } 

        walletSetNoPSW('101', '15', state, (res,msg) => {
            console.log(res,msg);
            if (!res) {
                this.props.noPassword = !this.props.noPassword; 
                this.paint();
            } 

        });
        this.closeSetting();
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 刷新免密支付设置状态
     */
    public initNoPsw(noPSW:boolean) {
        this.props.noPassword = noPSW;
        store.setStore('flags/noPassword',noPSW);
        this.paint();
    }
}

// ==============================================立即执行

walletRegister('flags/noPassword',(r:any) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w &&  w.initNoPsw(r);
});