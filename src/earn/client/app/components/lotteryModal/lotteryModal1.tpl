<div w-class="modal-mask" class="new-page">
    <div class="popBoxFadeIn {{it.fadeOut ? 'popBoxFadeOut' : ''}}" w-class="animate-container">
    <div w-class="body">
        <img src="{{it.img}}" style="height:300px;"/>
        <div w-class="btns">
            <div w-class="btn1" on-tap="btnClick(1)" class="popBoxZoomIn">{{it.btn1}}</div>
            <div w-class="btn2" on-tap="btnClick(2)" class="popBoxZoomIn">{{it.btn2}}</div>
        </div>
    </div>
    <div w-class="closeBtn"  on-tap="close">
        <img src="../../res/image1/close-white.png" width="30px;" height="30px;" />
    </div>
    </div>
</div>