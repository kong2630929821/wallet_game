/**
 * 勋章成就 --主页
 */

import { Widget } from '../../../../../pi/widget/widget';
import { getMedalList } from '../../utils/util';

interface Props {
    medalImg: string; // 勋章图片
    medalsite: any; // 勋章坐标位置
    imgScale: number; // 勋章图片缩放倍数
    moveX: number; // 勋章X轴位移
    moveY: number; // 勋章Y轴位移
    KTnum: number; // 勋章需要kt数
    medalTitle:any; // 勋章称号
}

export class MedalShow extends Widget {
    public ok: () => void;
    public props: Props;

    public setProps(props: any) {
        super.setProps(this.props);
        const medalInfo = getMedalList(props.medalId,'id');
        
        this.props = {
            ...this.props,
            medalImg: `medal${props.medalId}`,
            medalsite: props.medalSite,
            KTnum:medalInfo[0].coinNum,
            medalTitle:{ zh_Hans:medalInfo[0].desc,zh_Hant:medalInfo[0].descHant,en:'' }
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
        this.props.imgScale = this.props.medalsite.width / $medal.width;
        this.props.moveX = Math.round((this.props.medalsite.left - $medal.left) - ($medal.width - this.props.medalsite.width) / 2) / scaling;
        this.props.moveY = Math.round((this.props.medalsite.top - $medal.top) - ($medal.height - this.props.medalsite.height) / 2) / scaling;
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
