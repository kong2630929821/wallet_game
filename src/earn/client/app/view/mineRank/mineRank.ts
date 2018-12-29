/**
 * 挖矿排名
 */

import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getRankList } from '../../net/rpc';
import { getStore } from '../../store/memstore';
// import { register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class MineRank extends Widget {
    public ok: () => void;
    public props:any = {
        myRank: { rank: 1, userName: '啊实打实的', ktNum: 500 },
        rankList: [
            // { rank: 1, userName: "啊实打实的", ktNum: 500 },
            // { rank: 2, userName: "啊实打实的", ktNum: 500 },
            // { rank: 3, userName: "啊实打实的", ktNum: 500 },
            // { rank: 4, userName: "啊实打实的", ktNum: 500 }
        ],
        topbarList: [
            {
                name: 'allRankList',
                title: { zh_Hans: '全部排名', zh_Hant: '全部排名', en: '' }
            },
            {
                name: 'friendRankList',
                title: { zh_Hans: '好友排名', zh_Hant: '好友排名', en: '' }
            }
        ],
        topbarSel: 0
    };

    public create() {
        super.create();
        this.initData();
    }

    /**
     * 更新props数据
     */
    public initData() {
        getRankList().then((res: any) => {
            this.props.rankList = this.processData(res.topList);
            console.log('rankList------------------------',this.props.rankList);
            
            this.props.myRank.rank = res.myNum;
            this.props.myRank.ktNum = 500;
            this.paint();
        });
    }
    // 处理排行榜
    public processData(data:any) {
        const resData = [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const res = {
                rank:i + 1,
                ktNum:element.miningKTMap.ktNum,
                userName:element.uName
            };
            resData.push(res);
        }

        return resData;
    }

    /**
     * 导航栏切换
     * @param index 选择导航栏
     */
    public topbarChange(index: number) {
        this.props.topbarSel = index;
        document.getElementById('rankList').scrollTop = 0;
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