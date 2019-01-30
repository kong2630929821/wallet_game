<div w-class="item" on-tap="goProductDetail()">
    <div style="height: 250px;text-align: center;">
        <img src="../../res/image/virtualGoods/{{it.id}}.jpg" height="100%" alt="" />
    </div>

    <div w-class="item-desc">{{it.name}}</div>
    <div w-class="item-money">
        <div w-class="money-one">
            <img src="../../res/image/ST.png" width="32px" height="32px" style="margin-right:5px;" alt="" />
            <widget w-tag="pi-ui-lang" w-class="money-num" style="color:#888888;font-size:24px;">{"zh_Hans":{{it.stShow}},"zh_Hant":{{it.stShow}},"en":""}</widget>
            <span w-class="money-num">{{it.stCount / 100}}</span>
        </div>
    </div>
</div>