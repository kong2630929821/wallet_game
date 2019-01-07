/**
 * 奖券兑换 --兑换记录
 */

import { Widget } from '../../../../../pi/widget/widget';
import { getExchangeHistory } from '../../net/rpc';

interface Props {
    type:number;
    history:any;
}

export class ExchangeHistory extends Widget {
    public ok: () => void;

    public props:Props = {
        type :0,
        history:[
            {
                img:'../../res/image/dividend_history_none.png',
                name:'haha',
                time:'2018.12.28'
            }
        ]
    };

    public create() {
        super.create();
        this.initData();
    }

    public initData() {
        getExchangeHistory().then((res:any) => {
            this.props.history = res.awards;
            this.paint();
        });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}