/**
 * 活动-邀请好友
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { getInviteCode } from '../../../../../app/net/pull';
import { LuckyMoneyType } from '../../../../../app/store/interface';
import { copyToClipboard, popNewMessage } from '../../../../../app/utils/tools';
import { SharePlatform, ShareToPlatforms } from '../../../../../pi/browser/shareToPlatforms';
import { getLang } from '../../../../../pi/util/lang';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { converInviteAwards } from '../../net/rpc';
import { getStore, Invited, register } from '../../store/memstore';
import { inviteAwardsMultiple } from '../../utils/constants';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class InviteFriend extends Widget {
    public ok : () => void;
    public language:any;
    public props:any;
    public create() {
        super.create();
        const invited = getStore('invited');
        this.props = {
            walletName:getModulConfig('WALLET_NAME'),
            showPage:'first',
            inviteCode:'******',
            welfareAwards : [],
            invitedNumberOfPerson:invited.invitedNumberOfPerson,
            inviteAwardsMultiple,
            topBarTitle:'',
            quickInvitation:'',
            meQrcode:''
        };
        this.initWelfareAwards(invited.receiveAwards);
        this.initData();
    }

    public setProps(props:any,oldProps:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props,oldProps);
    }

    public async initData() {
        this.language = this.config.value[getLang()];
        const inviteCodeInfo = await getInviteCode();
        if (inviteCodeInfo.result !== 1) return;
        this.props.inviteCode = `${LuckyMoneyType.Invite}${inviteCodeInfo.cid}`;
        this.props.topBarTitle = this.props.topBarTitle || { zh_Hans:'邀请好友',zh_Hant:'邀請好友',en:'' };
        this.props.quickInvitation = this.props.quickInvitation || { zh_Hans:'一键快速邀请',zh_Hant:'一鍵快速邀請',en:'' };
        this.paint();
    }

    // 初始化可领取得奖励
    public initWelfareAwards(receiveAwards:number[] = []) {
        const defaultAwardsLen = 5;
        const len = Math.ceil(receiveAwards.length / defaultAwardsLen) + 1;
        let welfareAwards;
        for (let i = 0;i < len;i++) {
            welfareAwards = [];
            let allReceived = true;
            for (let k = 0;k < defaultAwardsLen;k++) {
                const index = i * defaultAwardsLen + k;
                if (receiveAwards[index] === 1) {
                    allReceived = false;
                }
                const received = receiveAwards[index] === 0; 
                const canReceive = receiveAwards[index] === 1; 
                welfareAwards.push({
                    received,
                    canReceive,
                    number:(index + 1) * inviteAwardsMultiple
                });
            }
            if (!allReceived) break;
        }

        this.props.welfareAwards = welfareAwards;
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
    public refreshPage() {
        this.initData();
    }

    /**
     * 切换显示页面
     * @param page 显示页面标识
     */
    public change(page:string) {
        this.props.showPage = page;
        this.paint();
    }
    public shareToWechat() {
        this.baseShare(SharePlatform.PLATFORM_WEBCHAT);
    }

    public shareToFriends() {
        this.baseShare(SharePlatform.PLATFORM_MOMENTS);
    }

    public shareToQQ() {
        this.baseShare(SharePlatform.PLATFORM_QQ);
    }

    public shareToQQSpace() {
        this.baseShare(SharePlatform.PLATFORM_QZONE);
    }

    public copyClick() {
        copyToClipboard(this.props.inviteCode);
        popNewMessage(this.language.tips[0]);
    }

    public openClick(e:any,index:number) {
        console.log(index);
        const welfareAward = this.props.welfareAwards[index];
        if (!welfareAward.canReceive) return;
        converInviteAwards(welfareAward / inviteAwardsMultiple);
    }
    
    public baseShare(platform: number) {
        const stp = new ShareToPlatforms();
        stp.init();
        stp.makeScreenShot({
            success: (result) => { 
                stp.shareScreenShot({
                    success: (result) => { 
                        popNewMessage('分享成功');
                    },
                    fail: (result) => { 
                        // console.log();
                    },
                    platform: platform
                });
            },
            fail: (result) => { 
                // errCB && errCB(result);
            }
        });
    }
    public updateInvited(invited:Invited) {
        this.props.invitedNumberOfPerson = invited.invitedNumberOfPerson;
        this.initWelfareAwards(invited.convertedInvitedAward);
        this.paint();
    } 
}

register('invited',(invited:Invited) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateInvited(invited);
});