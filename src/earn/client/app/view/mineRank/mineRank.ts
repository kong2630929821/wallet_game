/**
 * 挖矿排名
 */

import { uploadFileUrlPrefix } from '../../../../../app/config';
import { getUserList } from '../../../../../app/net/pull';
import { getUserInfo } from '../../../../../app/utils/tools';
import { getAllFriendIDs } from '../../../../../chat/client/app/logic/logic';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { ChatIDs } from '../../../../server/rpc/itemQuery.s';
import { getFriendsKTTop, getRankList } from '../../net/rpc';
import { subscribeSpecialAward } from '../../net/subscribedb';
import { getStore, register } from '../../store/memstore';
import { coinUnitchange } from '../../utils/tools';
import { formateCurrency } from '../../utils/util';
import { CoinType } from '../../xls/dataEnum.s';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class MineRank extends Widget {
    public ok: () => void;
    public props: any = {
        notice: [],
        noticeShow: 0,
        myRank: { rank: 0, avatar: '', userName: '......', ktNum: 0, medal: null },
        rankList: [],
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
        subscribeSpecialAward(async (r) => {  // 监听新挖矿通告
            if (r) {
                console.log('[活动]挖矿特殊奖励公告----------------', r);
                const userInfo:any = await getUserList([r.openid],1);
                const dataStr = `${userInfo[0].nickName}挖到了${coinUnitchange(r.awardType,r.count)}${CoinType[r.awardType]}`;
                this.props.notice.push(dataStr);
                // this.props.notice.shift();
                console.log('this.props.notice----------------', this.props.notice);
            }

        });
        this.noticeChange();
    }

    /**
     * 通告改变
     */
    public noticeChange() {
        setTimeout(() => {
            this.props.noticeShow++;
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
        const userInfo = getUserInfo();
        if (this.props.topbarSel === 0) {
            getRankList().then(async (res: any) => {
                this.props.rankList = await this.processData(res.topList);
                this.props.myRank.avatar = userInfo.avatar;
                this.props.myRank.userName = userInfo.nickName;
                this.props.myRank.rank = res.myNum;
                this.props.myRank.ktNum = formateCurrency(res.myKTNum);
                this.props.myRank.medal = res.myMedal;
                this.paint();
            });
        } else {
            const chatIds = new ChatIDs();
            chatIds.chatIDs = getAllFriendIDs();
            getFriendsKTTop(chatIds).then(async (res: any) => {
                this.props.rankList = await this.processData(res.topList);
                this.props.myRank.avatar = userInfo.avatar;
                this.props.myRank.userName = userInfo.nickName;
                this.props.myRank.rank = res.myNum;
                this.props.myRank.ktNum = formateCurrency(res.myKTNum);
                this.props.myRank.medal = res.myMedal;
                this.paint();
            });
        }
       
    }

    // 处理排行榜
    public async processData(data: any) {
        const resData = [];
        const openidAry = [];  // 挖矿用户openid数组
        if (data.length !== 0) {
            data.forEach(element => {
                // tslint:disable-next-line:radix
                openidAry.push(parseInt(element.openid));
            });
            const userInfoList = await getUserList(openidAry, 1);
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                const elementUser = userInfoList[i];
                const res = {
                    avatar: elementUser.avatar ? `${uploadFileUrlPrefix}${elementUser.avatar}` : 'earn/client/app/res/image1/default_head.png',
                    userName: elementUser.nickName,
                    rank: i + 1,
                    ktNum: formateCurrency(element.miningKTMap.ktNum),
                    medal: element.medal
                };
                resData.push(res);
            }
        }
        console.log('批量获取挖矿用户信息--------------------------', resData);

        return resData;
    }

    /**
     * 导航栏切换
     * @param index 选择导航栏
     */
    public topbarChange(index: number) {
        this.props.topbarSel = index;
        document.getElementById('rankList').scrollTop = 0;
        this.initData();
        this.paint();
    }

    /**
     * 刷新页面
     */
    public refresh() {
        this.initData();
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行