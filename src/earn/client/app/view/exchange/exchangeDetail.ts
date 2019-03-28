/**
 * 奖券兑换 --商品详情
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { exchangeVirtual } from '../../net/rpc_order';
import { popNewMessage } from '../../../../../app/utils/tools';

export class ProductDetail extends Widget {
    public ok: () => void;

    public props:any;

    public setProps(props:any) {
        this.props = {
            ...props,
            stShow:getModulConfig('KT_SHOW'),
            btnName:{"zh_Hans":"奖品已经兑完","zh_Hant":"獎品已經兌完","en":""},
            isClick:true  //true为不能兑换
        };
        super.setProps(this.props);
        // this.init();
    }
    public init(){
        exchangeVirtual(this.props.id).then((order:any)=>{
        }).catch(err=>{
            console.log(err)
            this.props.btnName =err;
            this.props.isClick = true;
            this.paint();
        }) 
    }
    /**
     * 确认兑换
     */
    public comfirmExchange() {
        if(this.props.isClick){
            popNewMessage(this.props.btnName);
            return
        }
        popNew('earn-client-app-view-exchange-comfirmExchange',{ detail:this.props });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}