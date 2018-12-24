<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"大转盘","zh_Hant":"大轉盤","en":""} }}
    <app-components1-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}},nextImg:"../../res/image/26_white.png" }</app-components1-topBar-topBar2>
    <div w-class="content">
        <div w-class="center">
            {{% 大转盘}}
            <div w-class="turntable-name">
                <widget w-tag="pi-ui-lang">{{it.selectTicket.turntableName}}</widget>
            </div>
            <img w-class="turntable-bg" src="../../res/image/pan-bg{{it.selectTicket.type}}.png" width="628px;" />

            {{% 转}}
            <div w-class="turntable-container">
                <div w-class="turntable-content">
                    <div w-class="turntable-list" id="turntable">
                        {{for i,item in it.turntableList}}
                        <div w-class="turntable-item" style="transform: rotate({{i*(360/it.turntableList.length)}}deg)">
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
                    <img src="../../res/image/goLottery-btn{{it.selectTicket.type}}.png" width="100%" height="100%" />
                </div>
            </div>

        </div>

        {{% 下面选票}}
        <div w-class="bottom flex-col">

            {{% 售价}}
            <div w-class="sale">
                <div w-class="sale-money">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"售价：","zh_Hant":"售價：","en":""}</widget>
                    <span>{{it.selectTicket.needTicketNum}}</span>
                    <widget w-tag="pi-ui-lang">{{it.selectTicket.name}}</widget>  
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"/1次","zh_Hant":"/1次","en":""}</widget>
                </div>
            </div>

            {{% 余票}}
            <div w-class="ticket">
                {{for i,item in it.ticketList}}
                <div on-tap="change({{i}})" w-class="ticket-item {{it.selectTicket.type===item.type ?'select':''}}">
                    <img src="../../res/image/ticket{{item.type}}.png" width="100%;" style="margin-top:15px;" />
                    <div w-class="ticket-num">{{item.balance}}</div>
                </div>
                {{end}}
            </div>
        </div>



    </div>
</div>