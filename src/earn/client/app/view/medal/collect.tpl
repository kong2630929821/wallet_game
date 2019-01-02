<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"收集","zh_Hant":"收集","en":""} }}
    <widget style="position: fixed;width: 100%;" w-tag="app-components1-topBar-topBar2">{scrollHeight:{{it.scrollHeight}},text:{{topBarTitle}} }</widget>

    <div w-class="content" on-scroll="scrollPage">
        {{% 我的勋章等级}}
        <div w-class="myCollect">
            <div w-class="myMedal-top">
                <div w-class="flex-col">
                    <widget w-class="top-big-text" w-tag="pi-ui-lang">{"zh_Hans":"4枚","zh_Hant":"4枚","en":""}</widget>
                    <widget w-class="top-small-text" w-tag="pi-ui-lang">{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""}</widget>
                </div>
                <img src="../../res/image1/default_head.png" height="120px" />
                <div w-class="flex-col">
                    <widget w-class="top-big-text" w-tag="pi-ui-lang">{"zh_Hans":"7%","zh_Hant":"7%","en":""}</widget>
                    <widget w-class="top-small-text" w-tag="pi-ui-lang">{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""}</widget>
                </div>
            </div>
            <div style="display: flex;flex-direction: row-reverse;">
                <div w-class="share" w-tap="shareClick">
                    <img src="../../res/image1/share-white.png" height="48px" />
                    <widget w-class="myCollect-text" w-tag="pi-ui-lang">{"zh_Hans":"分享勋章画报","zh_Hant":"分享勋章画报","en":""}</widget>
                </div>
            </div>
        </div>

        <img src="../../res/image/cabinetTop-bg.png" width="100%" />
        <div w-class="collect-cabinet">
            {{for i,item of it.medalList}}
            <div w-class="collect-item flex-col">
                <widget w-class="medal-top-text" w-tag="pi-ui-lang">{{item.title}}</widget>
                <img on-tap="medalShow(e,{{item.id}})" src="../../res/image/medals/{{item.img}}.png" height="180px"/>
            </div>
            {{end}}

        </div>
    </div>

</div>