<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"收集","zh_Hant":"收集","en":""} }}
    <widget style="z-index: 1;" w-tag="app-components1-topBar-topBar2">{scrollHeight:{{it.scrollHeight}},text:{{topBarTitle}} }</widget>

    <div w-class="content flex-col" on-scroll="scrollPage">
        {{% 我的勋章等级}}
        <div w-class="myCollect">
            <div w-class="myMedal-top">
                <div w-class="flex-col">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"4枚","zh_Hant":"4枚","en":""}</widget>
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""}</widget>
                </div>
                <img src="../../res/image1/default_head.png" height="120px" />
                <div w-class="flex-col">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"4枚","zh_Hant":"4枚","en":""}</widget>
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""}</widget>
                </div>
            </div>
            <div style="display: flex;flex-direction: row-reverse;">
                <div w-class="share">
                    <img src="../../res/image1/share-white.png" height="48px" />
                    <widget w-class="myCollect-text" w-tag="pi-ui-lang">{"zh_Hans":"分享勋章画报","zh_Hant":"分享勋章画报","en":""}</widget>
                </div>
            </div>
        </div>
    </div>

</div>