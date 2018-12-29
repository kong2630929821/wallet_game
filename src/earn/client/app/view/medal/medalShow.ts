/**
 * 勋章成就 --主页
 */

import { Widget } from '../../../../../pi/widget/widget';
import { cfg } from '../../../../../pi/ui/root';

interface Props {
    medalImg: string;
    medalsite: any;
    imgScale: number;
    moveX: number;
    moveY: number;
}

export class MedalShow extends Widget {
    public ok: () => void;
    public props: Props;

    public setProps(props: any) {
        console.log(props);

        super.setProps(this.props);
        this.props = {
            ...this.props,
            medalImg: props.img,
            medalsite: props.medalSite
        }

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
        const scaling = clientWidth / 750;//页面缩放比例
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

        console.log('$medal--------------', $medal);
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

