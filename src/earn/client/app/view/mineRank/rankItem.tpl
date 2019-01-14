<div w-class="rank-item">
    <div w-class="rank-left">
        {{if it.rank===0}}
            <widget w-class="no-rank" w-tag="pi-ui-lang">{"zh_Hans":"暂无排名","zh_Hant":"暫無排名","en":""}</widget>
        {{elseif (it.rank < 4) && (it.rank > 0) }}
            <img w-class="rank-img" src="../../res/image1/rank-NO{{it.rank}}.png" width="60px" height="70px;" />
        {{else}}
            <div w-class="rank-num">{{it.rank}}</div>
        {{end}}
        <img w-class="rank-headImg" src="{{it.avatar?it.avatar:'../../res/image1/default_head.png'}}" height="100%" />
        <div style="display: flex;justify-content: space-between;flex-direction: column;">
            <p w-class="rank-name">{{it.userName}}</p>
            <p w-class="rank-kt">{{it.ktNum}} KT</p>
        </div>
    </div>
    {{if it.medal}}
        <img w-class="medal-right" src="../../res/image/medals/medal{{it.medal}}.png" height="100%" />
    {{end}}
</div>