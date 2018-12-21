/**
 * 奖券兑换 --商品详情
 */


import { Widget } from "../../../../../pi/widget/widget";
import { popNew } from "../../../../../pi/ui/root";

interface Props{
    name:string;
}



export class ProductDetail extends Widget {
    public ok: () => void;

    public props:Props ={
        name :'',
    }

    public setProps(props:any){
        super.setProps(this.props);
        this.props = {
            ...this.props,
            name:props.productName
        }
    }


    /**
     * 确认兑换
     */
    public comfirmExchange(){
        popNew('earn-client-app-view-exchange-comfirmExchange',null,()=>{
            popNew('earn-client-app-view-myProduct-productDetail',this.props);
        });
    }


    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}