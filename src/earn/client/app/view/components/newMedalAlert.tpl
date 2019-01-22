<div class="new-page" w-class="new-page" on-tap="backPrePage" ev-back-click="backPrePage">
    <div w-class="content flex-col" class="fadein">
        <div w-class="medal"  id="medalShow">
                <img class="sunShine" src="../../res/image/medalShow-bg.png" width="480px" height="480px"/>
            <img w-class="medal-img" src="../../res/image/medals/{{it.medalImg}}.png" width="480px"/>
        </div>
        <div w-class="flex-col" style="margin-top: -100px;">
            <widget w-class="medal-title" w-tag="pi-ui-lang">{{it.medalTitle}}</widget>

            {{if it.medalType===0}}
                <widget w-class="medal-desc" w-tag="pi-ui-lang">{"zh_Hans":"挖矿达到{{it.condition}}KT","zh_Hant":"挖礦達到{{it.condition}}KT","en":""}</widget>
            {{else}}
                <p w-class="medal-desc">{{it.condition}}</p>
            {{end}}

            <div w-class="other">
                <div w-class="other-say">
                    <widget style="font-size: 32px;" w-tag="pi-ui-lang">{"zh_Hans":"成功就是比别人优秀一点点","zh_Hant":"成功就是比别人优秀一点点","en":""}</widget>
                    <widget style="font-size: 26px;text-align: right;" w-tag="pi-ui-lang">{"zh_Hans":"by {{it.userInfo.name}}","zh_Hant":"by {{it.userInfo.name}}","en":""}</widget>
                </div>
                {{if }}
                <img src="{{it.userInfo.avatar?it.userInfo.avatar:'../../res/image1/default_head.png'}}" height="100px" width="100px" alt="" />
            </div>

        </div>
        <widget w-class="medal-btn" w-tag="pi-ui-lang">{"zh_Hans":"秀一下","zh_Hant":"秀一下","en":""}</widget>
    </div>
</div>