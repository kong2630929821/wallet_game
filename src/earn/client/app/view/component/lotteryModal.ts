/**
 * 中奖提示
 */

import { Widget } from "../../../../../pi/widget/widget";
import { getPrizeInfo } from "../../utils/util";


interface Props{
    prizeType:number;//奖品编号
    prizeName:any;//奖品名字
    prizeNum:number;//奖品数量
    prizeUnit:any;//奖品单位
}

export class LotteryModal extends Widget {
    public ok: () => void;
    public props:Props;
    public setProps(props:any){
        super.setProps(this.props);
        const prize = getPrizeInfo(props.data.num);
        
        this.props = {
            ...this.props,
            prizeType:props.data.num,
            prizeName:{"zh_Hans":`${prize.zh_hans}`,"zh_Hant":`${prize.zh_hant}`,"en":""},
            prizeNum:props.data.count,
            prizeUnit:{"zh_Hans":`${prize.unit}`,"zh_Hant":`${prize.unit}`,"en":""}
        }
        
    } 
    public close(e: any) {
        this.ok && this.ok();
    }
}