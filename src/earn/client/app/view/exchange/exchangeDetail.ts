/**
 * 奖券兑换 --商品详情
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

export class ProductDetail extends Widget {
    public ok: () => void;

    public props:any;

    public setProps(props:any) {
        this.props = {
            ...props,
            stShow:getModulConfig('ST_SHOW')
        };
        super.setProps(this.props);
    }

    /**
     * 确认兑换
     */
    public comfirmExchange() {
        popNew('earn-client-app-view-exchange-comfirmExchange',{ detail:this.props });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}