<div w-class="modal-mask" class="new-page">
    <div w-class="body" class="smallToBig">
        {{% 背景}}
        <div w-class="bg">
            <div w-class="bg-top"></div>
            <div w-class="bg-bottom"></div>
        </div>
        {{% 内容}}
        <div w-class="content">
            <img src="../../res/image/trophies.png" width="260px" height="280px;" alt="" />
            <div w-class="prize-img">
                <img src="../../res/image/virtualGoods/{{it.prizeType}}.jpg" width="200px" height="200px;"  alt="" />
            </div>
            <widget w-class="tips" w-tag="pi-ui-lang">{"zh_Hans":"抽中了","zh_Hant":"抽中了","en":""}</widget>
            <div>
                <widget w-class="prize-name" w-tag="pi-ui-lang">{{it.prizeName}}</widget>
                <span w-class="prize-name">&nbsp;x&nbsp;{{it.prizeNum}}</span>
                <widget w-class="prize-name" w-tag="pi-ui-lang">{{it.prizeUnit}}</widget>
            </div>
        </div>

    </div>
    <div w-class="closeBtn" class="smallToBig" on-tap="close">
        <img src="../../res/image1/close-white.png" width="30px;" height="30px;" />
    </div>
</div>