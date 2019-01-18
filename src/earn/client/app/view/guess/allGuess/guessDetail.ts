/**
 * 竞猜详情-下单
 */

import { popNew } from '../../../../../../pi/ui/root';
import { Forelet } from '../../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../../pi/widget/painter';
import { Widget } from '../../../../../../pi/widget/widget';
import { getStore, register } from '../../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class GuessDetail extends Widget {
    public ok: () => void;
    
    public props:any = {
        selectTopbar:{},
        guessSTnum:0,
        selfSTnum:0 
    };

    public create () {
        super.create();
        this.getSTnum();
        
    }

    public guess(e:any,team:number) {
        this.btnClick(getRealNode(e.node));
        if (this.props.guessSTnum > this.props.selfSTnum) { // 余额不足
            popNew('app-components1-message-message',{ content:this.config.value.tips[0] });

            return;
        }
        if (this.props.guessSTnum === 0) {  // 竞猜ST为0
            popNew('app-components1-message-message',{ content:this.config.value.tips[1] });

            return;
        }
    }

    /**
     * 输入竞猜ST数量
     */
    public inputChange(res:any) {
        if (res.value !== '') {
            this.props.guessSTnum = parseFloat(res.value);
        } else {
            this.props.guessSTnum = 0;
        }
    }

    /**
     * 获取账户ST数量
     */
    public getSTnum() {
        this.props.selfSTnum = getStore('balance/ST');
        this.paint();
    }

    /**
     * 点击效果
     */
    public btnClick($dom:any) {
        $dom.className = 'btnClick';
        setTimeout(() => {
            $dom.className = '';
        }, 100);
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行

register('balance/ST',(r:any) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.getSTnum();
});