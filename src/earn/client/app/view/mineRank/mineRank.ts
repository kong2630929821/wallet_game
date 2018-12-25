/**
 * 挖矿排名
 */

import { Widget } from '../../../../../pi/widget/widget';
import { Forelet } from '../../../../../pi/widget/forelet';
// import { register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class MineRank extends Widget {
    public ok: () => void;
    public props = {
        rankList: [
            { rank: 1, userName: "啊实打实的", ktNum: 500 },
            { rank: 2, userName: "啊实打实的", ktNum: 500 },
            { rank: 3, userName: "啊实打实的", ktNum: 500 },
            { rank: 4, userName: "啊实打实的", ktNum: 500 },
            { rank: 5, userName: "啊实打实的", ktNum: 500 },
            { rank: 6, userName: "啊实打实的", ktNum: 500 },
            { rank: 7, userName: "啊实打实的", ktNum: 500 },
            { rank: 8, userName: "啊实打实的", ktNum: 500 },
            { rank: 9, userName: "啊实打实的", ktNum: 500 },
            { rank: 10, userName: "啊实打实的", ktNum: 500 },
            { rank: 11, userName: "啊实打实的", ktNum: 500 }
        ]
    };

    public create() {
        super.create();
        this.initData();
    }

    /**
     * 更新props数据
     */
    public initData() {
        //TODO
        this.paint();
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}


// ===================================================== 立即执行

// register('goods', (goods: Item[]) => {
//     const w: any = forelet.getWidget(WIDGET_NAME);
//     w && w.initData();
// });