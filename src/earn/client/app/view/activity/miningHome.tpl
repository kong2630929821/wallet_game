<div class="new-page" w-class="new-page" style="z-index: {{it1.zIndex}};">
    <div w-class="body">
        <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
        <div w-class="container">
            <div on-tap="clickTop" w-class="holded-hoes" style="{{it1.zIndex ? 'visibility: hidden;' : ''}}">
                <div id="stop" ev-hoe-click="selectHoeClick(e,{{it.hoeType.IronHoe}})">
                    <earn-client-app-components1-holdedHoe-holdedHoe>{ holdedNumber:{{ it.ironHoe }},hoeType:{{ it.hoeType.IronHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-components1-holdedHoe-holdedHoe>
                </div>
                <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.GoldHoe}})">
                    <earn-client-app-components1-holdedHoe-holdedHoe style="margin:0 15px;">{ holdedNumber:{{ it.goldHoe }},hoeType:{{ it.hoeType.GoldHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-components1-holdedHoe-holdedHoe>
                </div>
                <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.DiamondHoe}})">
                    <earn-client-app-components1-holdedHoe-holdedHoe>{ holdedNumber:{{ it.diamondHoe }},hoeType:{{ it.hoeType.DiamondHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-components1-holdedHoe-holdedHoe>
                </div>
            </div>
            {{if it.countDownStart || (it.hoeSelected !== -1 && it.hoeSelectedLeft !== 0) }}
            <div w-class="count-down-container" style="{{it1.zIndex ? 'visibility: hidden;' : ''}}">
                <div w-class="stopwatch-container"><img src="../../res/image/{{it.countDownStart ? 'stopwatch.gif' : 'stopwatch.png'}}" w-class="stopwatch"/></div>
                <div w-class="count-down-bg">
                    <div w-class="count-down" style="width:{{ (it.countDown / it.countDownMax * 100) + '%'}}; "></div>
                </div>
            </div>
            {{else}}
            <div style="{{it1.zIndex ? 'visibility: hidden;' : ''}}">
                <img src="../../res/image/select_hoe_tip.png" style="margin: 20px 0 0 21px;"/>
            </div>
            {{end}}
            <div on-tap="rightClick" w-class="award-container" style="{{it1.zIndex ? 'visibility: hidden;' : ''}}">
                <div w-class="award-title"><widget w-tag="pi-ui-lang">{"zh_Hans":"我的{{it.ktShow}}","zh_Hant":"我的{{it.ktShow}}","en":""}</widget></div>
                <div w-class="award-item">
                    <img src="../../res/image/KT.png" w-class="award-icon"/>
                    {{if it1.miningNumber}}
                    <div w-class="award-num">{{ it1.miningNumber}}</div>
                    {{end}}
                </div>
                <div w-class="mining-number-container">
                    <widget w-tag="pi-ui-lang" w-class="mining-number-tips">{"zh_Hans":"今日已挖","zh_Hant":"今日已挖","en":""}</widget>
                    <div w-class="mining-number" >{{ it1.miningedNumber + "/" + it.mineMax }}</div>
                </div>
            </div>
            <div w-class="mine-area" style="{{it1.zIndex ? 'visibility: hidden;' : ''}}">
                {{for index,item of it.haveMines}}
                <div on-tap="clickImg" ev-mine-click="mineClick" w-class="mine-item" style="{{ item.location }}">
                    <earn-client-app-components1-mine-mine>{ 
                        mineType:{{ item.type }},
                        mineId:{{ item.id }}
                        hp:{{item.hp}},
                        selectedHoe:{{ it.hoeSelected }},
                        selected:{{ item.type === it.mineType && item.id === it.mineId}},
                        lossHp:{{ it.lossHp }},
                        hoeSelectedLeft:{{ it.hoeSelectedLeft }},
                        beginMining:{{ it.countDownStart }},
                        countDown:{{ it.countDown }}
                    }</earn-client-app-components1-mine-mine>
                </div>
                {{end}}
            </div>
            <div w-class="ad-item" on-tap="watchAdClick" on-down="watchAdAnimateClick">
                <div w-class="adItems">({{it.watchAd}}/10)</div>
            </div>
            <img src="../../res/image/close_mine.png" w-class="close" on-tap="closeClick"/>
        </div>
    </div>
</div>