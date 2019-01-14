<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div style="background:black;">
        {{: topBarTitle = {"zh_Hans":"详情","zh_Hant":"详情","en":""} }}
        <widget w-tag="app-components1-topBar-topBar2">{scrollHeight:0,text:{{topBarTitle}} }</widget>
    </div>

    <div w-class="content">
        <div>
            <widget w-tag="earn-client-app-view-components-guessItem">{showOdds:true}</widget>
            <div w-class="guess-box">

                <div w-class="guess-btn-box">
                    <div on-tap="guess(e,0)" w-class="guess-btn left-guessbtn">为IG加油</div>
                    <div on-tap="guess(e,1)" w-class="guess-btn right-guessbtn">为IG加油</div>
                </div>



                <div w-class="input-box" ev-input-change="inputChange">
                    {{% 竞猜ST输入}}
                    <div style="height:50%">
                        {{: inputPlace = {"zh_Hans":"输入加油ST","zh_Hant":"输入加油ST","en":""} }}
                        <app-components1-input-input>{itype:"moneyNum",maxLength:7,placeHolder:{{inputPlace}},input:{{it.guessSTnum}},style:"padding:0;background:transparent;color:white;text-align:center"}</app-components1-input-input>
                    </div>

                    {{% 预计收益}}
                    <div w-class="predict">
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"0.1ST","zh_Hant":"0.1ST","en":""}</widget>
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"预测收益","zh_Hant":"預測收益","en":""}</widget>
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"0.5ST","zh_Hant":"0.5ST","en":""}</widget>
                    </div>
                </div>


                <widget w-class="tip" w-tag="pi-ui-lang">{"zh_Hans":"当前收益仅供参考，具体以结束时为准","zh_Hant":"当前收益仅供参考，具体以结束时为准","en":""}</widget>
            </div>
        </div>


        <div w-class="bottom">
            <widget w-tag="pi-ui-lang">{"zh_Hans":"我的ST：{{it.selfSTnum}}ST","zh_Hant":"我的ST：{{it.selfSTnum}}ST","en":""}</widget>
            <div style="display: flex;">
                <widget w-class="btn" w-tag="pi-ui-lang">{"zh_Hans":"充值","zh_Hant":"充值","en":""}</widget>
                <widget w-class="btn" w-tag="pi-ui-lang">{"zh_Hans":"广告送ST","zh_Hant":"广告送ST","en":""}</widget>
            </div>
        </div>
    </div>

</div>