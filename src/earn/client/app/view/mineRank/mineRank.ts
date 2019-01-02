/**
 * 挖矿排名
 */

import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getRankList } from '../../net/rpc';
import { subscribeSpecialAward } from '../../net/subscribedb';
import { getStore } from '../../store/memstore';
// import { register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
console.log('module-----------------',module);

export class MineRank extends Widget {
    public ok: () => void;
    public props:any = {
        notice:[
            '一颗大蒜苗挖到了0.1ETH',
            '二颗大蒜苗挖到了0.2ETH',
            '三颗大蒜苗挖到了0.3ETH',
            '四颗大蒜苗挖到了0.4ETH',
            '五颗大蒜苗挖到了0.5ETH'
        ],
        noticeShow:0,
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
        subscribeSpecialAward((r) => {
            console.log('挖矿特殊奖励公告----------------',r);
            // setTimeout(() => {
            //     this.props.notice.push(new Date());
            //     this.props.notice.shift();
            //     console.log('this.props.notice----------------',this.props.notice);
                
            // }, 5000);
        });
        this.noticeChange();
    }

    public noticeChange() {
        setTimeout(() => {
            this.props.noticeShow ++;
            if (this.props.noticeShow >= this.props.notice.length) {
                this.props.noticeShow = 0;
            }
            this.noticeChange();
        }, 5000);
        this.paint();
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