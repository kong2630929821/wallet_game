/**
 * 中奖提示
 */

import { Widget } from '../../../../../pi/widget/widget';
import { coinUnitchange } from '../../utils/tools';
import { getPrizeInfo } from '../../utils/util';

interface Props {
    fadeOut:boolean;
    prizeType:number;// 奖品编号
    prizeName:any;// 奖品名字
    prizeNum:number;// 奖品数量
    prizeUnit:any;// 奖品单位
    btn?:string;// 按钮
}

export class LotteryModal extends Widget {
    public ok: () => void;
    public props:Props;
    public setProps(props:any) {
        super.setProps(props);
        console.log('!!!!!!!!!!!!!!!!!!!!!!lotterymodal',props);
        const prize = getPrizeInfo(props.awardType);
        
        this.props = {
            ...props,
            fadeOut:false,
            prizeType:props.awardType,
            prizeName:{ zh_Hans:`${prize.zh_hans}`,zh_Hant:`${prize.zh_hant}`,en:'' },
            prizeNum: coinUnitchange(props.awardType,props.count),
            prizeUnit:{ zh_Hans:`${prize.unit}`,zh_Hant:`${prize.unit}`,en:'' }
        };
        
    } 
    public close() {
        this.props.fadeOut = true;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok();
        },300);
    }
}