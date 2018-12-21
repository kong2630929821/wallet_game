<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"大转盘","zh_Hant":"大轉盤","en":""} }}
    <app-components1-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}},nextImg:"../../res/image/26_white.png" }</app-components1-topBar-topBar2>
    <div w-class="content">
        <div w-class="center">
            {{% 大转盘}}
            {{: turntableName = [
            {"zh_Hans":"初级大转盘","zh_Hant":"初級大轉盤","en":""},
            {"zh_Hans":"中级大转盘","zh_Hant":"中級大轉盤","en":""},
            {"zh_Hans":"高级大转盘","zh_Hant":"高級大轉盤","en":""}] }}
            <div w-class="turntable-name">
                <widget w-tag="pi-ui-lang">{{turntableName[it.selectTicket]}}</widget>
            </div>
            <img w-class="turntable-bg" src="../../res/image/pan-bg{{it.selectTicket}}.png" width="628px;" />

            {{% 转}}
            <div w-class="turntable-container">
                <div w-class="turntable-content">
                    <div w-class="turntable-list" id="turntable">
                        {{for i,item in it.turntableList}}
                        <div w-class="turntable-item"  style="transform: rotate({{i*(360/it.turntableList.length)}}deg)">
                            <div w-class="turntable-item-bg" style="border-width:270px {{270*Math.tan(3.14/it.turntableList.length)}}px 0px;border-top-color:{{i%2===0?'white':'#EEF0FF'}}"></div>
                            <div w-class="turntable-icontent">
                                <p w-class="turntable-iicon"></p>
                                <p w-class="turntable-itext">{{item.text}}</p>
                            </div>
                        </div>
                        {{end}}
                    </div>
                </div>
                <div w-class="turntable-btn" on-tap="goLottery">
                    <img src="../../res/image/goLottery-btn{{it.selectTicket}}.png" width="100%" height="100%" />
                </div>
            </div>

        </div>

        {{% 下面选票}}
        <div w-class="bottom flex-col">

            {{% 售价}}
            <div w-class="sale">
                <div w-class="sale-money">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"售价：2","zh_Hant":"售價：2","en":""}</widget>
                    {{if it.selectTicket===0}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"银券","zh_Hant":"銀券","en":""}</widget>
                    {{elseif it.selectTicket===1}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"金券","zh_Hant":"金券","en":""}</widget>
                    {{elseif it.selectTicket===2}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"彩券","zh_Hant":"彩券","en":""}</widget>
                    {{end}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"/1个","zh_Hant":"/1個","en":""}</widget>
                </div>
            </div>

            {{% 余票}}
            <div w-class="ticket">
                <div on-tap="change(0)" w-class="ticket-item {{it.selectTicket===0?'select':''}}">
                    <img src="../../res/image/ticket0.png" width="100%;" style="margin-top:15px;" />
                    <div w-class="ticket-num">0</div>
                </div>
                <div on-tap="change(1)" w-class="ticket-item {{it.selectTicket===1?'select':''}}">
                    <img src="../../res/image/ticket1.png" width="100%;" style="margin-top:15px;" />
                    <div w-class="ticket-num">0</div>
                </div>
                <div on-tap="change(2)" w-class="ticket-item {{it.selectTicket===2?'select':''}}">
                    <img src="../../res/image/ticket2.png" width="100%;" style="margin-top:15px;" />
                    <div w-class="ticket-num">0</div>
                </div>
            </div>
        </div>



    </div>
</div>