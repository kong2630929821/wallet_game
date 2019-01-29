<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refresh">
    {{: topBarTitle = {"zh_Hans":"挖矿排名","zh_Hant":"挖礦排名","en":""} }}
    <div style="background:linear-gradient(135deg,rgba(48,131,255,1) 0%,rgba(21,102,223,1) 100%);">
        <app-components1-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}} }</app-components1-topBar-topBar2>
        <div w-class="content flex-col">
            <div w-class="top-annunciate">
                <div w-class="notice">
                    <p w-class="notice-show" class="down-to-top">{{it.notice[it.noticeShow]}}</p>
                </div>
            </div>
            <div w-class="topbar">
                <div w-class="topbar-bg" style="transform: translateX({{100*it.topbarSel}}%);"></div>
                <div w-class="topbar-text">
                    {{for i,item of it.topbarList}}
                        <widget on-tap="topbarChange({{i}})" w-class="topbar-item {{i===it.topbarSel?'topbar-item-select':''}}" w-tag="pi-ui-lang">{{item.title}}</widget>
                    {{end}}
                </div>
            </div>
            
        </div>
    </div>
    <div w-class="rank-list" id="rankList">
        <div w-class="self-rank">
            <widget w-tag="earn-client-app-view-mineRank-rankItem">{{it.myRank}}</widget>
        </div>
        
        <div w-class="rank-otherlist">
            {{for i,item of it.rankList}}
                <widget w-tag="earn-client-app-view-mineRank-rankItem">{{item}}</widget>
            {{end}}
        </div>
        
    </div>
</div>