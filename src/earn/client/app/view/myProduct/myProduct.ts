/**
 * 我的物品、中奖记录
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getAwardHistory } from '../../net/rpc';

interface Props {
    type: number;
    history: any;
}

export class MyProduct extends Widget {
    public ok: () => void;
    public props:Props = {
        type: 0,
        history:[]
    };

    public setProps(props: any) {
        super.setProps(this.props);
        this.props = {
            ...this.props,
            type: props.type
        };
        this.initData();
    }

    /**
     * 初始化数据
     */
    public initData() {
        
        getAwardHistory(this.props.type).then((res:any) => {
            if (this.props.type === 0) {
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
        if (this.props.history[index].pid < 2000 || this.props.history[index].pid > 2100) {// 排除锄头系列
            popNew('earn-client-app-view-myProduct-productDetail', { name: this.props.history[index].name, detailType: 1 });
        }
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}