<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory" ev-refresh-click="refresh">
    {{: topBarTitle = {"zh_Hans":"大转盘","zh_Hant":"大轉盤","en":""} }}
    <app-components1-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}},nextImg:"../../res/image/26_white.png" }</app-components1-topBar-topBar2>
    <div w-class="content">
        <div w-class="center">
            {{% 大转盘}}
            <div w-class="turntable-name">
                <img src="../../res/image/{{it.selectTurntable.type}}title.png" height="100%" />
            </div>
            <img w-class="turntable_bg" src="../../res/image/{{it.selectTurntable.type}}bg.png" width="628px;" />

            {{% 转}}
            <div w-class="turntable-container">
                <div w-class="turntable-content">
                    <div w-class="turntable-list" id="turntable">
                        {{for i,item in it.prizeList}}
                        <div w-class="turntable-item" style="transform: rotate({{i*(360/it.prizeList.length)}}deg)">
                            <div w-class="turntable-item-bg" style="border-width:270px {{270*Math.tan(3.14/it.prizeList.length)}}px 0px;border-top-color:{{i%2===0?'white':'#EEF0FF'}}"></div>
                            <div w-class="turntable-icontent">
                                {{if item.awardType !== 9527}}
                                <img w-class="turntable-iicon" src="../../res/image/virtualGoods/{{item.awardType}}.jpg" width="70px" height="70px" />
                                {{else}}
                                <p w-class="turntable-itext">
                                    <span style="width:70px;height:70px;font-size:26px;">谢谢惠顾</span>
                                </p>
                                {{end}}
                            </div>
                        </div>
                        {{end}}
                    </div>
                </div>
                <div w-class="turntable-btn" >
                    <img on-tap="goLottery" src="../../res/image/turntable_btn.png" width="100%" height="100%" />
                </div>
            </div>

        </div>

        {{% 下面选票}}
        <div w-class="bottom flex-col">

            {{% 售价}}
            <div w-class="sale">
                <div w-class="sale-money" on-tap="btnClick(e,1)">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"充值","zh_Hant":"充值","en":""}</widget>
                </div>
                <div w-class="sale-btn">
                    <widget w-tag="pi-ui-lang">{{it.showTip}}</widget>
                </div>
                <div w-class="sale-money" on-tap="btnClick(e,0)">
                    <img w-class="AD-alert" src="../../res/image/AD_alert.png" alt="" />
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"广告","zh_Hant":"廣告","en":""}</widget>
                </div>
            </div>

            {{% 余票}}
            <div w-class="ticket">
                {{for i,item in it.turntableList}}
                <div on-tap="btnClick(e,2,{{i}})" w-class="ticket-item {{it.selectTurntable.type===item.type ?'select':''}}">
                    <widget w-tag="pi-ui-lang" w-class="ticket-num">{{item.turntableName}}</widget>
                </div>
                {{end}}
            </div>
        </div>



    </div>
</div>