/**
 * digging stones home
 */
import { hoeUseDuration } from '../../../../../../app/utils/constants';
import { Widget } from '../../../../../../pi/widget/widget';
export class DiggingStonesHome extends Widget {
    public ok:() => void;
    public props:any;
    public create() {
        this.props = {
            hoeSelected:-1,
            stoneType:0,
            stoneIndex:-1,
            countDownStart:false,
            diggingCount:0,
            countDown:hoeUseDuration,
            countDownTimer:0,
            diggingTips:'请选择锄头'
        };
    }

    public init() {
        this.props = {
            hoeSelected:-1,    // 选中的锄头
            stoneType:0,       // 选中的矿山类型 
            stoneIndex:-1,     // 选中的矿山index
            countDownStart:false,  // 
            diggingCount:0,
            countDown:hoeUseDuration,
            countDownTimer:0,
            diggingTips:'请选择锄头'
        };
    }
    public closeClick() {
        this.ok && this.ok();
    }
    public selectHoeClick(e:any,index:number) {
        console.log('select index',index);
        this.props.hoeSelected = index;
        this.props.diggingTips = '请选择矿山';
        this.paint();
    }

    public stoneClick(e:any,index:number,itype:number) {
        console.log(index,itype);
        // 没有选中锄头
        if (this.props.hoeSelected < 0) return;

        // 没有选矿山
        if (this.props.stoneIndex === -1 && !this.props.stoneType) {
            this.props.stoneIndex = index;
            this.props.stoneType = itype;
            this.props.diggingTips = '准备开始挖矿';
            this.paint();

            return;
        }

        // 准备开始挖矿
        if (!this.props.countDownStart) {
            this.props.countDownStart = true;
            this.props.diggingTips = `倒计时 ${this.props.countDown} S`;
            this.countDown();
            this.paint();

            return;
        }

        this.props.diggingCount++;
       
    }

    public countDown() {
        this.props.countDownTimer = setTimeout(() => {
            this.countDown();
            this.props.countDown--;
            this.props.diggingTips = `倒计时 ${this.props.countDown} S`;
            if (!this.props.countDown) {
                this.props.countDownStart = false;
                this.props.countDown = hoeUseDuration;
                this.props.hoeSelected = -1;
                this.props.diggingTips = '请选择锄头';
                clearTimeout(this.props.countDownTimer);
            }
            this.paint();
        },1000);
    }
}