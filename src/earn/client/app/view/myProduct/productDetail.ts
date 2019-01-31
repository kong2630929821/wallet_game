/**
 * 我的物品 --物品详情
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { copyToClipboard } from '../../../../../app/utils/tools';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { getConvertInfo } from '../../net/rpc';

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
}

export class ProductDetail extends Widget {
    public ok: () => void;

    public setProps(props:Props) {
        this.props = {
            ...props,
            stShow:getModulConfig('ST_SHOW'),
            convertInfo:{
                convertCount: 0,
                desc: '...',
                id: 0,
                leftCount: 0,
                level: 0,
                name: '...',
                pic: '...',
                progress: '...',
                stCount: 0,
                tips: '...',
                value: '...'
            }  // 兑换物品信息
        };
        super.setProps(this.props);
        this.initData();
    }

    public initData() {
        getConvertInfo(this.props.orderDetail.awardType).then((res:any) => {
            this.props.convertInfo = res;
            this.paint();
        });
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