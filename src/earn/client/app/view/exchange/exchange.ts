/**
 * 奖券兑换-首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Item } from '../../../../server/data/db/item.s';
import { register } from '../../store/memstore';
import { getVirtualExchangeList } from '../../utils/util';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Exchange extends Widget {
    public ok: () => void;
    public props:any = {
        navbarSelected: {},
        navbarList: [
            {
                name: 'primaryMall',
                title: { zh_Hans: '初级商场', zh_Hant: '初級商城', en: '' },
                exchangeType:'earn-client-app-view-exchange-virtualList'
            },
            {
                name: 'middleMall',
                title: { zh_Hans: '中级商城', zh_Hant: '中級商城', en: '' },
                exchangeType:'earn-client-app-view-exchange-virtualList'
            },
            {
                name: 'advancedMall',
                title: { zh_Hans: '高级商城', zh_Hant: '高級商城', en: '' },
                exchangeType:'earn-client-app-view-exchange-virtualList'
            }
        ]
    };

    public create() {
        super.create();
        this.props.navbarSelected = this.props.navbarList[0];
        this.initData();

    }

    /**
     * 初始数据
     */
    public initData() {
        const list = getVirtualExchangeList();
        console.log('list--------------',list);
            
        this.paint();
    }

    public changeNavbar(index:number) {
        this.props.navbarSelected = this.props.navbarList[index];
        this.paint();
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('earn-client-app-view-exchange-exchangeHistory');
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行

// register('goods',(goods:Item[]) => {
//     const w:any = forelet.getWidget(WIDGET_NAME);
//     w && w.initData();
// });