<div w-class="body">
    {{for i,item of it.myGuessList}}
    <div on-tap="goDetail({{i}})">
        <widget w-tag="earn-client-app-components-guessItem-guessItem">{guessData:{{item.guessData}} }</widget>
        <div w-class="guess-detail">
            <div w-class="guess-detail-item">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"我的竞猜","zh_Hant":"我的競猜","en":""}</widget>
                <span>{{item.teamName}} 胜</span>
            </div>
            <div w-class="guess-detail-item">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"我的购买","zh_Hant":"我的購買","en":""}</widget>
                <span>{{item.guessing.guessSTnum}} ST</span>
            </div>
            <div w-class="guess-detail-item">
                {{if item.guessData.state !== 2}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"预期收益","zh_Hant":"預期收益","en":""}</widget>
                {{else}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"实际收益","zh_Hant":"實際收益","en":""}</widget>
                {{end}}
                <span>{{item.guessing.benefit}} ST</span>
            </div>
        </div>
    </div>
    {{end}}

</div>