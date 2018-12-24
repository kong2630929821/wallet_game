<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"开宝箱","zh_Hant":"開寶箱","en":""} }}
    <app-components1-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}},nextImg:"../../res/image/26_white.png" }</app-components1-topBar-topBar2>
    <div w-class="content">
        <div w-class="center">
            {{% 宝箱九宫格}}
            <div w-class="box-list">
                {{for i,item in it.boxList}}
                <div w-class="box" on-tap="openBox({{i}})">
                    {{if item === 1}}
                    <img src="../../res/image/boxOpen{{it.selectTicket.type}}.png" height="100%;" style="margin:0px auto;" />
                    {{else}}
                    <img src="../../res/image/box{{it.selectTicket.type}}.png" height="100%;" style="margin:0px auto;" />
                    {{end}}
                </div>
                {{end}}
            </div>
            {{% 售价}}
            <div w-class="sale">
                {{if !it.isEmpty}}
                <div w-class="sale-money">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"售价：","zh_Hant":"售價：","en":""}</widget>
                    <span>{{it.selectTicket.needTicketNum}}</span>
                    <widget w-tag="pi-ui-lang">{{it.selectTicket.name}}</widget>

                    <widget w-tag="pi-ui-lang">{"zh_Hans":"/1个","zh_Hant":"/1個","en":""}</widget>
                </div>
                {{else}}
                <div w-class="sale-money">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"是个空宝箱","zh_Hant":"是個空寶箱","en":""}</widget>
                </div>
                {{end}}
                <div w-class="sale-btn" on-tap="resetBoxList">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"换一波","zh_Hant":"換一波","en":""}</widget>
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