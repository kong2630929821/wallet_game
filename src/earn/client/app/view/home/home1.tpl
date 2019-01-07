<div class="new-page" style="display: flex;flex-direction: column;" ev-refresh-click="refreshPage">
    <div w-class="contain" on-scroll="scrollPage" id="earn-home">
        <div style="background:linear-gradient(90deg,rgba(49,141,230,1) 0%,rgba(56,207,231,1) 100%);"><app-components1-topBar-topBar1>{avatar:{{it.avatar}},scrollHeight:{{it.scrollHeight}} }</app-components1-topBar-topBar1></div>
        <div w-class="mine-card" on-tap="miningClick">
            <div w-class="holded-hoes">
                <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.IronHoe}})">
                    <earn-client-app-view-components-holdedHoe>{ holdedNumber:{{ it.ironHoe }},hoeType:{{ it.hoeType.IronHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-view-components-holdedHoe>
                </div>
                <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.GoldHoe}})">
                    <earn-client-app-view-components-holdedHoe style="margin:0 15px;">{ holdedNumber:{{ it.goldHoe }},hoeType:{{ it.hoeType.GoldHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-view-components-holdedHoe>
                </div>
                <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.DiamondHoe}})">
                    <earn-client-app-view-components-holdedHoe>{ holdedNumber:{{ it.diamondHoe }},hoeType:{{ it.hoeType.DiamondHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-view-components-holdedHoe>
                </div>
                <div w-class="gift-box">
                    <img src="../../res/image1/gift.png"/>
                </div>
            </div>
            <div w-class="explanation-box">
                <div w-class="explanation" on-tap="miningInstructionsClick"><span>采矿说明</span><img src="../../res/image1/explanation.png" w-class="explanation-icon"/></div>
                <div w-class="action">看广告得锄头</div>
            </div>
            <div w-class="mine" style="left:165px;bottom:150px;" on-tap="mineClick">
                <earn-client-app-view-components-mine>{ mineType:{{ it.maxMineType }},scale:2 }</earn-client-app-view-components-mine>
            </div>
            <div w-class="holded-mine">我的矿山</div>
            <div w-class="medals">
                <div w-class="box1">
                    <img src="../../res/image1/medal.png" w-class="box1-img"/>
                    <div w-class="tip">勋章成就</div>
                </div>
                <div w-class="box1">
                    <img src="../../res/image1/crown.png" w-class="box1-img"/>
                    <div w-class="tip">挖矿排名</div>
                </div>
               
            </div>
        </div>
        <div w-class="menuCard">
            <div w-class="oneBtn" on-tap="goNextPage(0)">
                <img src="../../res/image1/btn_yun_1.png" w-class="btnImg"/>
                <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"领分红","zh_Hant":"領分紅","en":""}</pi-ui-lang></div>
            </div>
            <div w-class="oneBtn" on-tap="goNextPage(1)">
                <img src="../../res/image1/btn_yun_2.png" w-class="btnImg"/>
                <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"发红包","zh_Hant":"發紅包","en":""}</pi-ui-lang></div>
            </div>
            <div w-class="oneBtn" on-tap="goNextPage(2)">
                <img src="../../res/image1/btn_yun_3.png" w-class="btnImg"/>
                <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"兑换码","zh_Hant":"兌換碼","en":""}</pi-ui-lang></div>
            </div>
            <div w-class="oneBtn" on-tap="goNextPage(3)">
                <img src="../../res/image1/btn_yun_4.png" w-class="btnImg"/>
                <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"做任务","zh_Hant":"做任務","en":""}</pi-ui-lang></div>
            </div>
        </div>

        <div style="display: flex;align-items: center;">
            <span w-class="welfare"><pi-ui-lang>{"zh_Hans":"福利活动","zh_Hant":"福利活動","en":""}</pi-ui-lang></span>
        </div>

        <div w-class="welfare-container">
            {{for i,item of it.welfareActivities}}
            <div w-class="welfare-activities-item" on-tap="goActivity({{i}})" class="welfare-activities-item">
                <img src="../../res/image1/{{item.img}}"/>
                <div w-class="welfare-box">
                    <div w-class="welfare-title">{{item.title}}</div>
                    <div w-class="welfare-desc">{{item.desc}}</div>
                </div>
            </div>
            {{end}}
        </div>
    </div>  
    <div w-class="bottomMode"></div>
</div>