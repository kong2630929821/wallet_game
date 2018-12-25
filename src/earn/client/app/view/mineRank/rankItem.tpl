<div w-class="rank-item">
    <div w-class="rank-left">
        {{if it.rank < 4 }}
            <img w-class="rank-img" src="../../res/image1/rank-NO{{it.rank}}.png" width="60px" height="70px;" />
        {{else}}
            <div w-class="rank-num">{{it.rank}}</div>
        {{end}}
        <img w-class="rank-headImg" src="../../res/image1/default_head.png" height="100%" />
        <div style="display: flex;justify-content: space-between;flex-direction: column;">
            <p w-class="rank-name">{{it.userName}}</p>
            <p w-class="rank-kt">{{it.ktNum}} KT</p>
        </div>
    </div>
    <img w-class="medal-right" src="../../res/image/balloon.png" height="100%" />
</div>