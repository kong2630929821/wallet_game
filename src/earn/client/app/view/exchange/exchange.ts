/**
 * 奖券兑换-首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { isLogin } from '../../utils/util';
import { getStore, register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Exchange extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.state = {
            list:[]
        };
        if (isLogin()) {
            this.state.list = getStore('redemption');
        }
    }

    public attach() {
        if (!isLogin()) {
            this.backPrePage();
        }
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

register('redemption',(r:any) => {
    forelet.paint({list:r})
});