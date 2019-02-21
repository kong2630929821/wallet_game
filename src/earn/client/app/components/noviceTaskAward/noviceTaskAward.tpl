<div w-class="modal-mask" class="new-page">
    <div w-class="body" class="smallToBig">
        <div w-class="title">
            {{it.title}}
        </div>
        <div w-class="award">
            <img src="../../res/image/virtualGoods/{{it.awardType}}.jpg" w-class="award-img"/>
        </div>
        <div w-class="desc">
            {{it.awardName + " +" + it.awardNum}}
        </div>
        <div w-class="btn" on-tap="close">知道了</div>
    </div>
    <div w-class="closeBtn" class="smallToBig" on-tap="close">
        <img src="../../res/image1/close-white.png" width="30px;" height="30px;" />
    </div>
</div>