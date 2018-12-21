/**
 * digging mines home
 */
import { popNew } from '../../../../../../pi/ui/root';
import { Forelet } from '../../../../../../pi/widget/forelet';
import { Widget } from '../../../../../../pi/widget/widget';
import { Item, Item_Enum, MiningResponse } from '../../../../../server/data/db/item.s';
import { RandomSeedMgr } from '../../../../../server/util/randomSeedMgr';
import { readyMining, startMining } from '../../../net/rpc';
import { register } from '../../../store/memstore';
import { hoeUseDuration, MineMax } from '../../../utils/constants';
import { calcMiningArray, getHoeCount, randomMines } from '../../../utils/util';
import { HoeType } from '../../../xls/hoeType.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class MiningHome extends Widget {
    public ok:() => void;
    public props:any;
    public hits:number[] = [];
    public create() {
        super.create();
        this.init();
    }

    public init() {
        const mines = randomMines();
        const curMines = mines.splice(0,MineMax); 
        const leftMines = mines;
        console.log('curMines = ',curMines);
        console.log('leftMines = ',leftMines);
        const mineStyle = [
            'left:50%;top:-70px;transform: translateX(-50%);',
            'left:-20px;top:190px;',
            'right:-10px;top:220px;',
            'right:100px;top:480px;'
        ];
        this.props = {
            mineStyle,
            ironHoe:getHoeCount(HoeType.IronHoe),     // 铁锄头数量
            goldHoe:getHoeCount(HoeType.GoldHoe),     // 金锄头数量
            diamondHoe:getHoeCount(HoeType.DiamondHoe),     // 钻石锄头数量
            hoeType:HoeType,   // 锄头类型
            hoeSelected:-1,    // 选中的锄头
            mineType:-1,       // 选中的矿山类型 
            mineIndex:-1,     // 选中的矿山index
            countDownStart:false,  // 是否开始倒计时
            miningCount:0,             // 挖矿次数
            countDown:hoeUseDuration,  // 倒计时时间
            countDownTimer:0,        // 倒计时定时器
            miningTips:'请选择锄头',   // 挖矿提示
            curMines,          // 当前显示的矿山
            leftMines,          // 剩余的矿山
            lossHp:1,           // 当前掉血数
            allAwardType:Item_Enum,// 奖励所有类型
            awardType:0,   // 矿山爆掉的奖励类型
            awardNumber:0          // 奖励数目
        };

    }

    public signInClick() {
        popNew('earn-client-app-view-activity-mining-signIn');
    }
    public closeClick() {
        this.ok && this.ok();
    }
    public selectHoeClick(e:any,hopeType:HoeType) {
        console.log('select index',hopeType);
        this.props.hoeSelected = hopeType;
        this.props.miningTips = '请选择矿山';
        this.paint();
    }

    public mineClick(e:any,itype:number,index:number) {
        // console.log(index,itype);
        // 没有选中锄头
        if (this.props.hoeSelected < 0) return;

        // 没有选矿山
        if ((this.props.mineIndex !== index || this.props.mineType !== itype) && !this.props.countDownStart) {
            this.props.mineIndex = index;
            this.props.mineType = itype;
            this.props.miningTips = '准备开始挖矿';
            this.paint();

            return;
        }

        // 中途挖其他矿去了
        if (this.props.mineIndex !== index || this.props.mineType !== itype) return;
        // 准备开始挖矿
        if (!this.props.countDownStart) {
            readyMining(this.props.hoeSelected).then((r:RandomSeedMgr) => {
                if (this.props.hoeSelected === HoeType.IronHoe) {
                    this.props.ironHoe--;
                } else if (this.props.hoeSelected === HoeType.GoldHoe) {
                    this.props.goldHoe--;
                } else {
                    this.props.diamondHoe--;
                }
                const hits = calcMiningArray(this.props.hoeSelected,r.seed);
                this.hits = hits;
                this.paint();
            });
            this.props.countDownStart = true;
            this.props.miningTips = `倒计时 ${this.props.countDown} S`;
            this.countDown();
            this.paint();

            return;
        }

        this.props.miningCount++;
        this.bloodLoss();

        this.paint();
    }

    // 矿山掉血
    public bloodLoss() {
        for (let i = 0; i < this.props.curMines.length; i++) {
            const mine = this.props.curMines[i];
            if (mine.type === this.props.mineType && mine.index === this.props.mineIndex) {
                this.props.lossHp = this.hits[this.props.miningCount - 1];
                mine.hp -= this.props.lossHp;
                if (mine.hp <= 0) {
                    // this.deleteBoomMine();
                    this.initMiningState();
                }
                break;
            }
        }
    }

    // 爆炸矿山消失
    public deleteBoomMine() {
        this.props.curMines = this.props.curMines.filter(item => {
            return item.type !== this.props.mineType || item.index !== this.props.mineIndex;
        });
        this.paint();
    }
    public countDown() {
        this.props.countDownTimer = setTimeout(() => {
            this.countDown();
            this.props.countDown--;
            this.props.miningTips = `倒计时 ${this.props.countDown} S`;
            if (!this.props.countDown) {
                this.initMiningState();
            }
            this.paint();
        },1000);
    }

    public initMiningState() {
        startMining(this.props.mineType,this.props.mineIndex,this.props.miningCount).then((r:MiningResponse) => {
            if (r.leftHp <= 0) {
                this.props.awardType = r.award.enum_type;
                this.props.awardNumber = r.award.value.count;
                this.paint();
            }
        });
        this.props.mineIndex = -1;
        this.props.mineType = -1;
        this.props.countDownStart = false;
        this.props.countDown = hoeUseDuration;
        this.props.hoeSelected = -1;
        this.props.miningTips = '请选择锄头';
        console.log(`挖了${this.props.miningCount}次`);
        
        this.props.miningCount = 0;
        clearTimeout(this.props.countDownTimer);
    }
    public updateHoe() {
        this.props.ironHoe = getHoeCount(HoeType.IronHoe);
        this.props.goldHoe = getHoeCount(HoeType.GoldHoe);
        this.props.diamondHoe = getHoeCount(HoeType.DiamondHoe);
        this.paint();
    }
}

// ===================================================== 立即执行

register('goods',(goods:Item[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateHoe();
});