/**
 * digging mines home
 */
import { getModulConfig } from '../../../../../app/modulConfig';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { Award, Item, Item_Enum, MiningResponse } from '../../../../server/data/db/item.s';
import { RandomSeedMgr } from '../../../../server/util/randomSeedMgr';
import { getKTbalance, getMiningCoinNum, getRankList, getTodayMineNum, readyMining, startMining } from '../../net/rpc';
import { Mine, register, setStore } from '../../store/memstore';
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
        'top:377px;left:109px;',
        'top:387px;left:478px;',
        'top:590px;left:130px;',
        'top:580px;left:402px;',
        'top:800px;left:73px;',
        'top:743px;left:319px;',
        'top:873px;left:488px;',
        'top:969px;left:251px;'
    ];
    public startTime:number;
    public create() {
        super.create();
        this.init();
        this.state = STATE;
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
            startMining:false, // 请求挖矿标识
            ktShow:getModulConfig('KT_SHOW')
            
        };
        this.mineLocationInit();   // 矿山位置初始化
        console.log('miningHome ----------');
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
        if (this.props.hoeSelected !== -1) return;  // 只有第一次才默认选中锄头
        if (this.props.diamondHoe > 0) {
            this.props.hoeSelected =  HoeType.DiamondHoe;
        } else if (this.props.goldHoe > 0) {
            this.props.hoeSelected = HoeType.GoldHoe;
        } else if (this.props.ironHoe > 0) {
            this.props.hoeSelected = HoeType.IronHoe;
        } else {
            this.props.hoeSelected = -1;
        }
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
        if (this.props.startMining) return;  // 如果正在通信  不响应
        if (this.state.miningedNumber >= MineMax) {
            popModalBoxs('earn-client-app-components-mineModalBox-mineModalBox',{ miningMax:true });
            
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
            this.startTime = new Date().getTime();
            this.props.miningCount++;
            this.countDown();
            this.bloodLoss();
            this.paint();

            return;
        }

        this.props.miningCount++;
        this.bloodLoss();

        this.paint();
    }
    /**
     * 获取选中的矿山下标
     */
    public getSelectedMineIndex() {
        for (let i = 0; i < this.props.haveMines.length; i++) {
            const mine = this.props.haveMines[i];
            if (mine.type === this.props.mineType && mine.id === this.props.mineId) {
                return i;
            }
        }

        return -1;
    }
    // 矿山掉血
    public bloodLoss() {
        for (let i = 0; i < this.props.haveMines.length; i++) {
            const mine = this.props.haveMines[i];
            if (mine.type === this.props.mineType && mine.id === this.props.mineId) {
                this.props.lossHp = this.hits[this.props.miningCount - 1] || 1;
                console.log('lossHp  =============',this.props.lossHp);
                mine.hp -= this.props.lossHp;
                if (mine.hp <= 0) {
                    mine.hp = 0;
                    this.initMiningState();
                }
                break;
            }
        }
    }

    // 爆炸矿山消失
    public deleteBoomMine() {
        const mineType = this.props.mineType;
        const mineId = this.props.mineId;
        this.props.haveMines = this.props.haveMines.filter(item => {
            return item.type !== mineType || item.id !== mineId;
        });
        if (this.props.haveMines.length === 0) {
            this.props.haveMines = getAllMines();
            this.mineLocationInit();
        }
        // console.log('haveMines =',this.props.haveMines);
    }
    /**
     * 倒计时
     */
    public countDown() {
        this.props.countDownTimer = setTimeout(() => {
            this.countDown();
            const intervel = new Date().getTime() - this.startTime;
            this.props.countDown = this.props.countDownMax - intervel;
            this.paint();
            if (this.props.countDown <= 0) {
                this.initMiningState();
            }
        },33);
    }

    public initMiningState() {
        this.deleteBoomMine();
        setStore('flags/startMining',true);  // 挖矿的时候勋章延迟弹出 (在点击奖励关闭后弹出)
        this.props.startMining = true;   // 请求挖矿过程中不能挖矿
        startMining(this.props.mineType,this.props.mineId,this.props.miningCount).then((r:MiningResponse) => {
            console.log('当前矿山的血量', this.props.haveMines);
            console.log('挖完了！！！！！！！！！！！！',r,this.props.miningCount);
            console.log('miningHome ==== ',this.props);
            this.props.miningCount = 0;
            this.props.startMining = false;
            if (r.resultNum !== 1) return;
            if (r.leftHp <= 0) {
                // this.deleteBoomMine();
                getRankList();
                getTodayMineNum();
                getMiningCoinNum();
                this.props.mineId = -1;
                this.props.mineType = -1;
                if (!r.awards) {
                    popNew('earn-client-app-components-mineModalBox-mineModalBox',{ empty:true });
                    this.paint();

                    return;
                }
                // debugger;
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
                console.log('获得奖励==========================================',extraAward,routineAward);
                popNew('earn-client-app-components-mineModalBox-mineModalBox',{ routineAward,extraAward });
                if (routineAward) {
                    getKTbalance();
                }
                
            } else {
                const mine = this.props.haveMines[this.getSelectedMineIndex()];
                mine.hp = r.leftHp;
            }
            this.paint();
        });
        this.props.countDownStart = false;
        this.props.countDown = hoeUseDuration;
        clearTimeout(this.props.countDownTimer);
        this.paint();
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
        this.paint();
    }
    public watchAdAnimateClick(event:any) {
        const adBillboard = getRealNode(event.node);
        adBillboard.className = 'adBillboardClick';
        setTimeout(() => {
            adBillboard.className = ``;
        },500);
    }
    /**
     * 看广告
     */
    public watchAdClick() {
        // popModalBoxs('earn-client-app-components-mineModalBox-mineModalBox',{ miningMax:true });
        popNew('earn-client-app-test-test'); // 测试锄头
        // popModalBoxs('earn-client-app-components-adAward-adAward',{ hoeType:HoeType.GoldHoe });
        // if (this.props.countDownStart) return;
        // wathcAdGetAward(1,null,(award:Award) => {
        //     console.log('广告关闭  奖励内容 = ',award);
        //     setTimeout(() => {
        //         popModalBoxs('earn-client-app-components-adAward-adAward',{ hoeType:award.awardType });
        //     },300);
            
        // });
    }
    public clickTop() {
        console.log('top');
    }
    public clickImg() {
        console.log('img');
    }
    public rightClick() {
        console.log(1);
    }
}

// ===================================================== 立即执行
const STATE = {
    miningNumber:0, // 嗨豆数量
    miningedNumber:0,  // 已挖矿山
    zIndex:-1

};
register('goods',(goods:Item[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateMine();
});

// 监听矿山
register('mine',(mine:Mine) => {
    STATE.miningedNumber = mine.miningedNumber;
    forelet.paint(STATE);
});

// 监听嗨豆
register('balance/KT',(r:number) => {
    STATE.miningNumber = r;
    console.log('ssssssssssssssssssssssssss',STATE);
    forelet.paint(STATE);
});
register('flags/earnHomeHidden',(earnHomeHidden:boolean) => {
    if (earnHomeHidden) {
        setTimeout(() => {
            STATE.zIndex = 0;
            forelet.paint(STATE);
        },500);
    } else {
        STATE.zIndex = -1;
        forelet.paint(STATE);
    }
});

register('flags/logout',(logout:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (logout) {
        w && w.init();
    }
});