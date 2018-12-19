/**
 * stone
 */
import { getRealNode } from '../../../../../../pi/widget/painter';
import { Widget } from '../../../../../../pi/widget/widget';
import { bigStoneHpMax, midStoneHpMax, smallStoneHpMax } from '../../../utils/constants';
import { StoneType } from '../../../xls/stoneType.s';

interface Props {
    stoneType:StoneType;
    hp:number;
    selected:boolean;
}
export class Stone extends Widget {
    public props:any;
    public $dom:any;
    public setProps(props:Props,oldProps:Props) {
        console.log('Stone ',props);
        let imgUrl = '../../../res/image/';
        let hpMax = 0;
        if (props.stoneType === StoneType.SmallStone) {
            imgUrl = `${imgUrl}small_stone.png`;
            hpMax = smallStoneHpMax;
        } else if (props.stoneType === StoneType.MidStone) {
            imgUrl = `${imgUrl}mid_stone.png`;
            hpMax = midStoneHpMax;
        } else {
            imgUrl = `${imgUrl}big_stone.png`;
            hpMax = bigStoneHpMax;
        }
        this.props = {
            ...props,
            hpMax,
            imgUrl
        };
        super.setProps(this.props,oldProps);
    }

    public stoneClick(event:any) {
        if (!this.props.selected) return;
        const $rock = document.createElement('div');
        $rock.setAttribute('class', 'rock');
        const animationIndex = Math.floor(Math.random() * 10 + 1);
        // 可以在这里定义100个动画动态加载
        const style = `position:absolute;animation:diggingEnlarge${animationIndex} 0.5s ease;`;
        $rock.setAttribute('style', style);
        // tslint:disable-next-line:no-inner-html
        $rock.innerHTML = `0`;
        this.$dom = this.$dom || getRealNode(event.node);
        this.$dom.appendChild($rock);
        setTimeout(() => {
            this.$dom.removeChild($rock);
        },500);
    }
}