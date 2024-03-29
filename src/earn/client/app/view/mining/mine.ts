/**
 * mine
 */
import { RES_TYPE_BLOB, ResTab } from '../../../../../pi/util/res_mgr';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { getMiningMaxHp } from '../../utils/util';
import { HoeType } from '../../xls/hoeType.s';
import { MineType } from '../../xls/mineType.s';

interface Props {
    mineType:MineType;    // 矿山类型
    mineId:number;        // 矿山id
    hp:number;             // 剩余hp
    selectedHoe:HoeType;   // 选中的锄头
    selected:boolean;     // 是否选中当前矿山
    lossHp:number;        // 一次挖矿掉血量
    beginMining:boolean;   // 是否开始挖矿
    hoeSelectedLeft:number; // 选中的锄头剩余数
    scale:number; // 等比放大倍数
    countDown:number;   // 倒计时
}
export class Mine extends Widget {
    public props:any;
    public $parent:any;
    public $imgContainer:any;
    public $hoe:any;
    public setProps(props:Props,oldProps:Props) {
        let mineImgUrl = '../../res/image/';
        let hpMax = 0;
        if (props.mineType === MineType.SmallMine) {
            mineImgUrl = props.selected ? `${mineImgUrl}small_mine_active.png` :`${mineImgUrl}small_mine.png`;
            hpMax = getMiningMaxHp(MineType.SmallMine);
        } else if (props.mineType === MineType.MidMine) {
            mineImgUrl = props.selected ? `${mineImgUrl}mid_mine_active.png` : `${mineImgUrl}mid_mine.png`;
            hpMax = getMiningMaxHp(MineType.MidMine);
        } else {
            mineImgUrl = props.selected ? `${mineImgUrl}big_mine_active.png` : `${mineImgUrl}big_mine.png`;
            hpMax = getMiningMaxHp(MineType.BigMine);
        }
       
        let hoeImgUrl = '../../res/image/';

        if (props.selectedHoe === HoeType.IronHoe) {
            hoeImgUrl = `${hoeImgUrl}2001.png`;
        } else if (props.selectedHoe === HoeType.GoldHoe) {
            hoeImgUrl = `${hoeImgUrl}2002.png` ;
        } else {
            hoeImgUrl = `${hoeImgUrl}2003.png`;
        }

        this.props = {
            ...props,
            hpMax,
            mineImgUrl,
            hoeImgUrl
        };
        super.setProps(this.props,oldProps);
    }
    public attach() {
        super.attach();
        // 不知道为啥执行以下代码后活动首页滑动不卡顿了   神奇 神奇 神奇
        this.$imgContainer = this.$imgContainer || getRealNode((<any>(this.tree)).children[0]);
        this.$imgContainer.className = '';
        requestAnimationFrame(() => {
            this.$imgContainer.className = `mine-animated`;
        });
    }

    public mineClick(event:any) {
        this.$imgContainer = this.$imgContainer || getRealNode(event.node.children[0]);
        this.$imgContainer.className = '';
        requestAnimationFrame(() => {
            this.$imgContainer.className = `mine-animated`;
        });
        if (!this.props.selected || this.props.hp <= 0 || !this.props.beginMining) {
            console.log('mine =========',this.props);
            notify(event.node,'ev-mine-click',{ itype:this.props.mineType,mineId:this.props.mineId });

            return;
        }
        this.$hoe = getRealNode(event.node.children[2]);
        this.$hoe.className = '';
        requestAnimationFrame(() => {
            this.$hoe.className = `animated-hoeMining`;
        });
        
        this.$parent = this.$parent || getRealNode(event.node);
        const $rock = document.createElement('div');
        $rock.setAttribute('class', 'rock');
        const left = Math.random() * 200;
        const style = `position:absolute;font-size:38px;left:${left}px`;
        $rock.setAttribute('style', style);
        // tslint:disable-next-line:no-inner-html
        // $rock.innerHTML = `${this.props.lossHp}`;

        // type:
        // 取图片: RES_TYPE_BLOB: 返回BlobURL;
        // 取二进制: RES_TYPE_RES_TYPE_FILE: 返回ArrayBuffer;
        const imgSrc = 'earn/client/app/res/image/mining_gold.png';
        const resTab = new ResTab();
        resTab.load(`${RES_TYPE_BLOB}:${imgSrc}`, RES_TYPE_BLOB, imgSrc, undefined, (blobURL) => {
            // console.log('resTab ====== success');
            const $goldImg = document.createElement('img');
            $goldImg.setAttribute('src',blobURL.link);
            $goldImg.setAttribute('style','width:40px;height:40px;');
            $rock.appendChild($goldImg);
            
            this.$parent.appendChild($rock);
            const v0 = Math.random() * 500 + 300;  // 初始加速度 300 --- 800
            const deg = Math.random() * 120 + 30;  //  初始速度方向  30 --- 150
            const rad = deg / 360 * 2 * Math.PI;   // 弧度
            const g = Math.random() * 500 + 500;   // 重力加速度  500 --- 1000
            const duration = Math.floor(Math.random() * 500 + 1000); // 动画持续时间  1500 --- 2000 ms
            this.domMove($rock,v0,rad,g,duration,new Date().getTime());
            notify(event.node,'ev-mine-click',{ itype:this.props.mineType,mineId:this.props.mineId });
        },() => {
            console.log('resTab ====== fail');
        });
    
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