<div class="new-page" w-class="new-page">
    <div w-class="body">
        <div w-class="choose-tip"><widget w-tag="pi-ui-lang">{"zh_Hans":"选择锄头","zh_Hant":"選擇鋤頭","en":""}</widget></div>
        <div w-class="holded-hoes" >
            <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.IronHoe}})">
                <earn-client-app-view-activity-components-holdedHoe>{ holdedNumber:{{ it.ironHoe }},hoeType:{{ it.hoeType.IronHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-view-activity-components-holdedHoe>
            </div>
            <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.GoldHoe}})">
                <earn-client-app-view-activity-components-holdedHoe style="margin:0 15px;">{ holdedNumber:{{ it.goldHoe }},hoeType:{{ it.hoeType.GoldHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-view-activity-components-holdedHoe>
            </div>
            <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.DiamondHoe}})">
                <earn-client-app-view-activity-components-holdedHoe>{ holdedNumber:{{ it.diamondHoe }},hoeType:{{ it.hoeType.DiamondHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-view-activity-components-holdedHoe>
            </div>
        </div>
        <div w-class="digging-num"><widget w-tag="pi-ui-lang">{"zh_Hans":"今日已挖矿山 {{ it.miningedNumber }}/{{ it.mineMax }} 座","zh_Hant":"今日已挖礦山 {{ it.miningedNumber }}/{{ it.mineMax }} 座","en":""}</widget></div>
        <div w-class="digging-tips"><widget w-tag="pi-ui-lang">{{it.miningTips}}</widget></div>
        <div w-class="award-container">
            <div w-class="award-item">
                <img src="../../../res/image/KT.png" w-class="award-icon"/>
                {{if it.awardTypes[it.allAwardType.KT] }}
                <div w-class="award-num">+<span>{{ it.awardTypes[it.allAwardType.KT] }}</span></div>
                {{end}}
            </div>
            <div w-class="award-item">
                <img src="../../../res/image/GT.png" w-class="award-icon" />
                {{if it.awardTypes[it.allAwardType.ST] }}
                <div w-class="award-num">+<span>{{ it.awardTypes[it.allAwardType.ST] }}</span></div>
                {{end}}
            </div>
            <div w-class="award-item">
                <img src="../../../res/image/ETH.png" w-class="award-icon"/>
                {{if it.awardTypes[it.allAwardType.ETH] }}
                <div w-class="award-num">+<span>{{ it.awardTypes[it.allAwardType.ETH] }}</span></div>
                {{end}}
            </div>
            <div w-class="award-item">
                <img src="../../../res/image/BTC.png" w-class="award-icon"/>
                {{if it.awardTypes[it.allAwardType.BTC] }}
                <div w-class="award-num">+<span>{{ it.awardTypes[it.allAwardType.BTC] }}</span></div>
                {{end}}
            </div>
        </div>
        <div w-class="mine-area">
            {{for index,item of it.haveMines}}
            <div ev-mine-click="mineClick" w-class="mine-item" style="{{ item.location }}">
                <earn-client-app-view-activity-components-mine>{ 
                    mineType:{{ item.type }},
                    mineId:{{ item.id }}
                    hp:{{item.hp}},
                    selectedHoe:{{ it.hoeSelected }},
                    selected:{{ item.type === it.mineType && item.id === it.mineId}},
                    lossHp:{{ it.lossHp }},
                    beginMining:{{ it.countDownStart }}
                }</earn-client-app-view-activity-components-mine>
            </div>
            {{end}}
        </div>
        <div w-class="box1">
            <div w-class="ad-items">
                <div w-class="ad-item">
                    <div w-class="gift-box">
                        <img src="../../../res/image/advertisement.png"/>
                    </div>
                    <div w-class="action-tips"><widget w-tag="pi-ui-lang">{"zh_Hans":"看广告得锄头","zh_Hant":"看廣告得鋤頭","en":""}</widget></div>
                </div>
                <div w-class="ad-item" style="margin:0 35px 0 20px"  on-tap="signInClick">
                    <div w-class="gift-box">
                        <img src="../../../res/image1/gift.png"/>
                    </div>
                    <div w-class="action-tips"><widget w-tag="pi-ui-lang">{"zh_Hans":"签到豪礼","zh_Hant":"簽到豪禮","en":""}</widget></div>
                </div>
                <div w-class="ad-item" on-tap="welfareClick">
                    <div w-class="gift-box">
                        <img src="../../../res/image1/gift.png"/>
                    </div>
                    <div w-class="action-tips"><widget w-tag="pi-ui-lang">{"zh_Hans":"福利活动","zh_Hant":"福利活動","en":""}</widget></div>
                </div>
            </div>
            <img src="../../../res/image/close_mine.png" w-class="close" on-tap="closeClick"/>
        </div>
        
    </div>
</div>