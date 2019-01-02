<div class="new-page" w-class="new-page">
    <div w-class="body">
        <div w-class="head">
            <div w-class="continued"><widget w-tag="pi-ui-lang">{"zh_Hans":"第","zh_Hant":"第","en":""}</widget><span w-class="days">{{ it.signInDays }}</span><widget w-tag="pi-ui-lang">{"zh_Hans":"天","zh_Hant":"天","en":""}</widget></div>
            <div w-class="desc"><widget w-tag="pi-ui-lang">{"zh_Hans":"连续签到","zh_Hant":"連續簽到","en":""}</widget></div>
        </div>
        <div w-class="main">
            {{for item of it.awards}}
                <div style="margin:5px;"><earn-client-app-view-activity-components-signInAward>{ continuedDays:{{ item.days }},hoeType:{{ item.prop }},received:{{ it.signInDays >= item.days }} }</earn-client-app-view-activity-components-signInAward></div>
            {{end}}
        </div>
        <div w-class="sign-btn"><widget w-tag="pi-ui-lang">{"zh_Hans":"签到","zh_Hant":"簽到","en":""}</widget></div>
        <div w-class="close" on-tap="closeClick"><img src="../../../res/image/pop_close.png"/></div>
    </div>
    
</div>