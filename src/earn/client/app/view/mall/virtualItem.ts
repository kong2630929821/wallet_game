/**
 * 兑换虚拟奖品列表
 */

import { getModulConfig } from '../../../../../app/publicLib/modulConfig';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

export interface VirtualItemProps {
    convertCount: 0;
    desc: string;       // 商品描述
    id: number;         // 商品id
    leftCount: 1;
    level: 1;
    name: string;       // 商品名称
    pic: string;        // 商品图片
    progress: string;   // 兑换流程
    stCount: number;    // st数量
    tips: string;       // 注意事项
    value: string;      // 价值
}

export class VirtualItem extends Widget {

    public props:any = {
    };

    public setProps(props:VirtualItemProps) {
        this.props = {
            ...props,
            stShow:getModulConfig('KT_SHOW')
        };
        super.setProps(this.props);
    }

    /**
     * 商品详情
     * @param index 序号
     */
    public goProductDetail(index:number) {
        popNew('earn-client-app-view-mall-exchangeDetail',this.props);
    }
}