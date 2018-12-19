/**
 * digging stones home
 */
import { Forelet } from '../../../../../../pi/widget/forelet';
import { Widget } from '../../../../../../pi/widget/widget';
import { Item } from '../../../../../server/data/db/item.s';
import { beginMining } from '../../../net/rpc';
import { register } from '../../../store/memstore';
import { hoeUseDuration, stonesMax } from '../../../utils/constants';
import { getHoeCount, randomStones } from '../../../utils/util';
import { HoeType } from '../../../xls/hoeType.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class DiggingStonesHome extends Widget {
    public ok:() => void;
    public props:any;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        const stones = randomStones();
        const curStones = stones.splice(0,stonesMax); 
        const leftStones = stones;
        console.log('curStones = ',curStones);
        console.log('leftStones = ',leftStones);
        const stoneStyle = [
            'left:50%;top:-70px;transform: translateX(-50%);',
            'left:-20px;top:190px;',
            'right:-10px;top:220px;',
            'right:100px;top:480px;'
        ];
        this.props = {
            stoneStyle,
            copperHoe:getHoeCount(HoeType.CopperHoe),     // 铜锄头数量
            silverHoe:getHoeCount(HoeType.SilverHoe),     // 银锄头数量
            goldHoe:getHoeCount(HoeType.GoldHoe),       // 金锄头数量
            hoeType:HoeType,   // 锄头类型
            hoeSelected:-1,    // 选中的锄头
            stoneType:-1,       // 选中的矿山类型 
            stoneIndex:-1,     // 选中的矿山index
            countDownStart:false,  // 
            diggingCount:0,
            countDown:hoeUseDuration,
            countDownTimer:0,
            diggingTips:'请选择锄头',
            curStones,          // 当前显示的矿山
            leftStones          // 剩余的矿山
        };
    }

    public closeClick() {
        this.ok && this.ok();
    }
    public selectHoeClick(e:any,hopeType:HoeType) {
        console.log('select index',hopeType);
        this.props.hoeSelected = hopeType;
        this.props.diggingTips = '请选择矿山';
        this.paint();
    }

    public stoneClick(e:any,itype:number,index:number) {
        console.log(index,itype);
        // 没有选中锄头
        if (this.props.hoeSelected < 0) return;

        // 没有选矿山
        if ((this.props.stoneIndex !== index || this.props.stoneType !== itype) && !this.props.countDownStart) {
            this.props.stoneIndex = index;
            this.props.stoneType = itype;
            this.props.diggingTips = '准备开始挖矿';
            this.paint();

            return;
        }

        // 中途挖其他矿去了
        if (this.props.stoneIndex !== index || this.props.stoneType !== itype) return;
        // 准备开始挖矿
        if (!this.props.countDownStart) {
            beginMining(this.props.hoeSelected);
            this.props.countDownStart = true;
            this.props.diggingTips = `倒计时 ${this.props.countDown} S`;
            this.countDown();
            this.paint();

            return;
        }

        this.props.diggingCount++;
        this.paint();
    }

    public countDown() {
        this.props.countDownTimer = setTimeout(() => {
            this.countDown();
            this.props.countDown--;
            this.props.diggingTips = `倒计时 ${this.props.countDown} S`;
            if (!this.props.countDown) {
                this.props.stoneIndex = -1;
                this.props.stoneType = -1;
                this.props.countDownStart = false;
                this.props.countDown = hoeUseDuration;
                this.props.hoeSelected = -1;
                this.props.diggingTips = '请选择锄头';
                console.log(`挖了${this.props.diggingCount}次`);
                this.props.diggingCount = 0;
                clearTimeout(this.props.countDownTimer);
            }
            this.paint();
        },1000);
    }

}

// ===================================================== 立即执行

register('goods',(goods:Item[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.init();
    w && w.paint();
});