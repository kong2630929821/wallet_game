<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"勋章","zh_Hant":"勳章","en":""} }}
    <widget w-tag="app-components-topBar-topBar2">{isOne:1,scrollHeight:0,text:{{topBarTitle}} }</widget>

    <div w-class="content flex-col" class="fadein">
        <div class="{{it.isHave?'':'grayscale'}}" id="medalShow" w-class="medal" style="transform:translate( {{it.moveX}}px , {{it.moveY}}px ) scale({{it.imgScale}});transition:{{it.imgScale !== 1?'none':'transform 0.5s ease'}};" >
            {{if it.isHave}}
                <img class="sunShine" src="../../res/image/medalShow_bg.png" width="750px" height="750px" />
            {{else}}
                <div class="sunShine" style="width:750px;height:750px"></div>
            {{end}}
            <img w-class="medal-img" src="../../res/image/medals/{{it.medalImg}}.png" width="480px" />
        </div>
        <div w-class="flex-col" style="margin-top: -100px;">
            <widget w-class="medal-title" w-tag="pi-ui-lang">{{it.medalTitle}}</widget>
            {{if it.medalType===0}}
                {{: tips1 = {"zh_Hans":"挖矿达到" + it.condition + it.ktShow,"zh_Hant":"挖礦達到" + it.condition + it.ktShow,"en":""} }}
                {{: tips2 = {"zh_Hans":"默认勋章","zh_Hant":"默認勳章","en":"" } }}
                {{: tips = it.condition ? tips1 : tips2 }}
                <widget w-class="medal-desc" w-tag="pi-ui-lang">{{tips}}</widget>
            {{else}}
                <p w-class="medal-desc">{{it.condition}}</p>
            {{end}}
        </div>
        <span></span>
    </div>
</div>