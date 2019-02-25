/**
 * 竞猜主页
 */

import { queryNoPWD } from '../../../../../app/api/JSAPI';
import { walletSetNoPSW } from '../../../../../app/utils/pay';
import * as chatStore from '../../../../../chat/client/app/data/store';
import { inviteUsersToGroup } from '../../../../../chat/client/app/net/rpc';
import { LOLGUESS_GROUP } from '../../../../../chat/server/data/constant';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

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
        noPassword: false
    };

    public create() {
        super.create();
        this.props.selectTopbar = this.props.topbarList[1];
        // queryNoPWD('101', (res, msg) => {
        //     if (!res) {
        //         this.props.noPassword = true;
        //     } else {
        //         this.props.noPassword = false;
        //     }
        //     this.paint();
        // });
        inviteUsersToGroup(LOLGUESS_GROUP,[chatStore.getStore('uid')],(r) => {
            console.log('加群回调LOLGUESS_GROUP---------------',r);
        });
        queryNoPWD('101', (res, msg) => {
            if (!res) {
                this.props.noPassword = true;
            } else {
                this.props.noPassword = false;
            }
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

        walletSetNoPSW('101', '15', state, (res, msg) => {
            console.log(res, msg);
            if (!res) {
                this.props.noPassword = !this.props.noPassword; 
                popNew('app-components1-message-message',{ content:this.config.value.tips[0] });
                this.paint();
            } else {
                popNew('app-components1-message-message',{ content:this.config.value.tips[1] });
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
}