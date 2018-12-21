/**
 * 奖券合成
 */

import { Widget } from "../../../../../pi/widget/widget";


interface Props{
    compoundType:number;//合成种类
    compoundExtent:number;//合成进度
}

export class TicketCompound extends Widget {
    public ok: () => void;
    public props:Props = {
        compoundType:0, 
        compoundExtent:0,
    }

    public compound(ind:number){
        if(this.props.compoundExtent>0){
            return;
        }
        this.props.compoundType = ind;
        const fn = ()=>{
            if(this.props.compoundExtent<100){
                this.props.compoundExtent+=1;
                this.paint();
                timer = requestAnimationFrame(fn);
            }else{
                cancelAnimationFrame(timer);
                this.props.compoundExtent = 0;
                this.paint();
            } 
        }
        let timer = requestAnimationFrame(fn);
    }

    public close(e: any) {
        this.ok && this.ok();
    }
}