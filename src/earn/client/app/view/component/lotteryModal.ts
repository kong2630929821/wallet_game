/**
 * 中奖提示
 */

import { Widget } from "../../../../../pi/widget/widget";


interface Props{
    prizeName:string;//中奖名字
    prizeImg:string;//中奖图片
}

export class LotteryModal extends Widget {
    public ok: () => void;

    public close(e: any) {
        this.ok && this.ok();
    }
}