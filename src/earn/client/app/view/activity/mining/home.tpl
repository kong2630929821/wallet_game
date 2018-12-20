<div class="new-page" w-class="new-page">
    <div w-class="body">
        <div w-class="choose-tip">选择锄头</div>
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
        <div w-class="digging-num">今日已挖矿山 0/9 座</div>
        <div w-class="digging-tips">{{it.miningTips}}</div>
        <div w-class="award-container">
            <div w-class="award-item">
                <img src="../../../res/image/KT.png" w-class="award-icon"/>
                <div w-class="award-num">+<span>100</span></div>
            </div>
            <div w-class="award-item"><img src="../../../res/image/GT.png" w-class="award-icon" /></div>
            <div w-class="award-item"><img src="../../../res/image/ETH.png" w-class="award-icon"/></div>
            <div w-class="award-item"><img src="../../../res/image/BTC.png" w-class="award-icon"/></div>
        </div>
        <div w-class="mine-area">
            {{for index,item of it.curmines}}
            <div on-down="mineClick(e,{{item.type}},{{item.index}})" w-class="mine-item" style="{{ it.mineStyle[index] }}">
                <earn-client-app-view-activity-components-mine>{ 
                    mineType:{{item.type}},
                    hp:{{item.hp}},
                    selected:{{ item.type === it.mineType && item.index === it.mineIndex}},
                    lossHp:{{ it.lossHp }},
                    beginMining:{{ it.countDownStart }}
                }</earn-client-app-view-activity-components-mine>
            </div>
            {{end}}
        </div>
        <div w-class="box1">
            <div w-class="action-tips">看广告得锄头</div>
            <div w-class="gift-box">
                <img src="../../../res/image1/gift.png"/>
            </div>
        </div>
        <img src="../../../res/image/close_mine.png" w-class="close" on-tap="closeClick"/>
    </div>

</div>