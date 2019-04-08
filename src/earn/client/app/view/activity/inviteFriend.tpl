<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshPage">
    <div w-class="inviteFrined" style="background-image: url({{it.bgImg}});background-size:contain;">
        <div w-class="inFrined">
            <div>
                <app-components-topBar-topBar2>{text:{{it.topBarTitle}} }</app-components-topBar-topBar2>
            </div>
            <div w-class="content" on-scroll="getMoreList">
                <div w-class="share_main" on-tap="myInvite">
                    <div w-class="meInvite">
                        <p w-class="span">我的邀请</p>
                    </div>
                </div>
                <div w-class="bottom">
                    <div w-class="source">
                        <span>{{it.nickName}}</span><span w-class="inviteCode">专属邀请码</span>
                    </div>
                    <div w-class="share_text1" on-tap="copyAddr">
                        <div w-class="inviteCode">{{it.inviteCode}}</div>
                        <div w-class="copy">复制</div>
                    </div>
                    <div w-class="bgLogin">
                        <app-components-qrcode-qrcode>{value:{{it.shareUrl}},size:"300"}</app-components-qrcode-qrcode>
                    </div>
                    <div w-class="share_text">
                        <widget w-tag="pi-ui-lang">{{it.quickInvitation}}</widget>
                    </div>
                    <div w-class="share_icon">
                        <div w-class="img-box" on-tap="shareToWechat">
                            <img src="app/res/image/img_share_wechat.png" height="60px" />
                        </div>
                        <div w-class="img-box" on-tap="shareToFriends">
                            <img src="app/res/image/img_share_wechatArea.png" height="60px" />
                        </div>
                        <div w-class="img-box" on-tap="shareToQQSpace">
                            <img src="app/res/image/img_share_qqArea.png" height="60px" />
                        </div>
                        <div w-class="img-box" on-tap="shareToQQ">
                            <img src="app/res/image/img_share_qq.png" height="60px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>>
    </div>
</div>