/**
 * 我的物品 --物品详情
 */


import { Widget } from "../../../../../pi/widget/widget";
import { copyToClipboard } from "../../../../../app/utils/tools";

interface Props{
    name:string;
    detailType:number; //0:兑换成功 1：物品列表
}



export class ProductDetail extends Widget {
    public ok: () => void;

    public props:Props ={
        name :'',
        detailType:0
    }

    public setProps(props:any){
        super.setProps(props);
    }


    public codeCopy(){
        // copyToClipboard(this.props.inviteCode);
        copyToClipboard('123');
    } 

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}