<div w-class="rank-item">
    <div w-class="rank-left">
        {{if it.rank===0}}
            <widget w-class="no-rank" w-tag="pi-ui-lang">{"zh_Hans":"暂无排名","zh_Hant":"暫無排名","en":""}</widget>
        {{else}}
            <div w-class="rank-num">{{it.rank}}</div>
        {{end}}
        <img w-class="rank-headImg" src="{{it.avatar}}" height="100%" />
        <div style="display: flex;justify-content: space-between;flex-direction: column;">
            <p w-class="rank-name">{{it.userName}}</p>
            <p w-class="rank-kt"><img src="../../res/image/KT.png" style="width:40px;height:40px;"/>{{it.ktNum}}</p>
        </div>
    </div>
    {{if it.medal}}
        <img w-class="medal-right" src="../../res/image/medals/medal{{it.medal}}.png" style="width:120px;height:120px;" />
    {{end}}
</div>