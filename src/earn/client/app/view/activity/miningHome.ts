/**
 * digging mines home
 */
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Item, Item_Enum, MiningResponse } from '../../../../server/data/db/item.s';
import { RandomSeedMgr } from '../../../../server/util/randomSeedMgr';
import { getRankList, getTodayMineNum, readyMining, startMining } from '../../net/rpc';
import { getStore, register, setStore } from '../../store/memstore';
import { hoeUseDuration, MineMax } from '../../utils/constants';
import { coinUnitchange } from '../../utils/tools';
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
            countDown:hoeUseDuration,  // 倒计时时间
            countDownTimer:0,        // 倒计时定时器
            miningTips:{ zh_Hans:'',zh_Hant:'',en:'' },   // 挖矿提示
            haveMines:getAllMines(),          // 拥有的矿山
            lossHp:1,           // 当前掉血数
            allAwardType:Item_Enum,// 奖励所有类型
            awardTypes:{},    // 矿山爆掉的奖励类型
            miningedNumber:getStore('mine/miningedNumber'),  // 已挖矿山数目
            zIndex:-1            // z-index数值
        };
        this.mineLocationInit();   // 矿山位置初始化
        this.hoeSelectedLeft();   // 计算选中锄头剩余数
    }

    public signInClick() {
        popNew('earn-client-app-view-activity-signIn');
    }

    public welfareClick() {
        popNew('earn-client-app-view-activity-inviteAward');
    }

    public closeClick() {
        setStore('flags/earnHomeHidden',false);
    }

    public mineLocationInit() {
        const mineStyle = shuffle(this.mineStyle);
        for (let i = 0;i < this.props.haveMines.length;i++) {
            if (this.props.haveMines[i].location) continue;
            this.props.haveMines[i].location = mineStyle[i];
        }
    }
    public selectHoeClick(e:any,hopeType:HoeType) {
        if (this.props.countDownStart) return;
        this.props.hoeSelected = hopeType;
        this.hoeSelectedLeft();
        if (this.props.mineType === -1 || this.props.mineId === -1) {
            this.props.miningTips = { zh_Hans:'请选择矿山',zh_Hant:'請選擇礦山',en:'' } ;
        } else {
            this.props.miningTips = { zh_Hans:'开始挖矿',zh_Hant:'開始挖礦',en:'' } ;
        }
        this.paint();
    }

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

    public mineClick(e:any) {
        const itype = e.itype;
        const mineId = e.mineId;

        if (this.props.miningedNumber >= MineMax) return;

        // 未开始挖矿前选择矿山
        if ((this.props.mineId !== mineId || this.props.mineType !== itype) && !this.props.countDownStart) {
            this.props.mineId = mineId;
            this.props.mineType = itype;
            if (this.props.hoeSelected === -1) {
                this.props.miningTips = { zh_Hans:'请选择锄头',zh_Hant:'請選擇鋤頭',en:'' };
            } else {
                this.props.miningTips = { zh_Hans:'开始挖矿',zh_Hant:'開始挖礦',en:'' };
            }
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
            this.props.miningTips = { zh_Hans:``,zh_Hant:``,en:'' };
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
    public countDown() {
        this.props.countDownTimer = setTimeout(() => {
            this.countDown();
            this.props.countDown--;
            this.props.miningTips = { zh_Hans:``,zh_Hant:``,en:'' };
            if (!this.props.countDown) {
                this.initMiningState();
            }
            this.paint();
        },1000);
    }

    public initMiningState() {
        startMining(this.props.mineType,this.props.mineId,this.props.miningCount).then((r:MiningResponse) => {
            getRankList();
            if (r.leftHp <= 0) {
                getTodayMineNum();
                this.paint();
                this.props.awardTypes[r.awards[0].enum_type] = coinUnitchange(r.awards[0].value.num,r.awards[0].value.count);
            }
        });
        this.props.mineId = -1;
        this.props.mineType = -1;
        this.props.countDownStart = false;
        this.props.countDown = hoeUseDuration;
        this.props.hoeSelected = -1;
        this.props.miningTips = { zh_Hans:'',zh_Hant:'',en:'' };
        
        this.props.miningCount = 0;
        clearTimeout(this.props.countDownTimer);
    }
    public updateMine() {
        this.props.ironHoe = getHoeCount(HoeType.IronHoe);
        this.props.goldHoe = getHoeCount(HoeType.GoldHoe);
        this.props.diamondHoe = getHoeCount(HoeType.DiamondHoe);
        this.hoeSelectedLeft();
        if (this.props.haveMines.length === 0) {
            this.props.haveMines = getAllMines();
            this.mineLocationInit();
        }
        console.log('haveMines =',this.props.haveMines);
        this.paint();
    }
    public updateMiningedNumber(miningedNumber:number) {
        this.props.miningedNumber = miningedNumber;
        this.paint();
    }
}

// ===================================================== 立即执行

register('goods',(goods:Item[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateMine();
});

register('mine/miningedNumber',(miningedNumber:number) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateMiningedNumber(miningedNumber);
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