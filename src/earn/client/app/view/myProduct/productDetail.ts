/**
 * 我的物品 --物品详情
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { copyToClipboard } from '../../../../../app/utils/tools';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    orderDetail:{        // 订单信息
        id: string;
        awardType: number;
        count: number;
        uid: number;
        src: string;
        time: string;
        desc: string;
        convert: string;
        deadTime: string;
    };   
    detailType:number;   // 0:兑换成功 1：物品列表,
    stShow:string;       //  ST名字;
}

export class ProductDetail extends Widget {
    public ok: () => void;

    public props:Props = {
        orderDetail:{
            id: '',
            awardType: 0,
            count: 0,
            uid: 0,
            src: '',
            time: '',
            desc: '',
            convert: '',
            deadTime: ''
        },
        detailType:0,
        stShow:''
    };

    public setProps(props:any) {
        this.props = {
            ...props,
            stShow:getModulConfig('ST_SHOW'),
            convertInfo:{}  // 兑换物品信息
        };
        super.setProps(this.props);
        console.log(this.props);
        
        this.paint();
    }

    /**
     * 复制兑换码
     */
    public codeCopy() {
        // copyToClipboard(this.props.inviteCode);
        copyToClipboard(this.props.orderDetail.convert);
    } 

    /**
     * 点击效果
     */
    public btnClick(e: any , eventType: number, eventValue?:any) {
        const $dom = getRealNode(e.node);
        $dom.className = 'btnClick';
        setTimeout(() => {
            $dom.className = '';
        }, 100);
        switch (eventType) { // 复制兑换码
            case 0:
                this.codeCopy();
                break;
            
            default:
        }
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}