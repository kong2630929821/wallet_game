/**
 * mine
 */
import { getRealNode } from '../../../../../../pi/widget/painter';
import { Widget } from '../../../../../../pi/widget/widget';
import { getMiningMaxHp } from '../../../utils/util';
import { MineType } from '../../../xls/mineType.s';

interface Props {
    mineType:MineType;
    hp:number;
    selected:boolean;
    lossHp:number;
    beginMining:boolean;
}
export class Mine extends Widget {
    public props:any;
    public $parent:any;
    public $imgContainer:any;
    public setProps(props:Props,oldProps:Props) {
        let imgUrl = '../../../res/image/';
        let hpMax = 0;
        if (props.mineType === MineType.SmallMine) {
            imgUrl = props.selected ? `${imgUrl}small_mine_active.png` :`${imgUrl}small_mine.png`;
            hpMax = getMiningMaxHp(MineType.SmallMine);
        } else if (props.mineType === MineType.MidMine) {
            imgUrl = props.selected ? `${imgUrl}mid_mine_active.png` : `${imgUrl}mid_mine.png`;
            hpMax = getMiningMaxHp(MineType.MidMine);
        } else {
            imgUrl = props.selected ? `${imgUrl}big_mine_active.png` : `${imgUrl}big_mine.png`;
            hpMax = getMiningMaxHp(MineType.BigMine);
        }
       
        this.props = {
            ...props,
            hpMax,
            imgUrl
        };
        super.setProps(this.props,oldProps);

    }

    public mineClick(event:any) {
        this.$imgContainer = this.$imgContainer || getRealNode(event.node.children[0]);
        this.$imgContainer.className = `animated rubberBand`;
        setTimeout(() => {
            this.$imgContainer.className = '';
        },1000);
        if (!this.props.selected) return;
        this.$parent = this.$parent || getRealNode(event.node);
        const $rock = document.createElement('div');
        $rock.setAttribute('class', 'rock');
        const left = Math.random() * 200;
        const style = `position:absolute;font-size:38px;left:${left}px`;
        $rock.setAttribute('style', style);
        // tslint:disable-next-line:no-inner-html
        $rock.innerHTML = `${this.props.lossHp}`;
        
        this.$parent.appendChild($rock);
        const v0 = Math.random() * 500 + 300;  // 初始加速度 300 --- 800
        const deg = Math.random() * 120 + 30;  //  初始速度方向  30 --- 150
        const rad = deg / 360 * 2 * Math.PI;   // 弧度
        const g = Math.random() * 500 + 500;   // 重力加速度  500 --- 1000
        const duration = Math.floor(Math.random() * 500 + 1500); // 动画持续时间  1500 --- 2000 ms
        this.domMove($rock,v0,rad,g,duration,new Date().getTime());
    }

    /**
     * 斜抛运动轨迹
     * @param $childDom 运动的dom
     * @param v0  初始加速度
     * @param rad 弧度
     * @param g 重力加速度
     * @param tStart 开始时间
     */
    public domMove($childDom:any,v0:number,rad:number,g:number,duration:number,tStart:number) {
        const tEnd = new Date().getTime();
        const interval = tEnd - tStart;
        const t = interval / 1000;
        const x = v0 * t * Math.cos(rad);
        const y = v0 * t * Math.sin(rad) - g * t * t / 2;
        $childDom.style.transform = `translate(${x}px,${-y}px)`;
        if (interval < duration) {
            requestAnimationFrame(() => {
                this.domMove($childDom,v0,rad,g,duration,tStart);
            });
        } else {
            this.$parent.removeChild($childDom);
        }
    }

}