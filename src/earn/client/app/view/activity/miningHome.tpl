<div class="new-page" w-class="new-page" style="z-index: {{it.zIndex}};">
    <div w-class="body">
        <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
        <div w-class="container">
            <div w-class="holded-hoes" style="{{it.zIndex ? 'visibility: hidden;' : ''}}">
                <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.IronHoe}})">
                    <earn-client-app-components-holdedHoe-holdedHoe>{ holdedNumber:{{ it.ironHoe }},hoeType:{{ it.hoeType.IronHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-components-holdedHoe-holdedHoe>
                </div>
                <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.GoldHoe}})">
                    <earn-client-app-components-holdedHoe-holdedHoe style="margin:0 15px;">{ holdedNumber:{{ it.goldHoe }},hoeType:{{ it.hoeType.GoldHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-components-holdedHoe-holdedHoe>
                </div>
                <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.DiamondHoe}})">
                    <earn-client-app-components-holdedHoe-holdedHoe>{ holdedNumber:{{ it.diamondHoe }},hoeType:{{ it.hoeType.DiamondHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-components-holdedHoe-holdedHoe>
                </div>
            </div>
            <div w-class="digging-num" style="{{it.zIndex ? 'visibility: hidden;' : ''}}"><widget w-tag="pi-ui-lang">{"zh_Hans":"今日已挖矿山 {{ it.miningedNumber }}/{{ it.mineMax }} 座","zh_Hant":"今日已挖礦山 {{ it.miningedNumber }}/{{ it.mineMax }} 座","en":""}</widget></div>
            <div w-class="digging-tips" style="{{it.zIndex ? 'visibility: hidden;' : ''}}"><widget w-tag="pi-ui-lang">{{it.miningTips}}</widget></div>
            <div w-class="award-container" style="{{it.zIndex ? 'visibility: hidden;' : ''}}">
                <div w-class="award-item">
                    <img src="../../res/image/KT.png" w-class="award-icon"/>
                    {{if it.awardTypes[it.allAwardType.KT] }}
                    <div w-class="award-num">+<span>{{ it.awardTypes[it.allAwardType.KT] }}</span></div>
                    {{end}}
                </div>
                <div w-class="award-item">
                    <img src="../../res/image/ST.png" w-class="award-icon" />
                    {{if it.awardTypes[it.allAwardType.ST] }}
                    <div w-class="award-num">+<span>{{ it.awardTypes[it.allAwardType.ST] }}</span></div>
                    {{end}}
                </div>
                <div w-class="award-item">
                    <img src="../../res/image/ETH.png" w-class="award-icon"/>
                    {{if it.awardTypes[it.allAwardType.ETH] }}
                    <div w-class="award-num">+<span>{{ it.awardTypes[it.allAwardType.ETH] }}</span></div>
                    {{end}}
                </div>
                <div w-class="award-item">
                    <img src="../../res/image/BTC.png" w-class="award-icon"/>
                    {{if it.awardTypes[it.allAwardType.BTC] }}
                    <div w-class="award-num">+<span>{{ it.awardTypes[it.allAwardType.BTC] }}</span></div>
                    {{end}}
                </div>
            </div>
            <div w-class="mine-area">
                {{for index,item of it.haveMines}}
                <div ev-mine-click="mineClick" w-class="mine-item" style="{{ item.location }}">
                    <earn-client-app-components-mine-mine>{ 
                        mineType:{{ item.type }},
                        mineId:{{ item.id }}
                        hp:{{item.hp}},
                        selectedHoe:{{ it.hoeSelected }},
                        selected:{{ item.type === it.mineType && item.id === it.mineId}},
                        lossHp:{{ it.lossHp }},
                        hoeSelectedLeft:{{ it.hoeSelectedLeft }},
                        beginMining:{{ it.countDownStart }},
                        countDown:{{ it.countDown }}
                    }</earn-client-app-components-mine-mine>
                </div>
                {{end}}
            </div>
            <div w-class="ad-item">
                <img src="../../res/image/advertisement.png"/>
                <div w-class="action-tips"><widget w-tag="pi-ui-lang">{"zh_Hans":"看广告得锄头","zh_Hant":"看廣告得鋤頭","en":""}</widget></div>
            </div>
            <img src="../../res/image/close_mine.png" w-class="close" on-tap="closeClick"/>
        </div>
    </div>
</div>