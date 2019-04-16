<div class="new-page" w-class="new-page" ev-refresh-click="refreshPage">
    <earn-client-app-view-activity-miningHome></earn-client-app-view-activity-miningHome>
    <div w-class="top-animate-container"  class="{{it.upAnimate}}">
        <div w-class="topbar-container" ><app-components1-topBar-topBar1>{avatar:{{it.avatar}},scrollHeight:0 }</app-components1-topBar-topBar1></div>
        <app-components1-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-components1-offlineTip-offlineTip>
        <div w-class="mining-rank-copy" style="{{ !it.animateStart || it.scrollHeight >= 160 ? 'visibility: hidden;' : ''}}bottom: {{ -20 + it.scrollHeight}}px;"> 
            <img src="../../res/image/medals/medal{{it1.miningMedalId}}.png" w-class="medal-img"/>
            <div w-class="mining-result">
                <div w-class="mining-title">{{it.ktShow}}排名</div>
                <div w-class="mining-number">
                    <img w-class="ktShowNum" src="../../res/image/KT.png" alt=""/>&nbsp;
                    {{it1.miningKTnum}}
                </div>
            </div>
            {{if it1.miningRank === 0}}
            <div w-class="rank-num">暂无排名</div>
            {{else}}
            <div w-class="rank-num">{{it1.miningRank}}名</div>
            {{end}}
        </div>
    </div>
    <div w-class="contain" on-scroll="scrollPage" id="earn-home" class="{{it.downAnimate}}">
        <div w-class="mine-card" on-tap="miningClick">
            <div w-class="mining-rank" style="{{ it.animateStart ? 'visibility: hidden;' : ''}}" on-tap="goMineRank">
                <img src="../../res/image/medals/medal{{it1.miningMedalId}}.png" w-class="medal-img"/>
                <div w-class="mining-result">
                    <div w-class="mining-title">{{it.ktShow}}排名</div>
                    <div w-class="mining-number">
                        <img w-class="ktShowNum" src="../../res/image/KT.png" alt=""/>&nbsp;
                        {{it1.miningKTnum}}
                    </div>
                </div>
                {{if it1.miningRank === 0}}
                <div w-class="rank-num">暂无排名</div>
                {{else}}
                <div w-class="rank-num">{{it1.miningRank}}名</div>
                {{end}}
            </div>
            <div w-class="explanation-box" >
                <div w-class="explanation" on-down="onShow" on-tap="miningInstructionsClick"><span>采矿说明</span><img src="../../res/image1/explanation.png" w-class="explanation-icon"/></div>
            </div>
        </div>
        <div w-class="card-container">
            {{if it.isLogin}}
            <div w-class="card">
                <div style="display: flex;align-items: center;">
                    <span w-class="welfare">
                        <span w-class="left-span"></span>
                        <pi-ui-lang>{"zh_Hans":"签到奖励","zh_Hant":"簽到獎勵","en":""}</pi-ui-lang>
                    </span>
                </div>

                <div w-class="signIn-container">
                    {{for i,v of it1.awards}}
                    {{: flag = it1.signInDays >= v.days }}
                    <div w-class="signIn-item">
                        <div w-class="signIn-imgDiv" style="background:{{flag?'#CCCCCC':'#FCDC3C'}}">
                            <img src="../../res/image/{{v.prop}}.png" w-class="signIn-img"/>
                        </div>
                        <div style="color:{{flag?'#CCCCCC':'#F39439'}}">{{flag?"已签":v.days+"天"}}</div>
                    </div>
                    {{end}}
                </div>
            </div>
            {{end}}

            <div w-class="card">
                <div style="display: flex;align-items: center;">
                    <span w-class="welfare">
                        <span w-class="left-span"></span>
                        <pi-ui-lang>{"zh_Hans":"新手任务","zh_Hant":"新手任務","en":""}</pi-ui-lang>
                    </span>
                </div>

                <div w-class="welfare-container">
                    {{for i,item of it.noviceTask}}
                        {{if !item.complete && item.show}}
                        <div w-class="welfare-noviceTask-item"  on-tap="goNoviceTask({{i}})" on-down="onShow">
                            <div>
                                <div w-class="noviceTask-title">
                                    {{item.title}}
                                    {{if item.img}}
                                    <img src="../../res/image/{{item.img}}" style="width:50px;margin:0 10px;vertical-align: bottom"/>
                                    {{end}}
                                    {{if item.addOne}}
                                    <span w-class="add-one">+1</span>
                                    {{end}}
                                </div>
                                <div w-class="welfare-desc">{{item.desc}}</div>
                            </div>
                            <div w-class="welfare-btn">{{item.btn}}</div>
                        </div>
                        {{end}}
                    {{end}}
                </div>
            </div>
            <div w-class="card">
                <div style="display: flex;align-items: center;margin-top: 50px;">
                    <span w-class="welfare">
                        <span w-class="left-span"></span>
                        <pi-ui-lang>{"zh_Hans":"热门活动","zh_Hant":"熱門活動","en":""}</pi-ui-lang>
                    </span>
                </div>
                <div w-class="welfare-container">
                    {{for i,item of it.hotActivities}}
                    {{if !item.hidden}}
                    <div w-class="welfare-activities-item" on-tap="goHotActivity({{i}})" class="welfare-activities-item" on-down="onShow">
                        <img src="../../res/image1/{{item.img}}"/>
                        <div w-class="welfare-box">
                            <div w-class="welfare-title">{{item.title}}</div>
                            <div w-class="welfare-desc">{{item.desc}}</div>
                        </div>
                    </div>
                    {{end}}
                    {{end}}
                </div>
            </div>
        </div>
    </div>  
</div>