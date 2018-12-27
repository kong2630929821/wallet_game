<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"兑换","zh_Hant":"兌換","en":""} }}
    <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}},"nextImg":"../../res/image/detailBlueIcon.png" }</widget>

    <div w-class="content" on-scroll="scrollHeight">
        {{% 顶部标题}}
        <div w-class="top-title">
            <widget w-class="top-btn" on-tap="goCompound" w-tag="pi-ui-lang">{"zh_Hans":"合成奖券","zh_Hant":"合成獎券","en":""}</widget>
            <widget w-class="getTicket-title-name" w-tag="pi-ui-lang">{"zh_Hans":"我的奖券","zh_Hant":"我的獎券","en":""}</widget>
            <widget w-class="top-btn" on-tap="goRule" w-tag="pi-ui-lang">{"zh_Hans":"规则","zh_Hant":"規則","en":""}</widget>
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
            {{% 导航栏}}
            <div w-class="navbar {{it.isFixed?'isFixed':''}}">
                {{for ind,item in it.navbarList}}
                    <div on-tap="changeNavbar({{ind}})" w-class="navbar-item {{it.navbarSelected === item.name?'navbar-item-selected':''}}">
                        <widget w-class="navbar-title" w-tag="pi-ui-lang"> {{item.title}}</widget>
                    </div>
                {{end}}
            </div>

            {{% 内容}}
            {{for ind,item in it.navbarList}}
                {{if it.navbarSelected === item.name}}
                <widget w-class="{{it.isFixed?'contentScroll':''}}" w-tag="{{item.component}}">{exchangeType:{{it.navbarSelected}} }</widget>
                {{end}}
            {{end}}
        </div>
    </div>

</div>