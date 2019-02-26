<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refresh">
    {{: topBarTitle = {"zh_Hans":"嗨豆排名","zh_Hant":"嗨豆排名","en":""} }}
    <div style="background:#110140;padding-bottom: 30px;">
        <app-components1-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}} }</app-components1-topBar-topBar2>
        <div w-class="content flex-col">
            <div w-class="top-annunciate">
                <div w-class="notice">
                    {{if it.notice[it.noticeShow]}}
                    <p w-class="notice-show" class="down-to-top">{{it.notice[it.noticeShow]}}</p>
                    {{end}}
                </div>
            </div>
            <div w-class="topbar">
                <div w-class="topbar-bg" style="transform: translateX({{350*it.topbarSel}}px);"></div>
                <div w-class="topbar-text">
                    {{for i,item of it.topbarList}}
                        <widget on-tap="topbarChange({{i}})" w-class="topbar-item {{i===it.topbarSel?'topbar-item-select':''}}" w-tag="pi-ui-lang">{{item.title}}</widget>
                    {{end}}
                </div>
            </div>
        </div>
        <div w-class="top3-container">
            <div w-class="top-item">
                <div style="position:relative;width: 100%;display: flex;justify-content: center;">
                    <img src="../../res/image1/default_head.png" w-class="top2-avatar"/>
                    <img src="../../res/image/crown2.png" w-class="crown2"/>
                </div>
                <div w-class="top-name">咸鱼</div>
                <div w-class="kt-container"><img src="../../res/image/KT.png" w-class="kt-img"/><div w-class="kt-num">1222</div></div>
            </div>
            <div w-class="top-item" style="padding-top:50px;margin-top: 10px;">
                <div style="position:relative;width: 100%;display: flex;justify-content: center;">
                    <img src="../../res/image1/default_head.png" w-class="top1-avatar"/>
                    <img src="../../res/image/crown1.png" w-class="crown1"/>
                </div>
                <div w-class="top-name">咸鱼</div>
                <div w-class="kt-container"><img src="../../res/image/KT.png" w-class="kt-img"/><div w-class="kt-num">1222</div></div>
            </div>
            <div w-class="top-item">
                    <div style="position:relative;width: 100%;display: flex;justify-content: center;">
                        <img src="../../res/image1/default_head.png" w-class="top2-avatar"/>
                        <img src="../../res/image/crown3.png" w-class="crown2"/>
                    </div>
                    <div w-class="top-name">咸鱼</div>
                    <div w-class="kt-container"><img src="../../res/image/KT.png" w-class="kt-img"/><div w-class="kt-num">1222</div></div>
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