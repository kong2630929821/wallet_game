<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"勋章","zh_Hant":"勳章","en":""} }}
    <widget w-tag="app-components1-topBar-topBar2">{scrollHeight:0,text:{{topBarTitle}} }</widget>

    <div w-class="content flex-col" class="fadein">
        <div w-class="medal"  id="medalShow">
            <img class="sunShine" src="../../res/image/medalShow-bg.png" height="100%"/>
            <img w-class="medal-img" src="../../res/image/medals/medal.png" height="440px" alt=""/>
        </div>
        <div w-class="flex-col" style="margin-top: -100px;">
            <widget w-class="medal-title" w-tag="pi-ui-lang">{"zh_Hans":"孑然一身","zh_Hant":"孑然一​​身","en":""}</widget>
            <widget w-class="medal-desc" w-tag="pi-ui-lang">{"zh_Hans":"挖矿达到2500KT","zh_Hant":"挖礦達到2500KT","en":""}</widget>
        </div>
        <widget w-class="medal-btn" w-tag="pi-ui-lang">{"zh_Hans":"挂出去","zh_Hant":"掛出去","en":""}</widget>
    </div>
</div>