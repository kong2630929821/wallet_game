<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"大转盘","zh_Hant":"大轉盤","en":""} }}
    <app-components1-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}},nextImg:"../../res/image/26_white.png" }</app-components1-topBar-topBar2>
    <div w-class="content">
        <div w-class="center">
            {{% 大转盘}}
            <div w-class="turntable-name">
                <img src="../../res/image/{{it.selectTurntable.type}}title.png" height="100%" />
            </div>
            <img w-class="turntable-bg" src="../../res/image/{{it.selectTurntable.type}}bg.png" width="628px;" />

            {{% 转}}
            <div w-class="turntable-container">
                <div w-class="turntable-content">
                    <div w-class="turntable-list" id="turntable">
                        {{for i,item in it.prizeList}}
                        <div w-class="turntable-item" style="transform: rotate({{i*(360/it.prizeList.length)}}deg)">
                            <div w-class="turntable-item-bg" style="border-width:270px {{270*Math.tan(3.14/it.prizeList.length)}}px 0px;border-top-color:{{i%2===0?'white':'#EEF0FF'}}"></div>
                            <div w-class="turntable-icontent">
                                <img w-class="turntable-iicon" src="../../res/image/virtualGoods/{{item.awardType}}.jpg" width="80px" height="80px" />

                                <p w-class="turntable-itext">{{% item.text}}</p>
                            </div>
                        </div>
                        {{end}}
                    </div>
                </div>
                <div w-class="turntable-btn" on-tap="goLottery">
                    <img src="../../res/image/turntable-btn.png" width="100%" height="100%" />
                </div>
            </div>

        </div>

        {{% 下面选票}}
        <div w-class="bottom flex-col">

            {{% 售价}}
            <div w-class="sale">
                <div w-class="sale-money" on-tap="goRecharge">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"充值","zh_Hant":"充值","en":""}</widget>
                </div>
                <div w-class="sale-money">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"售价：","zh_Hant":"售價：","en":""}</widget>
                    <span>{{it.selectTurntable.needTicketNum}}ST</span>
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"/1次","zh_Hant":"/1次","en":""}</widget>
                </div>
                <div w-class="sale-money">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"广告","zh_Hant":"廣告","en":""}</widget>
                </div>
            </div>

            {{% 余票}}
            <div w-class="ticket">
                {{for i,item in it.turntableList}}
                <div on-tap="change({{i}})" w-class="ticket-item {{it.selectTurntable.type===item.type ?'select':''}}">
                    <widget w-tag="pi-ui-lang" w-class="ticket-num">{{item.turntableName}}</widget>
                </div>
                {{end}}
            </div>
        </div>



    </div>
</div>