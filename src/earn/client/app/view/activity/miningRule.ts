/**
 * digging rule
 */
import { getStore } from '../../../../../app/store/memstore';
import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { wathcAdGetAward } from '../../utils/tools';

export class MiningRule extends Widget {
    public ok:() => void;
    public props:any;
    public create() {
        super.create();
        this.props = {
            getMethod:[
                {
                    title:{ zh_Hans:'注册：',zh_Hant:'註冊：',en:'' },
                    desc:{ zh_Hans:'新用户注册即送两把铜镐',zh_Hant:'新用戶註冊即送兩把銅鎬',en:'' },
                    action:{ zh_Hans:'去注册',zh_Hant:'去註冊',en:'' },
                    page:'app-view-wallet-create-home'
                },{
                    title:{ zh_Hans:'连续登陆：',zh_Hant:'連續登陸：',en:'' },
                    desc:{ zh_Hans:'每日登陆赠送镐，连续登陆赠送更多镐。',zh_Hant:'每日登陸贈送鎬，連續登陸贈送更多鎬。',en:'' },
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
                    title:{ zh_Hans:'提建议：',zh_Hant:'提建議：',en:'' },
                    desc:[{ zh_Hans:'5字以上的建议，即可获得铜镐1-5把',zh_Hant:'5字以上的建議，即可獲得銅鎬1-5把',en:'' },{ zh_Hans:'有效建议可获得银镐5把',zh_Hant:'有效建議可獲得銀鎬5把',en:'' },{ zh_Hans:'建议被采纳获得金镐5把',zh_Hant:'建議被採納獲得金鎬5把',en:'' }],
                    action:{ zh_Hans:'去提意见',zh_Hant:'去提意見',en:'' },
                    page:''
                },{
                    title:{ zh_Hans:'观看广告：',zh_Hant:'觀看廣告：',en:'' },
                    desc:{ zh_Hans:'每个广告奖励铜镐一把，但是有可能会遇上金银镐哦。',zh_Hant:'每個廣告獎勵銅鎬一把，但是有可能會遇上金銀鎬哦。',en:'' },
                    action:{ zh_Hans:'看广告',zh_Hant:'看廣告',en:'' },
                    page:''
                }
            ]
        };
    }
    public backClick() {
        this.ok && this.ok();
    }

    public actionClick(e:any,index:number) {
        const page = this.props.getMethod[index].page;
        if (index === 5) {
            wathcAdGetAward(1);

            return;
        }
        if (index === 0 && getStore('user/id')) {
            popNewMessage('已有账号');
        } else {
            page && popNew(page);
        }
    }

}