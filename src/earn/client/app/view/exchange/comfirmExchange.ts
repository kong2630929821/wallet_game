/**
 * 兑换确认
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { Widget } from '../../../../../pi/widget/widget';
import { exchangeVirtual, queryExchangeOrder } from '../../net/rpc_order';
import { popNew } from '../../../../../pi/ui/root';

interface Props {
    STcout:number;
}

export class ComfirmExchange extends Widget {
    public ok: () => void;
    public cancel:() => void;
    public props:any;

    public setProps(props:any) {
        this.props = {
            ...this.props,
            detail:props.detail,
            stShow:getModulConfig('KT_SHOW')
        };
        super.setProps(this.props);

    }
    public cancelClick() {
        this.cancel && this.cancel();
    }
    /**
     * 确认兑换
     */
    public comfirmClick() {
        console.log(this.props.detail.id);
        exchangeVirtual(this.props.detail.id).then((order:any) => {
            console.log('+++++++',order);
            queryExchangeOrder(order.oid).then(res => {
                console.log('兑换成功',res);
                popNew('earn-client-app-view-myProduct-productDetail', { orderDetail: res, detailType: 0 });
            }).catch(err => {
                console.log('兑换订单查询失败',err);
                
            });
            
        }).catch(err => {
            console.log('兑换支付失败',err);
            
        });

        this.ok && this.ok();
    }
}