/**
 * 活动-邀请好友
 */

import { getModulConfig, shareDownload } from '../../../../../app/public/config';
import { LuckyMoneyType } from '../../../../../app/public/interface';
import { getUserInfo, popNewMessage } from '../../../../../app/utils/pureUtils';
import { copyToClipboard } from '../../../../../app/utils/tools';
import { SharePlatform, ShareToPlatforms } from '../../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../../pi/ui/root';
import { getLang } from '../../../../../pi/util/lang';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getInviteCodes } from '../../net/rpc';
import { inviteAwardsMultiple } from '../../utils/constants';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

// tslint:disable-next-line:completed-docs
export class InviteFriend extends Widget {
    public ok : () => void;
    public language:any;
    public props:any;
    public create() {
        super.create();
        this.props = {
            walletName:getModulConfig('WALLET_NAME'),
            inviteCode:'******',
            welfareAwards : [],
            inviteAwardsMultiple,
            topBarTitle:'',
            quickInvitation:'',
            meQrcode:'',
            background:'',
            shareUrl:'',
            nickName:''
        };
        this.initData();
    }

    public setProps(props:any,oldProps:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props,oldProps);
    }

    public initData() {
        this.language = this.config.value[getLang()];
        this.props.quickInvitation = this.props.quickInvitation || { zh_Hans:'扫码下载',zh_Hant:'掃碼下載',en:'' };
        this.props.topBarTitle = this.props.topBarTitle || '';
        this.props.bgImg = this.props.bgImg || 'app/res/image/bgintive.png';
        this.props.shareUrl = shareDownload;
        getInviteCodes().then((inviteCodeInfo:any) => {
            this.props.inviteCode = `${LuckyMoneyType.Invite}${inviteCodeInfo.msg}`;
            this.paint();
        });
        getUserInfo().then(userInfo => {
            this.props.nickName = `"${userInfo.nickName}"`;
            this.paint();
        });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        if (this.props.okCB) {
            this.props.okCB && this.props.okCB();
            setTimeout(() => {
                this.ok && this.ok();
            },500);
        } else {
            this.ok && this.ok();
        }
    }
    public refreshPage() {
        this.initData();
    }
    public copyAddr() {
        copyToClipboard(this.props.inviteCode);
        popNewMessage(this.language.tips[0]);
    }
    // 我的邀请
    public myInvite() {
        popNew('earn-client-app-view-share-myInviteUsers');
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

    public baseShare(platform: number) {
        ShareToPlatforms.makeScreenShot({
            success: (result) => { 
                ShareToPlatforms.shareScreenShot({
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
}
