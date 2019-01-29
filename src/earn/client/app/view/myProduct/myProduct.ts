/**
 * 我的物品、中奖记录
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getAwardHistory } from '../../net/rpc';
import { AwardSrcNum } from '../../xls/dataEnum.s';

interface Props {
    historyType:AwardSrcNum;
    history: any;
}

export class MyProduct extends Widget {
    public ok: () => void;
    public props:Props = {
        historyType: 0,
        history:[]
    };

    public setProps(props: any) {
        super.setProps(this.props);
        this.props = {
            ...this.props,
            historyType: props.type
        };
        this.initData();
    }

    /**
     * 初始化数据
     */
    public initData() {
        
        getAwardHistory(this.props.historyType).then((res:any) => {
            if (this.props.historyType === 0) {
                const dealData = [];
                res.forEach(element => {
                    if (element.pid < 2000 || element.pid > 2100) {// 排除锄头系列
                        dealData.push(element);
                    } 
                });
                this.props.history = dealData;
            } else {
                this.props.history = res;
            }
            
            this.paint();
        });
    }

    public goProductDetail(index: number) {
        if (this.props.history[index].pid > 500000) {// 虚拟物品进入详情
            popNew('earn-client-app-view-myProduct-productDetail', { name: this.props.history[index].name, detailhistoryType: 1 });
        }
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}