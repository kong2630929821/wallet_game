<div w-class="modal-mask" class="new-page">
    <div w-class="body">

        {{% 银 合成 金}}
        <div w-class="compound-item">
            <div w-class="ticket-item">
                <div w-class="ticket-img">
                    {{if it.compoundType===0}}
                    <div w-class="compounding-bg" style="width:{{it.compoundExtent/100*132}}px;"></div>
                    {{end}}
                    <img src="../../res/image/ticket0.png" alt="" />
                    <div w-class="ticket-num">3/50</div>
                </div>
                <widget w-class="ticket-name" w-tag="pi-ui-lang">{"zh_Hans":"银券","zh_Hant":"银券","en":""}</widget>
            </div>
            <img src="../../res/image1/rightArrow-blue.png" style="margin-top:-35px;" width="48px;" height="48px;" />
            <div w-class="ticket-item">
                <div w-class="ticket-img">
                    <img src="../../res/image/ticket1.png" alt="" />
                    <div w-class="ticket-num">3/50</div>
                </div>
                <widget w-class="ticket-name" w-tag="pi-ui-lang">{"zh_Hans":"金券","zh_Hant":"金券","en":""}</widget>
            </div>
            <widget on-tap="compound(0)" w-class="compound-btn" w-tag="pi-ui-lang">{"zh_Hans":"合成","zh_Hant":"合成","en":""}</widget>
        </div>



        {{% 金 合成 彩}}
        <div w-class="compound-item">
            <div w-class="ticket-item">
                <div w-class="ticket-img">
                    {{if it.compoundType===1}}
                    <div w-class="compounding-bg" style="width:{{it.compoundExtent/100*132}}px;"></div>
                    {{end}}
                    <img src="../../res/image/ticket1.png" alt="" />
                    <div w-class="ticket-num">3/50</div>
                </div>
                <widget w-class="ticket-name" w-tag="pi-ui-lang">{"zh_Hans":"金券","zh_Hant":"金券","en":""}</widget>
            </div>
            <img src="../../res/image1/rightArrow-blue.png" style="margin-top:-35px;" width="48px;" height="48px;" />
            <div w-class="ticket-item">
                <div w-class="ticket-img">
                    <img src="../../res/image/ticket2.png" alt="" />
                    <div w-class="ticket-num">3/50</div>
                </div>
                <widget w-class="ticket-name" w-tag="pi-ui-lang">{"zh_Hans":"彩券","zh_Hant":"彩券","en":""}</widget>
            </div>
            <widget on-tap="compound(1)" w-class="compound-btn" w-tag="pi-ui-lang">{"zh_Hans":"合成","zh_Hant":"合成","en":""}</widget>
        </div>


    </div>
    <div w-class="closeBtn" on-tap="close">
        <img src="../../res/image1/close-white.png" width="30px;" height="30px;" />
    </div>
</div>