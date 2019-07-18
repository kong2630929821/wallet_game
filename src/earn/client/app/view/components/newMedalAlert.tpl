<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="content flex-col" class="popBoxFadeIn {{it.fadeOut ? 'popBoxFadeOut' : ''}}">
        {{if !it.shareUrl}}
        <div w-class="closeImg" on-tap="backPrePage">
            <img w-class="closeMedal" src="../../res/image1/close-white.png" style="padding: 15px;border: 2px solid white;border-radius: 50%;" width="36px" height="36px" alt="" />
        </div>
        {{end}}
        <div w-class="medal"  id="medalShow">
            <img class="sunShine" src="../../res/image/medalShow_bg.png" width="750px" height="750px"/>
            <img w-class="medal-img" src="../../res/image/medals/{{it.medalImg}}.png" width="480px"/>
        </div>
        <div w-class="flex-col" style="margin-top: -100px;">
            <widget w-class="medal-title" w-tag="pi-ui-lang">{{it.medalTitle}}</widget>

            {{if it.medalType===0}}
                <widget w-class="medal-desc" w-tag="pi-ui-lang">{"zh_Hans":"挖矿达到{{it.condition}}{{it.ktShow}}","zh_Hant":"挖礦達到{{it.condition}}{{it.ktShow}}","en":""}</widget>
            {{else}}
                <p w-class="medal-desc">{{it.coinShow}}</p>
            {{end}}

            <div w-class="other">
                <div w-class="other-say">
                    <widget style="font-size: 32px;" w-tag="pi-ui-lang">{"zh_Hans":"成功就是比别人优秀一点点","zh_Hant":"成功就是比別人優秀一點點","en":"Success is a little better than others."}</widget>
                    <span style="font-size: 26px;text-align: right;">by {{it.userInfo.nickName}}</span>
                </div>
                <div w-class="avatar" style="background-image:url({{it.userInfo.avatar}});background-size:100% 100%"></div>
              
            </div>
        </div>

        {{if !it.shareUrl}}
        <div w-class="content-bottom" on-tap="shareWX">
            <img src="../../res/image1/img_share_wechat.png" style="background: white;border-radius: 50%;padding: 5px;" alt="" width="45px" height="45px"/>
            <widget w-class="medal-btn" w-tag="pi-ui-lang">{"zh_Hans":"秀一下","zh_Hant":"秀一下","en":""}</widget>
        </div>
        {{else}}
        <div style="text-align:center;background:#fff;padding: 0 10px 10px;">
            <app-components-qrcode-qrcode>{value:{{it.shareUrl}},size:150}</app-components-qrcode-qrcode>
        </div>
        {{end}}
    </div>
</div>