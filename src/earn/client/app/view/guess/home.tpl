<div class="new-page" w-class="new-page" on-tap="closeSetting" ev-back-click="backPrePage" ev-next-click="goSetting">
    <div style="background:black;">
        {{: topBarTitle = {"zh_Hans":"LOL赛事竞猜","zh_Hant":"LOL賽事競猜","en":""} }}
        <widget w-tag="app-components1-topBar-topBar2">{scrollHeight:0,text:{{topBarTitle}},nextImg:"../../res/image/26_white.png"}</widget>
    </div>


    <div w-class="content">
        {{if it.showMoreSetting}}
        <div w-class="moreSetting" on-tap="setting(0)">
            {{if it.needNotPassword}}
            关闭免密支付
            {{else}}
            开启免密支付
            {{end}}
        </div>
        {{end}}
        <div w-class="topbar">
            {{for i,item of it.topbarList}}
            <div on-tap="changeTopbar({{i}})" w-class="topbar-itme {{item.name === it.selectTopbar.name?'topbar-item-sel':''}}">
                <widget w-tag="pi-ui-lang">{{item.title}}</widget>
            </div>
            {{end}}
        </div>

        <div style="height:100%;">
            <widget w-tag="{{it.selectTopbar.component}}"></widget>
        </div>
    </div>

</div>