/**
 * 奖券兑换 --兑换记录
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getExchangeHistory } from '../../net/rpc';

interface Props {
    historyList:any;
}

export class ExchangeHistory extends Widget {
    public ok: () => void;

    public props:Props = {
        historyList:[
            // {
            //     img:'../../res/image/dividend_history_none.png',
            //     name:'haha',
            //     time:'2018.12.28'
            // }
        ]
    };

    public create() {
        super.create();
        this.initData();
    }

    public initData() {
        getExchangeHistory().then((res:any) => {
            this.props.historyList = res.awards;
            this.paint();
        });
    }

    /**
     * 查看兑换详情
     * @param index 序号
     */
    public goDetail(index:number) {
        console.log(this.props.historyList[index]);
        popNew('earn-client-app-view-myProduct-productDetail', { orderDetail: this.props.historyList[index], detailType: 1 });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}