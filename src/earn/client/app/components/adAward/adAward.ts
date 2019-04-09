import { Widget } from '../../../../../pi/widget/widget';
import { HoeType } from '../../xls/hoeType.s';

/**
 * 广告奖励动画awardShow
 */
interface Props {
    hoeType:number;
}
// tslint:disable-next-line:completed-docs
export class AdAward extends Widget {
    public ok:() => void;
    public setProps(props:any,oldProps:any) {
        let imgUrl = '../../res/image/';
        if (props.hoeType === HoeType.IronHoe) {
            imgUrl = `${imgUrl}2001.png`;
        } else if (props.hoeType === HoeType.GoldHoe) {
            imgUrl = `${imgUrl}2002.png`;
        } else {
            imgUrl = `${imgUrl}2003.png`;
        }
        this.props = {
            ...props,
            imgUrl,
            awardOut:false,
            moveX:0,
            moveY:0,
            imgScale:1
        };
        super.setProps(this.props,oldProps);
        setTimeout(() => {
            this.props.awardOut = true;
            this.props.moveX = -265;
            this.props.moveY = -549;
            this.props.imgScale = 0.2;
            this.paint();
            setTimeout(() => {
                this.ok && this.ok();
            },2400);
        },300);
       
    }
 
}