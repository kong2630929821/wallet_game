<div class="new-page" w-class="new-page" ev-back-click="backPrePage" >
    {{: topBarTitle = {"zh_Hans":"挖矿排名","zh_Hant":"挖礦排名","en":""} }}
    <app-components1-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}} }</app-components1-topBar-topBar2>
    
    <div w-class="content flex-col">
        <div w-class="top-annunciate">
                一颗大蒜苗挖到了0.1ETH
        </div>
        <div w-class="topbar">
            <div w-class="topbar-bg"></div>
            <div w-class="topbar-text">
                <widget w-class="topbar-item topbar-item-select" w-tag="pi-ui-lang">{"zh_Hans":"全部排名","zh_Hant":"全部排名","en":""}</widget>
                <widget w-class="topbar-item" w-tag="pi-ui-lang">{"zh_Hans":"好友排名","zh_Hant":"好友排名","en":""}</widget>
            </div>
        </div>
        <div w-class="rank-list">
            <div w-class="self-rank">
                <widget w-tag="earn-client-app-view-mineRank-rankItem">{rank: 1,userName: "啊实打实的",ktNum: 500}</widget>
            </div>
            
            <div w-class="rank-otherlist">
                {{for i,item in it.rankList}}
                    <widget w-tag="earn-client-app-view-mineRank-rankItem">{{item}}</widget>
                {{end}}
            </div>
            
        </div>
    </div>

</div>