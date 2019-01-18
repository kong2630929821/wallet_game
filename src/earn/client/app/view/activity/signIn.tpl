<div class="new-page" w-class="new-page" ev-back-click="closeClick">
    <app-components1-topBar-topBar>{"title":{zh_Hans:"每日登录",zh_Hant:"每日登錄",en:""},background:"rgba(0,0,0,0)"}</app-components1-topBar-topBar>
    <div w-class="body">
        <div w-class="head">
            <div w-class="continued"><widget w-tag="pi-ui-lang">{"zh_Hans":"第","zh_Hant":"第","en":""}</widget><span w-class="days">{{ it.signInDays }}</span><widget w-tag="pi-ui-lang">{"zh_Hans":"天","zh_Hant":"天","en":""}</widget></div>
            <div w-class="desc"><widget w-tag="pi-ui-lang">{"zh_Hans":"连续签到","zh_Hant":"連續簽到","en":""}</widget></div>
        </div>
        <div w-class="main">
            <div w-class="welfares">
                <div w-class="row">
                    <div w-class="welfare-item"><earn-client-app-components-signInAward-signInAward>{ continuedDays:{{ it.awards[0].days }},hoeType:{{ it.awards[0].prop }},received:{{ it.signInDays >= it.awards[0].days }} }</earn-client-app-components-signInAward-signInAward></div>
                    <div w-class="welfare-item"  style="margin:0 10px;"><earn-client-app-components-signInAward-signInAward>{ continuedDays:{{ it.awards[1].days }},hoeType:{{ it.awards[1].prop }},received:{{ it.signInDays >= it.awards[1].days }} }</earn-client-app-components-signInAward-signInAward></div>
                    <div w-class="welfare-item"><earn-client-app-components-signInAward-signInAward>{ continuedDays:{{ it.awards[2].days }},hoeType:{{ it.awards[2].prop }},received:{{ it.signInDays >= it.awards[2].days }} }</earn-client-app-components-signInAward-signInAward></div>
                </div> 
                <div w-class="row"  style="margin:10px 0;">
                    <div w-class="welfare-item"><earn-client-app-components-signInAward-signInAward>{ continuedDays:{{ it.awards[3].days }},hoeType:{{ it.awards[3].prop }},received:{{ it.signInDays >= it.awards[3].days }} }</earn-client-app-components-signInAward-signInAward></div>
                    <div w-class="welfare-item" style="margin:0 10px;"><earn-client-app-components-signInAward-signInAward>{ continuedDays:{{ it.awards[4].days }},hoeType:{{ it.awards[4].prop }},received:{{ it.signInDays >= it.awards[4].days }} }</earn-client-app-components-signInAward-signInAward></div>
                    <div w-class="welfare-item"><earn-client-app-components-signInAward-signInAward>{ continuedDays:{{ it.awards[5].days }},hoeType:{{ it.awards[5].prop }},received:{{ it.signInDays >= it.awards[5].days }} }</earn-client-app-components-signInAward-signInAward></div>
                </div>    
                <div w-class="row">
                    <div w-class="welfare-item"><earn-client-app-components-signInAward-signInAward>{ continuedDays:{{ it.awards[6].days }},hoeType:{{ it.awards[6].prop }},received:{{ it.signInDays >= it.awards[6].days }} }</earn-client-app-components-signInAward-signInAward></div>
                </div> 
            </div>
        </div>
    </div>
    
</div>