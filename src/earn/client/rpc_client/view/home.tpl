<div w-class="redEnv-new-page" class="new-page">
    <div w-class="redEnv-main">
        <div w-class="redEnv-leave-message" id="message">{{it.message}}</div>
        <div w-class="redEnv-tag" id="describe">您收到一个邀请码</div>
        <div w-class="redEnv-open-div">
            <img src="../icon/open.png" w-class="redEnv-open {{it.animation?'redEnv-open-animate':''}}" on-tap="openRedEnvelopeClick" id="openRedEnv"/>
        </div>
    </div>
</div>