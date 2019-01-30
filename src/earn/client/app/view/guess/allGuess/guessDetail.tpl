<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="initData">
    <div style="background:black;">
        {{: topBarTitle = {"zh_Hans":"详情","zh_Hant":"详情","en":""} }}
        <widget w-tag="app-components1-topBar-topBar2">{scrollHeight:0,text:{{topBarTitle}} }</widget>
    </div>

    <div w-class="content">
        <div>
            <widget w-tag="earn-client-app-components-guessItem-guessItem">{showOdds:true,guessData:{{it.guessData}},showBtn:false }</widget>
            <div w-class="guess-box">

                <div w-class="guess-btn-box">
                    <div on-tap="btnClick(e,2,1)" w-class="guess-btn left-guessbtn">为{{it.guessData.team1}}加油</div>
                    <div on-tap="btnClick(e,2,2)" w-class="guess-btn right-guessbtn">为{{it.guessData.team2}}加油</div>
                </div>



                <div w-class="input-box" ev-input-change="inputChange">
                    {{% 竞猜ST输入}}
                    <div style="height:50%">
                        {{: inputPlace = {"zh_Hans":"0.1"+ it.stShow,"zh_Hant":"0.1" + it.stShow,"en":""} }}
                        <app-components1-input-input>{itype:"moneyNum1",maxLength:7,placeHolder:{{inputPlace}},input:{{it.defaultGuessStNum}},style:"padding:0;background:transparent;color:white;text-align:center"}</app-components1-input-input>
                    </div>

                    {{% 预计收益}}
                    <div w-class="predict">
                        <span>{{it.predictEarnTeam1}}&nbsp;{{it.stShow}}</span>
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"预测收益","zh_Hant":"預測收益","en":""}</widget>
                        <span>{{it.predictEarnTeam2}}&nbsp;{{it.stShow}}</span>
                    </div>
                </div>


                <widget w-class="tip" w-tag="pi-ui-lang">{"zh_Hans":"当前收益仅供参考，具体以结束时为准","zh_Hant":"当前收益仅供参考，具体以结束时为准","en":""}</widget>
            </div>
        </div>


        <div w-class="bottom">
            <widget w-tag="pi-ui-lang">{"zh_Hans":"我的{{it.stShow}}：{{it.selfSTnum}}{{it.stShow}}","zh_Hant":"我的{{it.stShow}}：{{it.selfSTnum}}{{it.stShow}}","en":""}</widget>
            <div style="display: flex;">
                <widget w-class="btn" on-tap="btnClick(e,1)" w-tag="pi-ui-lang">{"zh_Hans":"充值","zh_Hant":"充值","en":""}</widget>
                <widget w-class="btn" on-tap="btnClick(e,0)" w-tag="pi-ui-lang">{"zh_Hans":"广告送{{it.stShow}}","zh_Hant":"广告送{{it.stShow}}","en":""}</widget>
            </div>
        </div>
    </div>

</div>