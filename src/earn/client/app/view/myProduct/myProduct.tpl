<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{if it.type===0}}
        {{: topBarTitle = {"zh_Hans":"我的物品","zh_Hant":"我的物品","en":""} }}
    {{else}}
        {{: topBarTitle = {"zh_Hans":"中奖记录","zh_Hant":"中獎記錄","en":""} }}
    {{end}}
    <widget w-tag="app-components-topBar-topBar">{"title":{{topBarTitle}} }</widget>

    <div w-class="content flex-col">
        {{if it.history.length !==0}}
            {{% 列表}}

            {{for i,item in it.history}}
            <div w-class="mat item" on-tap="goProductDetail({{i}})">
                <img src="../../res/image/virtualGoods/{{item.pid}}.jpg" height="150px" style="padding:5px 30px;"/>
                <div w-class="item-text">
                    <div style="height:45px;font-size:32px;margin-bottom: 20px;">
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"{{item.zh_hans}}","zh_Hant":"{{item.zh_hant}}","en":""}</widget>
                        <span>: {{item.count}}{{item.unit}}</span>
                    </div>
                    <div style="height:33px;font-size:24px;">
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"中奖时间","zh_Hant":"中奖时间","en":""}</widget>
                        {{item.time}}
                    </div>
                </div>
            </div>
            {{end}}
        {{else}}
        {{% 无记录}}
        <div w-class="flex-col" style="align-items: center;margin-top:160px;">
            <img src="../../res/image/dividend_history_none.png" width="195px;" />
            <widget w-class="tips" w-tag="pi-ui-lang">{"zh_Hans":"还没有记录哦","zh_Hant":"還沒有記錄哦","en":""}</widget>
        </div>
        {{end}}
    </div>

</div>