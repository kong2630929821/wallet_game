/**
 * 我的物品 --物品详情
 */


import { Widget } from "../../../../../pi/widget/widget";

interface Props{
    name:string;
}



export class ProductDetail extends Widget {
    public ok: () => void;

    public props:Props ={
        name :'',
    }

    public setProps(props:any){
        super.setProps(props);
    }


    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}