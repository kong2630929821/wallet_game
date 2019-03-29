/**
 * 中奖提示
 */

import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    fadeOut:boolean;
    btn1:string;// 按钮1 
    btn2:string;// 按钮2
    img:string;// 图片
    isColor:false;
}

export class LotteryModal extends Widget {
    public cancel: () => void;
    public ok:(flag:number) => void;     // flag 点击某个按钮
    public props:Props;
    public setProps(props:any) {
        this.props = {
            ...props,
            fadeOut:false
        };
        super.setProps(props);
        console.log('!!!!!!!!!!!!!!!!!!!!!!lotterymodal',props);
    } 
    
    public close() {
        this.props.fadeOut = true;
        this.paint();
        setTimeout(() => {
            this.cancel && this.cancel();
        },300);
    }
    public btnClick(num:number) {
        this.ok(num);
    }
}