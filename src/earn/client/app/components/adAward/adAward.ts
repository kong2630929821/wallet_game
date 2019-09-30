import { topHeight } from '../../../../../app/public/config';
import { getStore } from '../../../../../app/store/memstore';
import { Widget } from '../../../../../pi/widget/widget';
import { HoeType } from '../../xls/hoeType.s';

/**
 * 广告奖励动画awardShow
 */
interface Props {
    hoeType:number;
    moveTop:number;
}
// tslint:disable-next-line:completed-docs
export class AdAward extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:any) {
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
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        setTimeout(() => {
            getStore('setting/topHeight',topHeight).then(topHeight => {
                const move = document.getElementById('awardMove').offsetTop;
                this.props.awardOut = true;
                this.props.moveX = -265;
                this.props.moveY = -move - this.props.moveTop - topHeight;
                this.props.imgScale = 0.2;
                this.paint();
                setTimeout(() => {
                    this.ok && this.ok();
                },1200);
            });
           
        },300);
    }
 
}