<div w-class="detail-new-page" class="new-page">
    <div w-class="ga-new-page">
        <div w-class="ga-main">
            <img w-class="ga-logo" src="../icon/img_logo.png"/>
            <div w-class="ga-title" id="title"></div>
            <div w-class="ga-download-btn" on-tap="downLoad">点击下载</div>
            {{%<!-- <img w-class="ga-iosCode" src="image/IOS_down.png"/>
            <div w-class="ga-iosText">IOS扫码下载</div> -->}}
            <div w-class="ga-installation-tutorial">
                <div w-class="ga-steps">
                    <div w-class="ga-step-item">
                        <div w-class="ga-box"><span w-class="ga-step-content" id="step1"></span></div>
                        <img src="../icon/btn2.png" w-class="ga-step-img" style="margin-bottom:40px;"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{if it.show}}
    <div w-class="tipsPage" on-tap="closeTips"></div>
    {{end}}
</div>