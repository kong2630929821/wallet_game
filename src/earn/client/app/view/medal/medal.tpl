<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"勋章成就","zh_Hant":"勳章成就","en":""} }}
    <widget style="position: fixed;width: 100%;" w-tag="app-components1-topBar-topBar2">{scrollHeight:{{it.scrollHeight}},text:{{topBarTitle}} }</widget>

    <div w-class="content flex-col" on-scroll="scrollPage">
        <div w-class="content-bg">
            {{% 我的勋章等级}}
            <div w-class="myMedal mat">
                <div w-class="myMedal-top">
                    <img src="../../res/image/big_mine_active.png" height="100%" style="margin-right:20px;" />
                    <div style="display: flex;flex-direction: column;align-items: left;">
                        <widget w-class="myMedal-text" w-tag="pi-ui-lang">{"zh_Hans":"孑然一身","zh_Hant":"孑然一​​身","en":""}</widget>
                        <widget w-class="myMedal-rank" w-tag="pi-ui-lang">{"zh_Hans":"等级：穷人I","zh_Hant":"等級：窮人I","en":""}</widget>
                    </div>
                </div>
                <div w-class="myCollect">
                    <div w-class="myCollect-box" on-tap="goMyCollect">
                        <widget w-class="myCollect-text" w-tag="pi-ui-lang">{"zh_Hans":"我的收集","zh_Hant":"我的收集","en":""}</widget>
                        <span>4/24</span>
                        <img src="../../res/image1/rightArrow-white.png" height="48px" />
                    </div>
                    <div w-class="share">
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
                    <div w-class="flex-col">
                        <img src="../../res/image1/{{item1.img}}.png" height="120px" />
                        <widget w-class="allMedal-item-text" w-tag="pi-ui-lang">{{item1.title}}</widget>
                    </div>
                    {{end}}

                </div>
            </div>
            {{end}}

        </div>
    </div>

</div>