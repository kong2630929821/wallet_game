<div class="new-page" w-class="new-page" ev-refresh-click="refreshPage">
    <earn-client-app-view-activity-miningHome></earn-client-app-view-activity-miningHome>
    <div w-class="top-animate-container"  class="{{it.upAnimate}}">
        <div w-class="topbar-container" ><app-components1-topBar-topBar1>{avatar:{{it.avatar}},scrollHeight:0 }</app-components1-topBar-topBar1></div>
        <div w-class="mining-rank-copy" style="{{ !it.animateStart || it.scrollHeight >= 160 ? 'visibility: hidden;' : ''}}bottom: {{ -20 + it.scrollHeight}}px;"> 
            <img src="../../res/image/medals/medal8001.png" w-class="medal-img"/>
            <div w-class="mining-result">
                <div w-class="mining-title">挖矿</div>
                <div w-class="mining-number">{{it.miningKTnum}}KT</div>
            </div>
            {{if it.miningRank === 0}}
            <div w-class="rank-num">暂无排名</div>
            {{else}}
            <div w-class="rank-num">{{it.miningRank}}名</div>
            {{end}}
        </div>
    </div>
    <div w-class="contain" on-scroll="scrollPage" id="earn-home" class="{{it.downAnimate}}">
        <div w-class="mine-card" on-tap="miningClick">
            <div w-class="mining-rank" style="{{ it.animateStart ? 'visibility: hidden;' : ''}}" on-tap="goMineRank">
                <img src="../../res/image/medals/medal8001.png" w-class="medal-img"/>
                <div w-class="mining-result">
                    <div w-class="mining-title">挖矿</div>
                    <div w-class="mining-number">{{it.miningKTnum}}KT</div>
                </div>
                {{if it.miningRank === 0}}
                <div w-class="rank-num">暂无排名</div>
                {{else}}
                <div w-class="rank-num">{{it.miningRank}}名</div>
                {{end}}
            </div>
            <div w-class="explanation-box">
                <div w-class="explanation" on-tap="miningInstructionsClick"><span>采矿说明</span><img src="../../res/image1/explanation.png" w-class="explanation-icon"/></div>
            </div>
        </div>
        <div w-class="card-container">
            <div w-class="card">
                <div style="display: flex;align-items: center;">
                    <span w-class="welfare"><pi-ui-lang>{"zh_Hans":"热门活动","zh_Hant":"熱門活動","en":""}</pi-ui-lang></span>
                </div>

                <div w-class="welfare-container">
                    {{for i,item of it.hotActivities}}
                    <div w-class="welfare-activities-item" on-tap="goHotActivity({{i}})" class="welfare-activities-item">
                        <img src="../../res/image1/{{item.img}}"/>
                        <div w-class="welfare-box">
                            <div w-class="welfare-title">{{item.title}}</div>
                            <div w-class="welfare-desc">{{item.desc}}</div>
                        </div>
                    </div>
                    {{end}}
                </div>
            </div>
            <div w-class="card">
                <div style="display: flex;align-items: center;">
                    <span w-class="welfare"><pi-ui-lang>{"zh_Hans":"应用福利","zh_Hant":"應用福利","en":""}</pi-ui-lang></span>
                </div>
                <div w-class="welfare-container">
                    {{for i,item of it.applicationWelfares}}
                    <div w-class="welfare-activities-item" on-tap="goApplicationWelfares({{i}})" class="welfare-activities-item">
                        <img src="../../res/image1/{{item.img}}"/>
                        <div w-class="welfare-box">
                            <div w-class="welfare-title">{{item.title}}</div>
                            <div w-class="welfare-desc">{{item.desc}}</div>
                        </div>
                    </div>
                    {{end}}
                </div>
            </div>
        </div>
    </div>  
</div>