<div class="new-page" w-class="new-page" ev-back-click="backClick">
    <app-components1-topBar-topBar>{"title":{zh_Hans:"挖矿规则",zh_Hant:"挖礦規則",en:""}}</app-components1-topBar-topBar>
    <div w-class="body">
        <div w-class="rule-container">
            <div w-class="title"><widget w-tag="pi-ui-lang">{"zh_Hans":"锄头的使用","zh_Hant":"鋤頭的使用","en":""}</widget></div>
            <div>
                <div w-class="desc" style="margin-top:100px;"><widget w-tag="pi-ui-lang">{"zh_Hans":"每个锄头可以使用10秒，10秒内可多次挖矿","zh_Hant":"每個鋤頭可以使用10秒，10秒內可多次挖礦","en":""}</widget></div>
                <div w-class="desc"><widget w-tag="pi-ui-lang">{"zh_Hans":"所有锄头都有概率双挖，但不同的锄头概率不同。","zh_Hant":"所有鋤頭都有概率雙挖，但不同的鋤頭概率不同。","en":""}</widget></div>
                <div w-class="hoe-type">
                    <div w-class="hoe-item">
                        <div w-class="hoe-box">
                            <img src="../../../res/image/iron_hoe.png"/>
                        </div>
                        <div w-class="hoe-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"铁锄头","zh_Hant":"鐵鋤頭","en":""}</widget></div>
                    </div>
                    <div w-class="dividing">></div>
                    <div w-class="hoe-item">
                        <div w-class="hoe-box">
                            <img src="../../../res/image/gold_hoe.png"/>
                        </div>
                        <div w-class="hoe-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"金锄头","zh_Hant":"金鋤頭","en":""}</widget></div>
                    </div>
                    <div w-class="dividing">></div>
                    <div w-class="hoe-item">
                        <div w-class="hoe-box">
                            <img src="../../../res/image/diamond_hoe.png"/>
                        </div>
                        <div w-class="hoe-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"钻石锄头","zh_Hant":"鑽石鋤頭","en":""}</widget></div>
                    </div>
                </div>
            </div>
            
            <div w-class="title"><widget w-tag="pi-ui-lang">{"zh_Hans":"锄头的获得","zh_Hant":"鋤頭的獲得","en":""}</widget></div>
            <div w-class="get-type">
                {{for index,item of it.getMethod}}
                <div w-class="get-item" >
                    <div w-class="get-item-title"><widget w-tag="pi-ui-lang">{{item.title}}</widget></div>
                    {{if item.desc.length > 0}}
                        <div w-class="get-item-desc"><widget w-tag="pi-ui-lang">{{item.desc[0]}}</widget></div>
                        <div w-class="get-item-desc"><widget w-tag="pi-ui-lang">{{item.desc[1]}}</widget></div>
                        <div w-class="get-item-desc"><widget w-tag="pi-ui-lang">{{item.desc[2]}}</widget>{{if item.action}}<span w-class="action" on-tap="actionClick(e,{{index}})"><widget w-tag="pi-ui-lang">{{item.action}}</widget></span>{{end}}</div>
                    {{else}}
                        <div w-class="get-item-desc"><widget w-tag="pi-ui-lang">{{item.desc}}</widget>{{if item.action}}<span w-class="action" on-tap="actionClick(e,{{index}})"><widget w-tag="pi-ui-lang">{{item.action}}</widget></span>{{end}}</div>
                    {{end}}
                </div>
                {{end}}
            </div>
            <div w-class="title"><widget w-tag="pi-ui-lang">{"zh_Hans":"矿山","zh_Hant":"礦山","en":""}</widget></div>
            <div>
                <div w-class="mine-type-title"><widget w-tag="pi-ui-lang">{"zh_Hans":"矿山分类","zh_Hant":"礦山分類","en":""}</widget></div>
                <div w-class="mine-type">
                    <div w-class="mine-type-item">
                        <img src="../../../res/image/small_mine.png" style="width:168px;height:122px;"/>
                        <div w-class="mine-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"普通矿山","zh_Hant":"普通礦山","en":""}</widget></div>
                    </div>
                    <div w-class="mine-type-item" style="margin:0 20px;">
                        <img src="../../../res/image/mid_mine.png" style="width:220px;height:161px;"/>
                        <div w-class="mine-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"富饶矿山","zh_Hant":"富饒礦山","en":""}</widget></div>
                    </div>
                    <div w-class="mine-type-item">
                        <img src="../../../res/image/big_mine.png" style="width:250px;height:203px;"/>
                        <div w-class="mine-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"稀世矿山","zh_Hant":"稀世礦山","en":""}</widget></div>
                    </div>
                </div>
                <div w-class="mine-desc"><widget w-tag="pi-ui-lang">{"zh_Hans":"每日登陆都会赠送矿山，矿场最多储备9座矿山，消耗掉矿山会继续赠送。","zh_Hant":"每日登陸都會贈送礦山，礦場最多儲備9座礦山，消耗掉礦山會繼續贈送。","en":""}</widget></div>
            </div>
        </div>
    </div>
</div>