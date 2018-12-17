<div class="new-page" w-class="new-page">
    <div w-class="body">
        <div w-class="choose-tip">选择锄头</div>
        <div w-class="holded-hoes" >
            <div ev-hoe-click="selectHoeClick(e,{{0}})">
                <earn-client-app-view-activity-components-holdedHoe>{ holdedNumber:120,img:"../../../res/image/gold_hoe.png",selected:{{it.hoeSelected === 0}} }</earn-client-app-view-activity-components-holdedHoe>
            </div>
            <div ev-hoe-click="selectHoeClick(e,{{1}})">
                <earn-client-app-view-activity-components-holdedHoe style="margin:0 15px;">{ holdedNumber:120,img:"../../../res/image/gold_hoe.png",selected:{{it.hoeSelected === 1}} }</earn-client-app-view-activity-components-holdedHoe>
            </div>
            <div ev-hoe-click="selectHoeClick(e,{{2}})">
                <earn-client-app-view-activity-components-holdedHoe>{ holdedNumber:120,img:"../../../res/image/gold_hoe.png",selected:{{it.hoeSelected
                     === 2}} }</earn-client-app-view-activity-components-holdedHoe>
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
            <div on-down="stoneClick(e,{{0}},{{1}})"><earn-client-app-view-activity-components-stone></earn-client-app-view-activity-components-stone></div>
            <div on-down="stoneClick(e,{{1}},{{2}})"><earn-client-app-view-activity-components-stone></earn-client-app-view-activity-components-stone></div>
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