<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div style="background:black;">
        {{: topBarTitle = {"zh_Hans":"详情","zh_Hant":"详情","en":""} }}
        <widget w-tag="app-components1-topBar-topBar2">{scrollHeight:0,text:{{topBarTitle}} }</widget>
    </div>

    <div w-class="content">
        <div w-class="detail">
            <div w-class="detail-box">
                <div w-class="detail-box-top">
                    {{if it.guessData.state !== 2}}
                        <img src="../../../res/image/guessing-team.png" style="transform: translateY(-100px);" width="200px" height="200px" />
                        <div style="margin-top:-70px">竞赛中</div>
                    {{else}}
                        {{if it.guessData.result ===1}}
                        <img src="../../../res/image/guessTeam/{{it.guessData.team1}}.png" style="transform: translateY(-100px);" width="200px" height="200px" />
                        <div style="margin-top:-70px">{{it.guessData.team1}}胜</div>
                        {{elseif it.guessData.result ===2}}
                        <img src="../../../res/image/guessTeam/{{it.guessData.team2}}.png" style="transform: translateY(-100px);" width="200px" height="200px" />
                        <div style="margin-top:-70px">{{it.guessData.team2}}胜</div>
                        {{elseif it.guessData.result ===3}}
                        <img src="../../../res/image/guessing-team.png" style="transform: translateY(-100px);" width="200px" height="200px" />
                        <div style="margin-top:-70px">比赛取消</div>
                        {{end}}
                    {{end}}
                </div>
                <div w-class="guess-box-detail">
                    <div w-class="detail-item">
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"购买时间","zh_Hant":"購買時間","en":""}</widget>
                        <span>{{it.guessing.time}}</span>
                    </div>
                    <div w-class="detail-item">
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"购买比赛","zh_Hant":"購買比賽","en":""}</widget>
                        <span>{{it.guessData.team1}}&nbsp;vs&nbsp;{{it.guessData.team2}}</span>
                    </div>
                    <div w-class="detail-item">
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"我的竞猜","zh_Hant":"我的競猜","en":""}</widget>
                        <span>{{it.guessing.guessTeam}}&nbsp;胜</span>
                    </div>
                    <div w-class="detail-item">
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"我的购买","zh_Hant":"我的購買","en":""}</widget>
                        <span>{{it.guessing.guessSTnum}}&nbsp;ST</span>
                    </div>
                    <div w-class="detail-item">
                        {{if it.guessData.state !== 2}}
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"预期收益","zh_Hant":"預期收益","en":""}</widget>
                        {{else}}
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"实际收益","zh_Hant":"實際收益","en":""}</widget>
                        {{end}}
                        <span>{{it.guessing.benefit}}&nbsp;ST</span>
                    </div>
                </div>
            </div>
            {{if it.guessData.state !== 2}}
            <div w-class="btn1" on-tap="continueGuess">继续加油</div>
            {{else}}
            <div w-class="btn1" on-tap="backPrePage">返回</div>
            {{end}}
            <div w-class="btn2" on-tap="shareClick">分享</div>
        </div>
    </div>

</div>