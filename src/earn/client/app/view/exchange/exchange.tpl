<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    <div style="background: #1E6DEF">
        {{: topBarTitle = {"zh_Hans":"兑换","zh_Hant":"兌換","en":""} }}
        <widget w-tag="app-components1-topBar-topBar2">{scrollHeight:0,text:{{topBarTitle}},nextImg:"../../res/image/26_white.png"}</widget>
    </div>

    <div w-class="content">
        {{% 导航栏}}
        <div w-class="navbar {{it.isFixed?'isFixed':''}}">
            {{for ind,item in it.navbarList}}
            <div on-tap="changeNavbar({{ind}})" w-class="navbar-item {{it.navbarSelected.name === item.name?'navbar-item-selected':''}}">
                <widget w-class="navbar-title" w-tag="pi-ui-lang"> {{item.title}}</widget>
            </div>
            {{end}}
        </div>
        <div w-class="body" id="exchangeList"> 
            {{% 内容}}
            <widget w-tag="earn-client-app-view-exchange-virtualList">{exchangeType:{{it.navbarSelected.exchangeType}} }</widget>
        </div>
    </div>

</div>