/**
 * digging mines home
 */
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Item, Item_Enum, MiningResponse } from '../../../../server/data/db/item.s';
import { RandomSeedMgr } from '../../../../server/util/randomSeedMgr';
import { getMiningCoinNum, getRankList, getTodayMineNum, readyMining, startMining } from '../../net/rpc';
import { getStore, Mine, register, setStore } from '../../store/memstore';
import { hoeUseDuration, MineMax } from '../../utils/constants';
import { coinUnitchange, wathcAdGetAward } from '../../utils/tools';
import { calcMiningArray, getAllMines, getHoeCount, shuffle } from '../../utils/util';
import { HoeType } from '../../xls/hoeType.s';

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
        'right:305px;top:292px;',
        'left:165px;top:462px;',
        'right:118px;top:436px;',
        'left:128px;top:645px;',
        'right:197px;top:777px;',
        'left:76px;top:853px;',
        'right:22px;top:921px;',
        'left:259px;top:937px;'
    ];
    public hoeSelectDefault:boolean = false;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.props = {
            mineMax:MineMax,                     // 每天最多挖的矿山数
            ironHoe:getHoeCount(HoeType.IronHoe),     // 铁锄头数量
            goldHoe:getHoeCount(HoeType.GoldHoe),     // 金锄头数量
            diamondHoe:getHoeCount(HoeType.DiamondHoe),     // 钻石锄头数量
            hoeSelectedLeft:0,
            hoeType:HoeType,   // 锄头类型
            hoeSelected:-1,    // 选中的锄头
            mineType:-1,       // 选中的矿山类型 
            mineId:-1,     // 选中的矿山index
            countDownStart:false,  // 是否开始倒计时
            miningCount:0,             // 挖矿次数
            countDownMax:hoeUseDuration, // 倒计时最大值
            countDown:hoeUseDuration,  // 倒计时时间
            countDownTimer:0,        // 倒计时定时器
            haveMines:getAllMines(),          // 拥有的矿山
            lossHp:1,           // 当前掉血数
            allAwardType:Item_Enum,// 奖励所有类型
            awardTypes:{},    // 矿山爆掉的奖励类型
            miningedNumber:getStore('mine/miningedNumber'),  // 已挖矿山数目
            miningNumber:{
                KT:0,
                ST:0,
                ETH:0,
                BTC:0
            },     // 累计挖矿
            zIndex:-1            // z-index数值
        };
        this.mineLocationInit();   // 矿山位置初始化
    }

    public closeClick() {
        setStore('flags/earnHomeHidden',false);
    }

    /**
     * 矿山位置初始化
     */
    public mineLocationInit() {
        const mineStyle = shuffle(this.mineStyle);
        for (let i = 0;i < this.props.haveMines.length;i++) {
            if (this.props.haveMines[i].location) continue;
            this.props.haveMines[i].location = mineStyle[i];
        }
    }

    /**
     * 选择锄头
     */
    public selectHoeClick(e:any,hopeType:HoeType) {
        if (this.props.countDownStart) return;
        this.props.hoeSelected = hopeType;
        this.hoeSelectedLeft();
        this.paint();
    }

    /**
     * 默认选择锄头
     */
    public hoeSelectedDefault() {
        if (this.hoeSelectDefault) return;  // 只有第一次才默认选中锄头
        if (this.props.diamondHoe > 0) {
            this.props.hoeSelected =  HoeType.DiamondHoe;
        } else if (this.props.goldHoe > 0) {
            this.props.hoeSelected = HoeType.GoldHoe;
        } else if (this.props.ironHoe > 0) {
            this.props.hoeSelected = HoeType.IronHoe;
        } else {
            this.props.hoeSelected = -1;
        }
        this.hoeSelectDefault = true;
    }

    /**
     * 选中的锄头剩余数计算
     */
    public hoeSelectedLeft() {
        if (this.props.hoeSelected === HoeType.IronHoe) {
            this.props.hoeSelectedLeft =  this.props.ironHoe;
        } else if (this.props.hoeSelected === HoeType.GoldHoe) {
            this.props.hoeSelectedLeft = this.props.goldHoe;
        } else if (this.props.hoeSelected === HoeType.DiamondHoe) {
            this.props.hoeSelectedLeft = this.props.diamondHoe;
        } else {
            this.props.hoeSelectedLeft = 0;
        }
    }

    /**
     * 挖矿
     */
    public mineClick(e:any) {
        const itype = e.itype;
        const mineId = e.mineId;

        if (this.props.miningedNumber >= MineMax) {
            popNew('earn-client-app-components-mineModalBox-mineModalBox',{ miningMax:true });
            
            return;
        }

        // 未开始挖矿前选择矿山
        if ((this.props.mineId !== mineId || this.props.mineType !== itype) && !this.props.countDownStart) {
            this.props.mineId = mineId;
            this.props.mineType = itype;
            this.paint();

            return;
        }

        // 中途挖其他矿去了
        if (this.props.mineId !== mineId || this.props.mineType !== itype) return;
        // 准备开始挖矿
        if (!this.props.countDownStart) {
            if (this.props.hoeSelectedLeft <= 0) return;
            readyMining(this.props.hoeSelected).then((r:RandomSeedMgr) => {
                const hits = calcMiningArray(this.props.hoeSelected,r.seed);
                this.hits = hits;
                this.paint();
            });
            this.props.countDownStart = true;
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
        for (let i = 0; i < this.props.haveMines.length; i++) {
            const mine = this.props.haveMines[i];
            if (mine.type === this.props.mineType && mine.id === this.props.mineId) {
                this.props.lossHp = this.hits[this.props.miningCount - 1] || 1;
                // console.log('lossHp  ==',this.props.lossHp);
                mine.hp -= this.props.lossHp;
                if (mine.hp <= 0) {
                    this.deleteBoomMine();
                }
                break;
            }
        }
    }

    // 爆炸矿山消失
    public deleteBoomMine() {
        const mineType = this.props.mineType;
        const mineId = this.props.mineId;
        requestAnimationFrame(() => {
            this.props.haveMines = this.props.haveMines.filter(item => {
                return item.type !== mineType || item.id !== mineId;
            });
        });
        this.initMiningState();
        this.paint();
    }
    /**
     * 倒计时
     */
    public countDown() {
        this.props.countDownTimer = setTimeout(() => {
            this.countDown();
            this.props.countDown--;
            this.paint();
            if (!this.props.countDown) {
                this.initMiningState();
            }
        },1000);
    }

    public initMiningState() {
        setStore('flags/startMining',true);  // 挖矿的时候勋章延迟弹出 (在点击奖励关闭后弹出)
        startMining(this.props.mineType,this.props.mineId,this.props.miningCount).then((r:MiningResponse) => {
            if (r.leftHp <= 0) {
                getRankList();
                getTodayMineNum();
                getMiningCoinNum();
                this.props.mineId = -1;
                this.props.mineType = -1;
                const awardType0 = r.awards[0].enum_type;  // 常规奖励类型
                const type0 = r.awards[0].value.num;   // 货币类型
                const number0 = coinUnitchange(type0,r.awards[0].value.count);
                this.props.awardTypes[awardType0] = number0;
                // 常规奖励
                const routineAward = {
                    awardType:awardType0,
                    type:type0,
                    number:number0
                };
                let extraAward;
                if (r.awards[1]) {
                    extraAward = {
                        awardType:r.awards[1].enum_type,
                        type:r.awards[1].value.num,
                        number:coinUnitchange(r.awards[1].value.num,r.awards[1].value.count)
                    };
                }
                popNew('earn-client-app-components-mineModalBox-mineModalBox',{ routineAward,extraAward });
                this.paint();
            }
        });
        
        this.props.countDownStart = false;
        this.props.countDown = hoeUseDuration;
        this.props.miningCount = 0;
        clearTimeout(this.props.countDownTimer);
    }

    /**
     * 更新矿山
     */
    public updateMine() {
        this.props.ironHoe = getHoeCount(HoeType.IronHoe);
        this.props.goldHoe = getHoeCount(HoeType.GoldHoe);
        this.props.diamondHoe = getHoeCount(HoeType.DiamondHoe);
        this.hoeSelectedDefault();
        this.hoeSelectedLeft();
        if (this.props.haveMines.length === 0) {
            this.props.haveMines = getAllMines();
            this.mineLocationInit();
        }
        console.log('haveMines =',this.props.haveMines);
        this.paint();
    }
    /**
     * 更新已挖矿山
     */
    public updateMining(mine:Mine) {
        this.props.miningedNumber = mine.miningedNumber;
        this.props.miningNumber = {
            KT:mine.miningKTnum,
            ST:mine.miningSTnum,
            BTC:mine.miningBTCnum,
            ETH:mine.miningETHnum
        };
        this.paint();
    }

    /**
     * 看广告
     */
    public watchAdClick() {
        popNew('earn-client-app-test-test');
        if (this.props.countDownStart) return;
        wathcAdGetAward();
    }
}

// ===================================================== 立即执行

register('goods',(goods:Item[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateMine();
});

register('mine',(mine:Mine) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateMining(mine);
});

register('flags/earnHomeHidden',(earnHomeHidden:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (earnHomeHidden) {
        setTimeout(() => {
            w.props.zIndex = 0;
            w.paint();
        },500);
    } else {
        w.props.zIndex = -1;
        w.paint();
    }
   
});