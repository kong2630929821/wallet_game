/**
 * 奖券兑换 --商品详情
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    detail:any; //
}

export class ProductDetail extends Widget {
    public ok: () => void;

    public props:any = {
        detail :{}
    };

    public setProps(props:any) {
        super.setProps(this.props);
        this.props = {
            ...this.props,
            detail:props.detail,
            stShow:getModulConfig('ST_SHOW')
        };
    }

    /**
     * 确认兑换
     */
    public comfirmExchange() {
        popNew('earn-client-app-view-exchange-comfirmExchange',{ detail:this.props.detail });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}