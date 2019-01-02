<div class="new-page" w-class="new-page">
    <div w-class="body">
        <div w-class="head">
            <div w-class="continued">第<span w-class="days">{{ it.signInDays }}</span>天</div>
            <div w-class="desc">连续签到</div>
        </div>
        <div w-class="main">
            {{for item of it.awards}}
                <div style="margin:5px;"><earn-client-app-view-activity-components-signInAward>{ continuedDays:{{ item.days }},hoeType:{{ item.prop }},received:{{ it.signInDays >= item.days }} }</earn-client-app-view-activity-components-signInAward></div>
            {{end}}
        </div>
        <div w-class="sign-btn">签到</div>
        <div w-class="close" on-tap="closeClick"><img src="../../../res/image/pop_close.png"/></div>
    </div>
    
</div>