/**
 * 奖券兑换-首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getExchangeVirtualList } from '../../net/rpc';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Exchange extends Widget {
    public ok: () => void;
    public props: any = {
        list:[]
    };

    public create() {
        super.create();
        this.initData();

    }

    /**
     * 初始数据
     */
    public initData() {
        getExchangeVirtualList().then((res:any) => {
            console.log(res);
            this.props.list = res.list;
            this.paint();
        });
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