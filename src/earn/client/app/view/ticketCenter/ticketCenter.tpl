<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"奖券中心","zh_Hant":"獎券中心","en":""} }}
    <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}} }</widget>

    <div w-class="content">
        {{% 顶部标题}}
        <div w-class="top-title">
            <widget w-class="top-btn" on-tap="goCompound" w-tag="pi-ui-lang">{"zh_Hans":"合成奖券","zh_Hant":"合成獎券","en":""}</widget>
            <widget w-class="getTicket-title-name" w-tag="pi-ui-lang">{"zh_Hans":"我的奖券","zh_Hant":"我的獎券","en":""}</widget>
            <widget w-class="top-btn" on-tap="goRule" w-tag="pi-ui-lang">{"zh_Hans":"玩法","zh_Hant":"玩法","en":""}</widget>
        </div>
        {{% 拥有券数}}
        <div w-class="top-title">
            {{for i,item in it.ticketList}}
            <div>
                <widget w-class="ticket-KT" w-tag="pi-ui-lang">{{item.name}}</widget>
                <div w-class="ticket-num">{{item.balance}}</div>
            </div>
            {{end}}
        </div>
        <div w-class="body">

            {{% 活动}}
            <div w-class="activity">
                <div w-class="activity-box mat" on-tap="goActivity(0)">
                    <img src="../../res/image1/btn_yun_7.png" width="100px" />
                    <widget w-class="activity-text" w-tag="pi-ui-lang">{"zh_Hans":"开宝箱","zh_Hant":"開寶箱","en":""}</widget>
                </div>

                <div w-class="activity-box mat" on-tap="goActivity(1)">
                    <img src="../../res/image1/btn_yun_8.png" width="100px" />
                    <widget w-class="activity-text" w-tag="pi-ui-lang">{"zh_Hans":"大转盘","zh_Hant":"大轉盤","en":""}</widget>
                </div>
                <div w-class="activity-box mat" on-tap="goActivity(2)">
                    <img src="../../res/image1/btn_yun_5.png" width="100px" />
                    <widget w-class="activity-text" w-tag="pi-ui-lang">{"zh_Hans":"发给好友","zh_Hant":"發給好友","en":""}</widget>
                </div>
                <div w-class="activity-box mat" on-tap="goActivity(3)">
                    <img src="../../res/image1/btn_yun_10.png" width="100px" />
                    <widget w-class="activity-text" w-tag="pi-ui-lang">{"zh_Hans":"兑换物品","zh_Hant":"兌換物品","en":""}</widget>
                </div>
            </div>


            {{% 拥有KT}}
            <div w-class="mat hasKT">
                <div style="text-align: center;font-size: 50px;font-weight: 500;line-height: 100px;">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"领奖券","zh_Hant":"領獎券","en":""}</widget>
                </div>
                <widget style="font-size:24px;color:#222222;" w-tag="pi-ui-lang">{"zh_Hans":"剩余可领：","zh_Hant":"剩餘可領：","en":""}</widget>
                &nbsp;<span style="font-size:36px;color:#222222;">{{it.KTbalance}}KT</span>
            </div>

            {{% 领券}}

            {{for i,item in it.ticketList}}
            <div w-class="getTicket-item mat" style="margin-top:20px;">
                <img src="../../res/image/ticket{{item.type}}.png" height="70%" style="margin-left:30px;" />
                <div w-class="getTicket-dsc">
                    <widget w-class="ticket-name" w-tag="pi-ui-lang">{{item.name}}</widget>
                    <widget w-class="ticket-KT" w-tag="pi-ui-lang">{"zh_Hans":"价值{{item.priceKT}}KT","zh_Hant":"價值{{item.priceKT}}KT","en":""}</widget>
                </div>
                <div w-class="getTicket-btn" style="background:{{it.KTbalance<item.priceKT?'#cccccc':'#222222'}}">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"领取","zh_Hant":"領取","en":""}</widget>
                </div>
            </div>
            {{end}}

            {{% 结束}}
            <div w-class="end">
                <pi-ui-lang>{"zh_Hans":"根据持有KT，免费领取不同数量类型的奖券","zh_Hant":"根據持有KT，免費領取不同數量類型的獎券","en":""}</pi-ui-lang>
            </div>
        </div>
    </div>

</div>