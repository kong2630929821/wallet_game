<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":it.name,"zh_Hant":it.name,"en":""} }}
    <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}} }</widget>

    <div w-class="content">
        {{% 兑换成功提示}}
        {{if it.detailType ===0}}
        <div w-class="top-tips">
            <img src="../../res/image1/hook-blue.png" width="48px" />
            <widget style="margin-left:10px;" w-tag="pi-ui-lang">{"zh_Hans":"兑换成功","zh_Hant":"兌換成功","en":""}</widget>
        </div>
        {{end}}
        {{% 顶部图片}}
        <div w-class="top">
            <img w-class="top-img" src="../../res/image/advertisement.png" height="100%" />
            <div w-class="top-text">
                <widget style="font-size:32px;" w-tag="pi-ui-lang">{{topBarTitle}}</widget>
                <widget w-tag="pi-ui-lang">{"zh_Hans":"有效期：至{{it.orderDetail.deadTime}}","zh_Hant":"有效期：至{{it.orderDetail.deadTime}}","en":""}</widget>
            </div>
        </div>
        {{% 中部介绍}}
        <div w-class="center">
            <div w-class="conversionCode">
                <div>
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"券码：","zh_Hant":"券碼：","en":""}</widget>
                    <span style="font-weight: 700;">{{it.orderDetail.convert}}</span>
                </div>
                <widget on-tap="btnClick(e,0)" w-class="btn-copy" w-tag="pi-ui-lang">{"zh_Hans":"复制","zh_Hant":"複製","en":""}</widget>
            </div>
            <div w-class="center-text">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"支付金额","zh_Hant":"支付金額","en":""}</widget>
                <span style="margin-left:30px;color: #E97A1A;">{{it.orderDetail.count / 100}} {{it.stShow}}</span>
            </div>
            <div w-class="center-text">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"订单编号","zh_Hant":"訂單編號","en":""}</widget>
                <span style="margin-left:30px;">{{it.orderDetail.id}}</span>
            </div>
            <div w-class="center-text">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"下单时间","zh_Hant":"下單時間","en":""}</widget>
                <span style="margin-left:30px;">2018-12-24 14:20</span>
            </div>
        </div>

        {{% 下部详情}}
        <div w-class="bottom flex-col">
            <div w-class="desc-box flex-col">
                <widget w-class="box-title" w-tag="pi-ui-lang">{"zh_Hans":"商品简介","zh_Hant":"商品簡介","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"爱奇异会员半年卡海量大片，体验会员特权！可享全站视频免广告，会员专属片库。","zh_Hant":"有效期","en":""}</widget>
            </div>

            <div w-class="desc-box flex-col">
                <widget w-class="box-title" w-tag="pi-ui-lang">{"zh_Hans":"兑换流程","zh_Hant":"兌換流程","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"1、复制卡密 ","zh_Hant":"有效期","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"2、点击http://sdsdfffdsf进行激活","zh_Hant":"有效期","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"3、激活完成狗可免费获得相应天数会员，或进入视频App-我的-我的影视会员-影视会员卡充值进行兑换。","zh_Hant":"有效期","en":""}</widget>
                <widget w-class="box-text" w-tag="pi-ui-lang">{"zh_Hans":"4、每人限领一份，兑完为止；一个账号仅限激活一次；","zh_Hant":"有效期","en":""}</widget>
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