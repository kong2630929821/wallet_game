<div w-class="modal-mask" class="new-page">
    <div w-class="body" class="smallToBig">
        <div w-class="one">
            <widget w-class="tips" w-tag="pi-ui-lang">{"zh_Hans":"新用户登录成功","zh_Hant":"新用戶登錄成功","en":""}</widget>
        </div>
        <div w-class="two">
            {{for i,item of it.prizeList}}
            <div w-class="two-img">
                <img src="../../res/image/virtualGoods/{{item.info.pid}}.jpg" style="border-radius: 50%;" width="200px" height="200px"/>
            </div>
            <widget w-class="tips" w-tag="pi-ui-lang">{"zh_Hans":"{{item.info.zh_hans+item.count+item.info.unit }}","zh_Hant":"{{item.info.zh_hant+item.count+item.info.unit }}","en":""}</widget>

            {{end}}
        </div>
    </div>
    <div w-class="closeBtn" class="smallToBig" on-tap="close">
        <img src="../../res/image1/close-white.png" width="30px;" height="30px;" />
    </div>
</div>