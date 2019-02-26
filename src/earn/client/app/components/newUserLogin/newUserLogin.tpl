<div w-class="modal-mask" class="new-page" style="{{it.fadeOut ? 'background-color: rgba(50, 50, 50, 0);' : ''}} ">
    <div class="popBoxFadeIn {{it.fadeOut ? 'popBoxFadeOut' : ''}}" w-class="animate-container">
        <div w-class="body">
            <div w-class="two">{{it.awardName+" +"+it.awardNum}}</div>
            <img w-class="three" src="../../res/image/new_user_login.png" class="popBoxShake"/>
            <div w-class="four" on-tap="goMining" class="popBoxZoomIn">去试试挖矿</div>
        </div>
        <div w-class="closeBtn" on-tap="close">
            <img src="../../res/image1/close-white.png" width="30px;" height="30px;" />
        </div>
    </div>
</div>