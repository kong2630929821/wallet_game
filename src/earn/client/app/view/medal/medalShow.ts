/**
 * 勋章成就 --主页
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { Widget } from '../../../../../pi/widget/widget';
import { getACHVmedalList, getMedalList } from '../../utils/util';

export enum MedalType {
    rankMedal = 0,  // 等级勋章
    ACHVmedal = 1   // 成就勋章
}

interface Props {
    medalSite: any; // 勋章坐标位置
    medalId: number; // 勋章图片编号
    isHave:boolean; // 是否拥有
    medalType:number; // 勋章类型
}

export class MedalShow extends Widget {
    public ok: () => void;
    public props: any = {
        ktShow:getModulConfig('KT_SHOW'),
        medalImg: '',
        medalSite: {}, // 勋章坐标位置
        imgScale: 1, // 勋章图片缩放倍数
        moveX: 0, // 勋章X轴位移
        moveY: 0, // 勋章Y轴位移
        condition: 0, // 勋章获得条件
        medalTitle:{} // 勋章称号
    };

    public setProps(props: Props) {
        super.setProps(this.props);
        let medalInfo;
        if (props.medalType === 0) {  
            medalInfo = getMedalList(props.medalId,'id');
            this.props.condition = medalInfo[0].coinNum;
            this.props.medalTitle = { zh_Hans:medalInfo[0].desc,zh_Hant:medalInfo[0].descHant,en:'' };
        } else if (props.medalType === 1) {
            medalInfo = getACHVmedalList(props.medalId,'id');
            this.props.condition = '挖到0.5ETH取得成就';
            this.props.medalTitle = { zh_Hans:medalInfo[0].desc,zh_Hant:medalInfo[0].descHant,en:'' };
        }
        
        this.props = {
            ...this.props,
            medalId: props.medalId,
            medalImg: `medal${props.medalId}`,
            medalSite: props.medalSite,
            
            isHave:props.isHave,
            medalType:props.medalType
        };
    }

    public attach() {
        this.computeSite();
    }

    /**
     * 计算原来位置、大小
     */
    public computeSite() {
        const $medal = document.getElementById('medalShow').getBoundingClientRect();
        const clientWidth = document.documentElement.clientWidth;
        const scaling = clientWidth / 750;// 页面缩放比例
        this.props.imgScale = this.props.medalSite.width / $medal.width;
        this.props.moveX = Math.round((this.props.medalSite.left - $medal.left) - ($medal.width - this.props.medalSite.width) / 2) / scaling;
        this.props.moveY = Math.round((this.props.medalSite.top - $medal.top) - ($medal.height - this.props.medalSite.height) / 2) / scaling;
        this.paint();
        setTimeout(() => {
            this.props.imgScale = 1;
            this.props.moveX = 0;
            this.props.moveY = 0;
            this.paint();
        }, 200);

    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}
