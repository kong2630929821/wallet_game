<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refresh">
    {{: topBarTitle = {"zh_Hans":"嗨豆排名","zh_Hant":"嗨豆排名","en":""} }}
    <div style="background:#110140;padding-bottom: 30px;">
        <app-components-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}} }</app-components-topBar-topBar2>
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
            {{:top2 = it.rankList[1]}}
            <div w-class="top-item" style="{{top2 ? '' : 'visibility: hidden;'}}">
                <div style="position:relative;width: 100%;display: flex;justify-content: center;">
                    <widget w-tag="app-components1-img-img" w-class="userHead" on-tap="details(1)">{imgURL:{{top2 && top2.avatar}},width:"150px;"}</widget>
                    <img src="../../res/image/crown2.png" w-class="crown2"/>
                </div>
                <div w-class="top-name">{{top2 && top2.userName}}</div>
                <div w-class="kt-container"><img src="../../res/image/KT.png" w-class="kt-img"/><div w-class="kt-num">{{top2 && top2.ktNum}}</div></div>
            </div>
            {{:top1 = it.rankList[0]}}
            <div w-class="top-item" style="{{top1 ? '' : 'visibility: hidden;'}}padding-top:50px;margin-top: 10px;">
                <div style="position:relative;width: 100%;display: flex;justify-content: center;">
                    <widget w-tag="app-components1-img-img" w-class="userHead" on-tap="details(0)">{imgURL:{{top1 && top1.avatar}},width:"200px;"}</widget>
                    <img src="../../res/image/crown1.png" w-class="crown1"/>
                </div>
                <div w-class="top-name">{{top1 && top1.userName}}</div>
                <div w-class="kt-container"><img src="../../res/image/KT.png" w-class="kt-img"/><div w-class="kt-num">{{top1 && top1.ktNum}}</div></div>
            </div>
            {{:top3 = it.rankList[2]}}
            <div w-class="top-item" style="{{top3 ? '' : 'visibility: hidden;'}}">
                <div style="position:relative;width: 100%;display: flex;justify-content: center;">
                    <widget w-tag="app-components1-img-img" w-class="userHead" on-tap="details(2)">{imgURL:{{top3 && top3.avatar}},width:"150px;"}</widget>
                    <img src="../../res/image/crown3.png" w-class="crown2"/>
                </div>
                <div w-class="top-name">{{top3 && top3.userName}}</div>
                <div w-class="kt-container"><img src="../../res/image/KT.png" w-class="kt-img"/><div w-class="kt-num">{{top3 && top3.ktNum}}</div></div>
            </div>
        </div>
    </div>
    <div w-class="rank-list" id="rankList">
        <div style="margin-bottom:150px;">
            {{for i,item of it.rankList.slice(3)}}
                <div on-tap="details({{i+3}})"><widget w-tag="earn-client-app-view-mineRank-rankItem">{{item}}</widget></div>
            {{end}}
        </div>
    </div>
    <div w-class="self-rank">
        <widget on-tap="mydetails" w-tag="earn-client-app-view-mineRank-rankItem">{{it.myRank}}</widget>
    </div>
</div>