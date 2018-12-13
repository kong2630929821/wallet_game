<div class="new-page" ev-back-click="goBack">
    <client-app-widget-topBar-topBar>{title:"新的朋友",background:"#fff"}</client-app-widget-topBar-topBar>
    <div w-class="newfriend-wrap">
        <client-app-widget-featureBar-featureBar>{iconPath:"user.png",text:{{it.info.name}} }</client-app-widget-featureBar-featureBar>
    </div>
    <div w-class="attach-info-wrap">
        <div w-class="title-wrap">附加信息</div>
        <div w-class="detail-wrap">{{it.applyInfo}}</div>
    </div>
    {{if !it.isSolve}}
    <div w-class="agree-wrap">
        <span w-class="reject" on-tap="reject">拒绝</span>
        <span w-class="agree" on-tap="agree">同意</span>
    </div>
    {{else}}
    <div w-class="solved">{{it.isSolve}}</div>
    {{end}}
</div>