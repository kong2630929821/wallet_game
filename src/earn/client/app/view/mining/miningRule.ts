/**
 * digging rule
 */
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { MineMax } from '../../utils/constants';

export class MiningRule extends Widget {
    public ok:() => void;
    public props:any;
    public create() {
        super.create();
        this.props = {
            mineMax:MineMax,
            getMethod:[
                {
                    title:{ zh_Hans:'注册：',zh_Hant:'註冊：',en:'' },
                    desc:{ zh_Hans:'新用户注册即送',zh_Hant:'新用戶註冊即送',en:'' },
                    action:''
                },{
                    title:{ zh_Hans:'连续登录：',zh_Hant:'連續登陸：',en:'' },
                    desc:{ zh_Hans:'每日登录赠送镐，连续登录赠送更多镐。',zh_Hant:'每日登陸贈送鎬，連續登陸贈送更多鎬。',en:'' },
                    action:''
                },{
                    title:{ zh_Hans:'邀请好友：',zh_Hant:'邀請好友：',en:'' },
                    desc:{ zh_Hans:'邀请好友成功将获得不同的镐。',zh_Hant:'邀請好友成功將獲得不同的鎬。',en:'' },
                    action:{ zh_Hans:'去邀请好友',zh_Hant:'去邀請好友',en:'' },
                    page:'earn-client-app-view-activity-inviteFriend'
                },{
                    title:{ zh_Hans:'被邀请：',zh_Hant:'被邀請：',en:'' },
                    desc:{ zh_Hans:'被邀请人会获得邀请人同等的额外奖励，但是同一个账号只能被邀请一次。',zh_Hant:'被邀請人會獲得邀請人同等的額外獎勵，但是同一個賬號只能被邀請一次。',en:'' },
                    action:{ zh_Hans:'去填写邀请码',zh_Hant:'去填寫邀請碼',en:'' },
                    page:'app-view-earn-exchange-exchange'
                },{
                    title:{ zh_Hans:'观看广告：',zh_Hant:'觀看廣告：',en:'' },
                    desc:{ zh_Hans:'每个广告奖励铜镐一把，但是有可能会遇上金银镐哦。',zh_Hant:'每個廣告獎勵銅鎬一把，但是有可能會遇上金銀鎬哦。',en:'' },
                    action:''
                }
            ]
        };
    }
    public backClick() {
        this.ok && this.ok();
    }

    public actionClick(e:any,index:number) {
        const page = this.props.getMethod[index].page;
        page && popNew(page);
    }

}