<div class="new-page" w-class="new-page">
    <div w-class="body">
        <div w-class="head">
        </div>
        <div w-class="main">
            {{ for index,item of it.welfareAwards }}
                <div style="margin:5px;"><earn-client-app-view-activity-components-welfareAward>{ received:{{ item.received }},canReceive:{{ item.canReceive }},inviteNumber:{{ (index + 1) * it.inviteAwardsMultiple }} }</earn-client-app-view-activity-components-welfareAward></div>
            {{end}}
        </div>
        <div w-class="invite-btn" on-tap="inviteClick"><widget w-tag="pi-ui-lang">{"zh_Hans":"立即邀请","zh_Hant":"立即邀請","en":""}</widget></div>
        <div w-class="close" on-tap="closeClick"><img src="../../../res/image/pop_close.png"/></div>
    </div>
    
</div>