<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"兑换记录","zh_Hant":"兌換記錄","en":""} }}
    <widget w-tag="app-components-topBar-topBar">{"title":{{topBarTitle}} }</widget>

    <div w-class="content flex-col">
        {{if it.historyList.length !==0}}

        {{% 列表}}

        {{for i,item in it.historyList}}
        <div w-class="mat item" on-tap="goDetail({{i}})">
            <img src="../../res/image/virtualGoods/{{item.awardType}}.jpg" style="padding: 5px 30px;" width="150px" height="150px"/>
            <div w-class="item-text">
                <div style="height:45px;font-size:32px;margin-bottom: 20px;">{{item.awardType}}</div>
                <div style="height:33px;font-size:24px;">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"有效期：至","zh_Hant":"有效期：至","en":""}</widget>
                    {{item.deadTime}}
                </div>
            </div>
        </div>
        {{end}}
        {{else}}
        {{% 无记录}}
        <div w-class="flex-col" style="align-items: center;margin-top:160px;">
            <img src="../../res/image/dividend_history_none.png" width="195px;"/>
            <widget w-class="tips" w-tag="pi-ui-lang">{"zh_Hans":"还没有记录哦","zh_Hant":"還沒有記錄哦","en":""}</widget>
        </div>
        {{end}}
    </div>

</div>