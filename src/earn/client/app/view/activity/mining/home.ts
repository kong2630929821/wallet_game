/**
 * digging mines home
 */
import { popNew } from '../../../../../../pi/ui/root';
import { Forelet } from '../../../../../../pi/widget/forelet';
import { Widget } from '../../../../../../pi/widget/widget';
import { Item, Item_Enum, MiningResponse } from '../../../../../server/data/db/item.s';
import { RandomSeedMgr } from '../../../../../server/util/randomSeedMgr';
import { getAllGoods, getTodayMineNum, readyMining, startMining } from '../../../net/rpc';
import { getStore, register } from '../../../store/memstore';
import { hoeUseDuration } from '../../../utils/constants';
import { calcMiningArray, getAllMines, getHoeCount, shuffle } from '../../../utils/util';
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
    public mineStyle:string[] = [
        'right:98px;top:370px;',
        'left:145px;top:395px;',
        'right:110px;top:505px;',
        'left:108px;top:578px;',
        'right:177px;top:710px;',
        'left:56px;top:786px;',
        'right:0px;top:854px;',
        'left:239px;top:870px;'
    ];
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.props = {
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
            havMines:getAllMines(),          // 拥有的矿山
            lossHp:1,           // 当前掉血数
            allAwardType:Item_Enum,// 奖励所有类型
            awardType:0,   // 矿山爆掉的奖励类型
            awardNumber:0,          // 奖励数目
            miningedNumber:getStore('mine/miningedNumber')  // 已挖矿山数目
        };
        this.mineLocationInit();   // 矿山位置初始化
        getTodayMineNum();
    }

    public signInClick() {
        popNew('earn-client-app-view-activity-mining-signIn');
    }

    public welfareClick() {
        popNew('earn-client-app-view-activity-mining-welfare');
    }

    public closeClick() {
        this.ok && this.ok();
    }

    public mineLocationInit() {
        const mineStyle = shuffle(this.mineStyle);
        for (let i = 0;i < this.props.havMines.length;i++) {
            this.props.havMines[i].location = mineStyle[i];
        }
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
                // if (this.props.hoeSelected === HoeType.IronHoe) {
                //     this.props.ironHoe--;
                // } else if (this.props.hoeSelected === HoeType.GoldHoe) {
                //     this.props.goldHoe--;
                // } else {
                //     this.props.diamondHoe--;
                // }
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
        for (let i = 0; i < this.props.havMines.length; i++) {
            const mine = this.props.havMines[i];
            if (mine.type === this.props.mineType && mine.index === this.props.mineIndex) {
                this.props.lossHp = this.hits[this.props.miningCount - 1];
                mine.hp -= this.props.lossHp;
                if (mine.hp <= 0) {
                    this.deleteBoomMine();
                    this.initMiningState();
                }
                break;
            }
        }
    }

    // 爆炸矿山消失
    public deleteBoomMine() {
        this.props.havMines = this.props.havMines.filter(item => {
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
                getAllGoods();
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
    public updateMine() {
        this.props.ironHoe = getHoeCount(HoeType.IronHoe);
        this.props.goldHoe = getHoeCount(HoeType.GoldHoe);
        this.props.diamondHoe = getHoeCount(HoeType.DiamondHoe);
        // this.props.havMines = getAllMines();
        this.props.miningedNumber = getStore('mine/miningedNumber');
        this.paint();
    }
}

// ===================================================== 立即执行

register('mine',(goods:Item[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateMine();
});
