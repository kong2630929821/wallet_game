<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refresh">
    {{: topBarTitle = {"zh_Hans":"勋章成就","zh_Hant":"勳章成就","en":""} }}
    <widget style="position: fixed;width: 100%;" w-tag="app-components1-topBar-topBar2">{scrollHeight:{{it.scrollHeight}},text:{{topBarTitle}} }</widget>

    <div w-class="content flex-col" on-scroll="scrollPage">
        <div w-class="content-bg">
            {{% 我的勋章等级}}
            <div w-class="myMedal mat">
                <div w-class="myMedal-top">
                    <img src="../../res/image/medals/medal{{it.mineMedal.rankMedal}}.png" height="100%" style="margin-right:20px;" />
                    <div style="display: flex;flex-direction: column;align-items: left;width: 100%">
                        <widget w-class="myMedal-text" w-tag="pi-ui-lang">{{it.mineMedal.desc}}</widget>
                        <div w-class="rank-desc">
                            <widget style="font-size: 24px;" w-tag="pi-ui-lang">{{it.mineMedal.desc}}</widget>
                            <widget style="font-size: 24px;" w-tag="pi-ui-lang">{"zh_Hans":"下一等级还需：{{it.mineMedal.nextNeedKt}}KT","zh_Hant":"下一等級還需：{{it.mineMedal.nextNeedKt}}KT","en":""}</widget>
                        </div>
                        <div w-class="total-linear">
                            <div style="width:{{it.mineMedal.ktNum / (it.mineMedal.ktNum+it.mineMedal.nextNeedKt) * 100}}%;height: 100%;">
                                <div w-class="now-linear" class="gradually-width"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div w-class="myCollect">
                    <div w-class="myCollect-box" on-tap="goMyCollect">
                        <widget w-class="myCollect-text" w-tag="pi-ui-lang">{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""}</widget>
                        <span>{{it.collectMedal}}/{{it.totalMedal}}</span>
                        <img src="../../res/image1/rightArrow-white.png" height="48px" />
                    </div>
                    <div w-class="share" on-tap="shareClick">
                        <img src="../../res/image1/share-white.png" height="48px" />
                        <widget w-class="myCollect-text" w-tag="pi-ui-lang">{"zh_Hans":"分享勋章画报","zh_Hant":"分享勋章画报","en":""}</widget>
                    </div>
                </div>
            </div>
        </div>
        <div w-class="body">

            {{% 所有勋章等级}}

            {{for i,item of it.medalList}}
            <div w-class="allMedal mat flex-col">
                <div w-class="allMedal-top">
                    <widget w-class="allMedal-title" w-tag="pi-ui-lang">{{item.title}}</widget>
                </div>
                <div w-class="allMedal-bottom">
                    {{for j,item1 of item.medal}}
                    <div w-class="flex-col" on-tap="medalShow(e,{{item1.id}})">
                        <img src="../../res/image/medals/{{item1.img}}.png" height="120px" />
                        <widget w-class="allMedal-item-text" w-tag="pi-ui-lang">{{item1.title}}</widget>
                    </div>
                    {{end}}

                </div>
            </div>
            {{end}}

        </div>
    </div>

</div>