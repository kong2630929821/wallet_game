/**
 * 挖矿排名
 */

import { getFriendsKTTops } from '../../../../../app/net/pull';
import { CloudCurrencyType } from '../../../../../app/public/interface';
import { getUserInfo } from '../../../../../app/utils/pureUtils';
import { getAllFriendIDs } from '../../../../../chat/client/app/logic/logic';
import { getChatUid } from '../../../../../chat/client/app/net/rpc';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getMedalest } from '../../net/rpc';
import { getStore, setStore } from '../../store/memstore';
import { formateCurrency } from '../../utils/util';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

// tslint:disable-next-line:completed-docs
export class MineRank extends Widget {
    public ok: () => void;
    public props: any = {
        notice: [],
        noticeShow: 0,
        myRank: { rank: 0, avatar: '', userName: '......', ktNum: 0, medal: null },
        rankList: getStore('rankList',[]),
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
        // subscribeSpecialAward(async (r) => {  // 监听新挖矿通告
        //     if (r) {
        //         console.log('[活动]挖矿特殊奖励公告----------------', r);
        //         const userInfo:any = await getUserList([r.openid],1);
        //         console.log('=====================',userInfo);
        //         const dataStr = `${userInfo[0].nickName}挖到了${coinUnitchange(r.awardType,r.count)}${CoinType[r.awardType]}`;
        //         this.props.notice.push(dataStr);
        //         // this.props.notice.shift();
        //         console.log('this.props.notice----------------', this.props.notice);
        //     }

        // });
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
        getUserInfo().then(userInfo => {
            if (this.props.topbarSel === 0) {
                
            } else {
                const  chatIDs = getAllFriendIDs();
                const chatAccID = [];
                chatIDs.forEach(v => {
                    if (v) chatAccID.push(v);
                }); 
                chatAccID.push(userInfo.acc_id);
                console.log('我的好友++++++++++++++++++++++++',chatAccID);
                getFriendsKTTops(chatAccID).then(async (res: any) => {
                    console.log('好友排名',res);
                    const medalest = [];
                    res.rank.forEach((v) => {
                        medalest.push(v.acc_id);
                    });
                    console.log(medalest,userInfo.acc_id,'=========================');         
                    getMedalest(medalest).then((resList:any) => {
                        console.log('最高勋章列表',resList);
                        const mine = getStore('mine');
                        res.rank.forEach((v,i) => {
                            if (v.avatar === '')v.avatar = 'earn/client/app/res/image1/default_head.png';
                            v.medal = resList.arr[i].medalType || '8001';
                        });
                        if (JSON.stringify(this.props.rankList) !== JSON.stringify(res.rank)) {
                            this.props.rankList = res.rank;
                            setStore('rankList',res.rank);
                        }
                        this.props.myRank.avatar = userInfo.avatar || 'earn/client/app/res/image1/default_head.png';
                        this.props.myRank.userName = userInfo.nickName;
                        this.props.myRank.rank = res.miningRank;
                        this.props.myRank.ktNum = formateCurrency(mine.miningKTnum);
                        this.props.myRank.medal = mine.miningMedalId || '8001';
                        console.log('我的好友排名+++++++++++++++++++++++++++',this.props);
                        this.paint();
                    });
                    // this.props.rankList = await this.processData(res.topList);
                    // this.props.myRank.avatar = userInfo.avatar || 'earn/client/app/res/image1/default_head.png';
                    // this.props.myRank.userName = userInfo.nickName;
                    // this.props.myRank.rank = res.myNum;
                    // this.props.myRank.ktNum = formateCurrency(res.myKTNum);
                    // this.props.myRank.medal = res.myMedal;
                    // this.paint();
                });
            }
        });
    }

    // // 处理排行榜
    // public async processData(data: any) {
    //     const resData = [];
    //     const openidAry = [];  // 挖矿用户openid数组
    //     if (data.length !== 0) {
    //         data.forEach(element => {
    //             // tslint:disable-next-line:radix
    //             openidAry.push(parseInt(element.openid));
    //         });
    //         const userInfoList = await getUserList(openidAry, 1);
    //         console.log('批量获取挖矿用户信息--------------------------', userInfoList);
    //         for (let i = 0; i < data.length; i++) {
    //             const element = data[i];
    //             const elementUser = userInfoList[i];
    //             const res = {
    //                 // tslint:disable-next-line:max-line-length
    //                 avatar: elementUser.avatar ? `${uploadFileUrlPrefix}${elementUser.avatar}` : 'earn/client/app/res/image1/default_head.png',
    //                 userName: elementUser.nickName,
    //                 rank: i + 1,
    //                 ktNum: formateCurrency(element.miningKTMap.ktNum),
    //                 medal: element.medal
    //             };
    //             resData.push(res);
    //         }
    //     }
    //     console.log('批量获取挖矿用户信息--------------------------', resData);

    //     return resData;
    // }

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

    public details(index:number) {
        getUserInfo().then(userInfo => {
            const uid = userInfo.acc_id;
            console.log(this.props.rankList);
            if (this.props.rankList[index].acc_id === uid) {
                popNew('chat-client-app-view-info-user');
            } else {
                getChatUid(this.props.rankList[index].acc_id).then((res:any) => {
                    popNew('chat-client-app-view-info-userDetail',{ uid:res });  // 好友详情
                });
            }  
        });
        
    }
    // 我的详情
    public mydetails() {
        popNew('chat-client-app-view-info-user');
    }
}

// ===================================================== 立即执行