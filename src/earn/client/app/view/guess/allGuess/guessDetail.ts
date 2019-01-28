/**
 * 竞猜详情-下单
 */

import { popNew } from '../../../../../../pi/ui/root';
import { Forelet } from '../../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../../pi/widget/painter';
import { Widget } from '../../../../../../pi/widget/widget';
import { Props } from '../../../components/guessItem/guessItem';
import { betGuess, getOneGuessInfo, getSTbalance, queryBetGuess } from '../../../net/rpc';
import { getStore, register } from '../../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class GuessDetail extends Widget {
    public ok: () => void;

    public props: any = {
        selectTopbar: {},
        guessSTnum: 0.1,
        defaultGuessStNum:0.1,
        selfSTnum: 0,
        predictEarnTeam1:0,
        predictEarnTeam2:0
    };

    public setProps(props: Props) {
        super.setProps(this.props);
        if (props.guessData) {
            this.props.guessData = props.guessData;
        }
        this.getSTnum();
        this.inputChange({ value:this.props.defaultGuessStNum });
    }

    // public create() {
    //     super.create();

    // }

    public initData() {
        getOneGuessInfo(this.props.guessData.cid).then((res:any) => {
            this.props.guessData.team1Num = res.team1Num;
            this.props.guessData.team2Num = res.team2Num;
            this.paint();
        });
        getSTbalance();
    }

    public guess(e: any, team: number) {
        this.btnClick(getRealNode(e.node));
        if (this.props.guessSTnum > this.props.selfSTnum) { // 余额不足
            popNew('app-components1-message-message', { content: this.config.value.tips[0] });

            return;
        }
        if (this.props.guessSTnum < this.props.defaultGuessStNum) {  // 竞猜ST小于0.1
            popNew('app-components1-message-message', { content: this.config.value.tips[1] });

            return;
        }
        
        betGuess(this.props.guessData.cid,this.props.guessSTnum,team).then((order:any) => {
            queryBetGuess(order.oid).then(res => {      
                console.log('下注成功，查询！！！！！',res);
                popNew('app-components1-message-message', { content: this.config.value.tips[2] });
                this.initData();
                this.inputChange({ value:this.props.defaultGuessStNum });
            }).catch(err => {
                popNew('app-components1-message-message', { content: this.config.value.tips[3] });
                console.log('查询下注失败',err);
            });
        }).catch(err => {
            // popNew('app-components1-message-message', { content: this.config.value.tips[3] });
            console.log('下注失败！！！！！',err);
        });
    }

    /**
     * 输入竞猜ST数量
     */
    public inputChange(res: any) {
        if (res.value !== '') {
            this.props.guessSTnum = parseFloat(res.value);
        } else {
            this.props.guessSTnum = this.props.defaultGuessStNum;
        }
        this.props.predictEarnTeam1 = (this.props.guessSTnum * (this.props.guessData.team2Num / this.props.guessData.team1Num + 1)).toFixed(2);
        this.props.predictEarnTeam2 = (this.props.guessSTnum * (this.props.guessData.team1Num / this.props.guessData.team2Num + 1)).toFixed(2);
        this.paint();
    }

    /**
     * 获取账户ST数量
     */
    public getSTnum() {
        this.props.selfSTnum = getStore('balance/ST');
        this.paint();
    }

    /**
     * 去充值
     */
    public goRecharge() {
        popNew('app-view-wallet-cloudWallet-rechargeKT');
    }

    /**
     * 点击效果
     */
    public btnClick(e: any , eventType: number, eventValue?:any) {
        const $dom = getRealNode(e.node);
        $dom.className = 'btnClick';
        setTimeout(() => {
            $dom.className = '';
        }, 100);
        switch (eventType) { // 看广告
            case 0:
                // this.resetBoxList();
                break;
            case 1:          // 充值
                // this.goRecharge();
                break;
            case 2:          // 更换宝箱类型
                // this.change(eventValue);
                break;
            
            default:
        }
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行

register('balance/ST', (r: any) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.getSTnum();
});