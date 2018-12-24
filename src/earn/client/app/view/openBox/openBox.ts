
/**
 * 开宝箱 - 首页
 */

import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { Item } from '../../../../server/data/db/item.s';
import { register } from '../../store/memstore';
import { Forelet } from '../../../../../pi/widget/forelet';
import { openChest, getAllGoods } from '../../net/rpc';
import { getTicketBalance } from '../../utils/util';
import { TicketType, LotteryTicketNum } from '../../xls/dataEnum.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');


interface Props {
    isEmpty:boolean; //空宝箱
    selectTicket: any; //选择的宝箱类型
    boxList: any; //宝箱列表
    ticketList: any; //奖券列表
}


export class OpenBox extends Widget {
    public ok: () => void;

    public props: Props = {
        isEmpty:false,
        boxList: [0, 0, 0, 0, 0, 0, 0, 0, 0], //0:未开 1:已开
        ticketList: [
            {
                type: TicketType.SilverTicket,
                name: { "zh_Hans": "银券", "zh_Hant": "銀券", "en": "" },
                needTicketNum:LotteryTicketNum.SilverChest,
                balance: 0,
            },
            {
                type: TicketType.GoldTicket,
                name: { "zh_Hans": "金券", "zh_Hant": "金券", "en": "" },
                needTicketNum:LotteryTicketNum.GoldChest,
                balance: 0,
            },
            {
                type:   TicketType.DiamondTicket,
                name: { "zh_Hans": "彩券", "zh_Hant": "彩券", "en": "" },
                needTicketNum:LotteryTicketNum.DiamondChest,
                balance: 0,
            }
        ],
        selectTicket: {},

    };

    public create() {
        super.create();
        this.props.selectTicket = this.props.ticketList[0];
        this.initData();
    }

    /**
     * 初始数据
     */
    public initData() {
        for(let i=0;i<this.props.ticketList.length;i++){
            this.props.ticketList[i].balance = getTicketBalance(this.props.ticketList[i].type);
        }
        this.paint();
    }

    /**
     * 打开宝箱 
     * @param num 宝箱序数
     */
    public openBox(num: number) {
        if (this.props.boxList[num] === 1) {  //宝箱已打开
            //TODO
            return;
        }
        if (this.props.selectTicket.balance < this.props.selectTicket.needTicketNum) {  //奖券不够
            //TODO
            return;
        }
        openChest(this.props.selectTicket.type).then((res:any)=>{
            popNew('earn-client-app-view-component-lotteryModal', { data: res.value });
            if(res.value.count===0){
                this.emptyChest();
            }
            this.props.boxList[num] = 1;
            this.paint();
        }).catch((err)=>{
            alert(err)
            this.emptyChest();
        })
    }

    /**
     * 设置空宝箱提示
     */
    public emptyChest(){
        this.props.isEmpty = true;
        this.paint();
        setTimeout(() => {
            this.props.isEmpty =false;
            this.paint();
        }, 2000);

    }

    /**
     * 重置所有宝箱
     */
    public resetBoxList() {
        this.props.boxList.fill(0);
        this.paint();
    }

    /**
     * 更改宝箱类型
     * @param num 票种
     */
    public change(num: number) {
        this.resetBoxList();
        this.props.selectTicket = this.props.ticketList[num];
        this.paint();
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('earn-client-app-view-myProduct-myProduct', { type: 2 });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}


// ===================================================== 立即执行

register('goods',(goods:Item[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});