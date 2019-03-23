<div class="new-page" w-class="new-page" on-tap="closeSetting"  ev-back-click="backPrePage" ev-next-click="goHistory" ev-next1-click="showSetting">
    {{: topBarTitle = {"zh_Hans":"大转盘","zh_Hant":"大轉盤","en":""} }}
    <app-components-topBar-topBar>{title:{{topBarTitle}},nextImg:"../../res/image/26_white.png",nextImg1:"../../res/image/more_dot_white.png",background:"transparent" }</app-components-topBar-topBar>
    <div w-class="content">
    
        {{% 大转盘标题}}
        <div w-class="turntable-name">
            <img src="../../res/image/{{it.selectTurntable.type}}title.png" height="100%" />
            <div w-class="myMoney">我的碎银:&nbsp;{{it.STbalance}}</div>
        </div>

        {{if it.showMoreSetting}}
        <div w-class="moreSetting" on-tap="setting">
            {{if it.noPassword}}
                关闭免密支付
            {{else}}
                开启免密支付
            {{end}}
        </div>
        {{end}}
        
        {{% 大转盘}}
        <div w-class="center">
            <div w-class="turntable-main-bg">
                <div style="width:628px;height:628px;position: relative;">
                    <img w-class="turntable_bg" src="../../res/image/{{it.selectTurntable.type}}bg.png" width="628px;" />
                    <img src="../../res/image/{{it.ledShow?'turntable_LED2':'turntable_LED1'}}.png" style="position:absolute;top:0px;" width="628px;" alt="" />
                    {{% 转}}
                    <div w-class="turntable-container">
                        <div w-class="turntable-content">
                            <div w-class="turntable-list" id="turntable">
                                {{for i,item in it.prizeList}}
                                <div w-class="turntable-item" style="transform: rotate({{i*(360/it.prizeList.length)}}deg)">
                                    <div w-class="turntable-item-bg" style="border-width:270px {{270*Math.tan(3.14/it.prizeList.length)}}px 0px;border-top-color:{{i%2===0?'white':'#EEF0FF'}}"></div>
                                    <div w-class="turntable-icontent">
                                        {{if item.awardType !== 9527}}
                                        <img w-class="turntable-iicon" src="../../res/image/virtualGoods/{{item.awardType}}.jpg"
                                            width="70px" height="70px" />
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
                        <div w-class="turntable-btn">
                            <img on-tap="btnClick(e,3)" src="../../res/image/turntable_btn.png" width="100%" height="100%" />
                        </div>
                    </div>
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
                <div w-class="sale-money1" on-tap="btnClick(e,0)">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"更多机会 {{it.watchAdAward}}/10","zh_Hant":"更多機會 {{it.watchAdAward}}/10","en":""}</widget>
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