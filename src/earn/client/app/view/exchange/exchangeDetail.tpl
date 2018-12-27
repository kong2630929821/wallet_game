<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":it.name,"zh_Hant":it.name,"en":""} }}
    <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}} }</widget>

    <div w-class="content">
        {{% 顶部图片}}
        <div w-class="top-img">
            <img src="../../res/image/award_silver_hoe.png" width="100%" height="100%" />
        </div>
        {{% 中部介绍}}
        <div w-class="center">
            <widget w-class="product-name" w-tag="pi-ui-lang">{"zh_Hans":{{it.name}},"zh_Hant":{{it.name}},"en":""}</widget>
            <div w-class="product-money">
                <div w-class="money-one">
                    <img src="../../res/image/ticket7002.png" width="50px" height="40px;" alt="" />
                    <span w-class="money-num">3</span>
                </div>
                <div w-class="money-one">
                    <img src="../../res/image/ticket7002.png" width="50px" height="40px;" alt="" />
                    <span w-class="money-num">3</span>
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
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"爱奇异会员半年卡海量大片，体验会员特权！可享全站视频免广告，会员专属片库。 ","zh_Hant":"有效期","en":""}</widget>
            </div>

            <div w-class="desc-box flex-col">
                <widget w-class="box-title" w-tag="pi-ui-lang">{"zh_Hans":"兑换流程","zh_Hant":"兌換流程","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"1、复制卡密 ","zh_Hant":"有效期","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"2、点击http://sdsdfffdsf进行激活","zh_Hant":"有效期","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"3、激活完成狗可免费获得相应天数会员，或进入视频App-我的-我的影视会员-影视会员卡充值进行兑换。","zh_Hant":"有效期","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"4、每人限领一份，兑完为止；一个账号仅限激活一次；","zh_Hant":"有效期","en":""}</widget>
            </div>

            <div w-class="exchange-btn" on-tap="comfirmExchange">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"马上兑换","zh_Hant":"馬上兌換","en":""}</widget>
            </div>


            <div w-class="desc-box flex-col">
                <widget w-class="box-title" w-tag="pi-ui-lang">{"zh_Hans":"注意事项","zh_Hant":"注意事項","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"1、复制卡密 ","zh_Hant":"有效期","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"2、点击http://sdsdfffdsf进行激活","zh_Hant":"有效期","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"3、激活完成狗可免费获得相应天数会员，或进入视频App-我的-我的影视会员-影视会员卡充值进行兑换。","zh_Hant":"有效期","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"4、每人限领一份，兑完为止；一个账号仅限激活一次；","zh_Hant":"有效期","en":""}</widget>
            </div>
        </div>

    </div>

</div>