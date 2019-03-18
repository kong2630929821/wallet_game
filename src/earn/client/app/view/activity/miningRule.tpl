<div class="new-page" w-class="new-page" ev-back-click="backClick">
    <app-components-topBar-topBar>{"title":{zh_Hans:"采矿说明",zh_Hant:"採礦說明",en:""}}</app-components-topBar-topBar>
    <div w-class="body">
        <div w-class="rule-container">
            <div w-class="title"><widget w-tag="pi-ui-lang">{"zh_Hans":"矿镐的使用","zh_Hant":"礦鎬的使用","en":""}</widget></div>
            <div>
                <div w-class="desc" style="margin-top:100px;"><widget w-tag="pi-ui-lang">{"zh_Hans":"每把镐都有消耗时间，时间消耗完之前内可多次挖矿，每把镐都有概率双挖、三挖、四挖，但不同的镐概率不同。","zh_Hant":"每把鎬都有消耗時間，時間消耗完之前內可多次挖礦，每把鎬都有概率雙挖、三挖、四挖，但不同的鎬概率不同。","en":""}</widget></div>
                <div w-class="hoe-type">
                    <div w-class="hoe-item">
                        <div w-class="hoe-box">
                            <img src="../../res/image/2001.png" w-class="hoe-img"/>
                        </div>
                        <div w-class="hoe-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"铁镐","zh_Hant":"鐵鎬","en":""}</widget></div>
                    </div>
                    <div w-class="hoe-item" style="margin:0 50px;">
                        <div w-class="hoe-box">
                            <img src="../../res/image/2002.png" w-class="hoe-img"/>
                        </div>
                        <div w-class="hoe-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"银镐","zh_Hant":"銀鎬","en":""}</widget></div>
                    </div>
                    <div w-class="hoe-item">
                        <div w-class="hoe-box">
                            <img src="../../res/image/2003.png" w-class="hoe-img"/>
                        </div>
                        <div w-class="hoe-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"金镐","zh_Hant":"金鎬","en":""}</widget></div>
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
                        <img src="../../res/image/small_mine.png" style="width:168px;height:122px;"/>
                        <div w-class="mine-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"普通矿山","zh_Hant":"普通礦山","en":""}</widget></div>
                    </div>
                    <div w-class="mine-type-item" style="margin:0 20px;">
                        <img src="../../res/image/mid_mine.png" style="width:220px;height:161px;"/>
                        <div w-class="mine-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"富饶矿山","zh_Hant":"富饒礦山","en":""}</widget></div>
                    </div>
                    <div w-class="mine-type-item">
                        <img src="../../res/image/big_mine.png" style="width:250px;height:203px;"/>
                        <div w-class="mine-name"><widget w-tag="pi-ui-lang">{"zh_Hans":"稀世矿山","zh_Hant":"稀世礦山","en":""}</widget></div>
                    </div>
                </div>
                <div w-class="mine-desc"><widget w-tag="pi-ui-lang">{"zh_Hans":"每日登陆都会赠送矿山，矿场最多储备{{it.mineMax}}座矿山，消耗掉矿山会继续赠送。","zh_Hant":"每日登陸都會贈送礦山，礦場最多儲備{{it.mineMax}}座礦山，消耗掉礦山會繼續贈送。","en":""}</widget></div>
                <div w-class="mine-desc" style="margin-top:0px;"><widget w-tag="pi-ui-lang">{"zh_Hans":"每种矿山挖出的东西是不一样的","zh_Hant":"每種礦山挖出的東西是不一樣的","en":""}</widget></div>
            </div>
        </div>
    </div>
</div>