/**
 * 竞猜主页-全部
 */

import { Widget } from '../../../../../../pi/widget/widget';
import { getAllGuess } from '../../../net/rpc';

export class AllGuess extends Widget {
    public ok: () => void;
    
    public props:any = {
        guessList:[]
    };

    public create () {
        super.create();
        getAllGuess().then((res:any[]) => {
            this.props.guessList = this.processData(res);
            this.paint();
        });
        
    }

    public processData(ary:any[]) {
        const map = {};
        const list = [];
        ary.forEach(element => {
            const timeStr = element.time.slice(0,10);
            if (!map[timeStr]) {
                list.push({
                    time:timeStr,
                    week:element.week,
                    data:[element]
                });
                map[timeStr] = timeStr;
            } else {
                list.forEach(element1 => {
                    if (element1.time.slice(0,10) === timeStr) {
                        element1.data.push(element);

                    }
                });
            }
        });
        console.log(list);
        
        return list;
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}