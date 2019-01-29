<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":it.name,"zh_Hant":it.name,"en":""} }}
    <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}} }</widget>

    <div w-class="content">
        {{% 顶部图片}}
        <div w-class="top-img">
            <img src="../../res/image/virtualGoods/{{it.id}}detail.jpg" width="100%" height="100%" />
        </div>
        {{% 中部介绍}}
        <div w-class="center">
            <widget w-class="product-name" w-tag="pi-ui-lang">{"zh_Hans":{{it.name}},"zh_Hant":{{it.name}},"en":""}</widget>
            <div w-class="product-money">
                <div w-class="money-one">
                    <span w-class="money-num">{{it.stCount / 100}}</span>
                    <widget w-tag="pi-ui-lang" w-class="money-num" style="color:#888888;font-size:24px;">{"zh_Hans":"碎银","zh_Hant":"碎銀","en":""}</widget>
                </div>
            </div>
            <div w-class="validity-time">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"有效期","zh_Hant":"有效期","en":""}</widget>
                <span>至2018-12-25</span>
            </div>
        </div>

        {{% 下部详情}}
        <div w-class="bottom flex-col">
            <div w-class="desc-box flex-col">
                <widget w-class="box-title" w-tag="pi-ui-lang">{"zh_Hans":"商品简介","zh_Hant":"商品簡介","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"{{it.desc}}","zh_Hant":"{{it.desc}}","en":""}</widget>
            </div>

            <div w-class="desc-box flex-col">
                <widget w-class="box-title" w-tag="pi-ui-lang">{"zh_Hans":"兑换流程","zh_Hant":"兌換流程","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"{{it.progress}}","zh_Hant":"{{it.progress}}","en":""}</widget>
            </div>

            <div w-class="desc-box flex-col">
                <widget w-class="box-title" w-tag="pi-ui-lang">{"zh_Hans":"注意事项","zh_Hant":"注意事項","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"{{it.tips}}","zh_Hant":"{{it.tips}}","en":""}</widget>
            </div>
        </div>

    </div>

    <div w-class="exchange-btn" ev-btn-tap="comfirmExchange">
        {{: btnName = {"zh_Hans":"马上兑换","zh_Hant":"馬上兌換","en":""} }}
        <app-components1-btn-btn>{"name":{{btnName}},"type":"big","color":"blue" }</app-components1-btn-btn>
    </div>

</div>