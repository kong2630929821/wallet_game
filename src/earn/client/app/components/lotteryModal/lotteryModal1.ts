/**
 * 中奖提示
 */

import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    btn1:string;// 按钮1 
    btn2:string;// 按钮2
    img:string;// 图片
}

export class LotteryModal extends Widget {
    public cancel: () => void;
    public ok:(flag:number) => void;     // flag 点击某个按钮
    public props:Props;
    public setProps(props:any) {
        super.setProps(props);
        console.log('!!!!!!!!!!!!!!!!!!!!!!lotterymodal',props);
    } 
    
    public close(e: any) {
        this.cancel();
    }
    public btnClick(num:number) {
        this.ok(num);
    }
}