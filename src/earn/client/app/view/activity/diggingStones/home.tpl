<div class="new-page" w-class="new-page">
    <div w-class="body">
        <div w-class="choose-tip">选择锄头</div>
        <div w-class="holded-hoes" >
            <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.CopperHoe}})">
                <earn-client-app-view-activity-components-holdedHoe>{ holdedNumber:{{ it.copperHoe }},hoeType:{{ it.hoeType.CopperHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-view-activity-components-holdedHoe>
            </div>
            <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.SilverHoe}})">
                <earn-client-app-view-activity-components-holdedHoe style="margin:0 15px;">{ holdedNumber:{{ it.silverHoe }},hoeType:{{ it.hoeType.SilverHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-view-activity-components-holdedHoe>
            </div>
            <div ev-hoe-click="selectHoeClick(e,{{it.hoeType.GoldHoe}})">
                <earn-client-app-view-activity-components-holdedHoe>{ holdedNumber:{{ it.goldHoe }},hoeType:{{ it.hoeType.GoldHoe }},selected:{{ it.hoeSelected }} }</earn-client-app-view-activity-components-holdedHoe>
            </div>
        </div>
        <div w-class="digging-num">今日已挖矿山 0/9 座</div>
        <div w-class="digging-tips">{{it.diggingTips}}</div>
        <div w-class="award-container">
            <div w-class="award-item"><img src="../../../res/image1/btn_yun_5.png" w-class="award-icon"/></div>
            <div w-class="award-item"><img src="../../../res/image1/btn_yun_5.png" w-class="award-icon" /></div>
            <div w-class="award-item"><img src="../../../res/image1/btn_yun_5.png" w-class="award-icon"/></div>
            <div w-class="award-item"><img src="../../../res/image1/btn_yun_5.png" w-class="award-icon"/></div>
        </div>
        <div w-class="stone-area">
            {{for index,item of it.curStones}}
            <div on-down="stoneClick(e,{{item.type}},{{item.index}})" w-class="stone-item" style="{{ it.stoneStyle[index] }}">
                <earn-client-app-view-activity-components-stone>{ stoneType:{{item.type}},hp:{{item.hp}},selected:{{ item.type === it.stoneType && item.index === it.stoneIndex}} }</earn-client-app-view-activity-components-stone>
            </div>
            {{end}}
        </div>
        <div w-class="box1">
            <div w-class="action-tips">看广告得锄头</div>
            <div w-class="gift-box">
                <img src="../../../res/image1/gift.png"/>
            </div>
        </div>
        <img src="../../../res/image/close_stone.png" w-class="close" on-tap="closeClick"/>
    </div>

</div>