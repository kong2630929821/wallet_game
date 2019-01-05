import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

/**
 * 兑换虚拟奖品列表
 */

export class ExchangeVirtual extends Widget {

    public props:any = {
        list: [0,0,0,0,0,0],
        text:''
    };

    public setProps(props:any) {
        super.setProps(this.props);
        this.props = {
            ...this.props,
            text:props.exchangeType
        };
    }

    public goProductDetail(index:number) {
        popNew('earn-client-app-view-exchange-exchangeDetail',{ productName:`${index}号商品` });
    }
}