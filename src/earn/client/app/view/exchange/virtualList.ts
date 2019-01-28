/**
 * 兑换虚拟奖品列表
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getVirtualExchangeList } from '../../utils/util';
import { MallType } from './exchange';

interface Props {
    exchangeType:MallType;
}

export class ExchangeVirtual extends Widget {

    public props:any = {
        list: [0,0,0,0,0,0],
        exchangeType:''
    };

    public setProps(props:Props) {
        super.setProps(this.props);
        this.props = {
            ...this.props,
            exchangeType:props.exchangeType,
            stShow:getModulConfig('ST_SHOW')
        };
        this.initData();
    }
    public initData() {
        this.props.list = getVirtualExchangeList('level',this.props.exchangeType);
        console.log('list--------------', this.props.list);
        this.paint();
    }

    /**
     * 商品详情
     * @param index 序号
     */
    public goProductDetail(index:number) {
        popNew('earn-client-app-view-exchange-exchangeDetail',{ detail:this.props.list[index] });
    }
}