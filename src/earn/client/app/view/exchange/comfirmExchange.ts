/**
 * 兑换确认
 */

import { Widget } from "../../../../../pi/widget/widget";


interface Props{
    prizeName:string;//中奖名字
    prizeImg:string;//中奖图片
}

export class ComfirmExchange extends Widget {
    public ok: () => void;
    public cancel:()=>void;

    public cancelClick() {
        this.cancel && this.cancel();
    }

    public comfirmClick(){
        this.ok && this.ok();
    }
}