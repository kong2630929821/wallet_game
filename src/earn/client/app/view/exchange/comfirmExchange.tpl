<div w-class="modal-mask" class="new-page">
    <div w-class="body">
        <div w-class="content">
            <div w-class="content-text">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"确定使用","zh_Hant":"确定使用","en":""}</widget>
                <span style="color:#E97A1A">{{it.detail.stCount}}&nbsp;{{it.stShow}}</span>
                <widget w-tag="pi-ui-lang">{"zh_Hans":"兑换？","zh_Hant":"兌換？","en":""}</widget>
            </div>
            <widget w-class="tips" w-tag="pi-ui-lang">{"zh_Hans":"请按后续提示使用","zh_Hant":"請按後續提示使用","en":""}</widget>
        </div>
        <div w-class="btn-box">
            <div w-class="btn cancalBtn" on-tap="cancelClick">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"取消","zh_Hant":"取消","en":""}</widget>
            </div>
            <div w-class="btn comfirmBtn" on-tap="comfirmClick">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"确定","zh_Hant":"確定    ","en":""}</widget>
            </div>
        </div>
    </div>
</div>