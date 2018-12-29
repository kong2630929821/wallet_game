<div class="new-page" w-class="new-page" ev-back-click="backClick">
    <app-components1-topBar-topBar>{"title":{zh_Hans:"挖矿规则",zh_Hant:"挖礦規則",en:""}}</app-components1-topBar-topBar>
    <div w-class="body">
        <div w-class="rule-container">
            <div w-class="title">锄头的使用</div>
            <div>
                <div w-class="desc" style="margin-top:100px;">每个锄头可以使用10秒，10秒内可多次挖矿</div>
                <div w-class="desc">所有锄头都有概率双挖，但不同的锄头概率不同。</div>
                <div w-class="hoe-type">
                    <div w-class="hoe-item">
                        <div w-class="hoe-box">
                            <img src="../../../res/image/iron_hoe.png"/>
                        </div>
                        <div w-class="hoe-name">铁锄头</div>
                    </div>
                    <div w-class="dividing">></div>
                    <div w-class="hoe-item">
                        <div w-class="hoe-box">
                            <img src="../../../res/image/gold_hoe.png"/>
                        </div>
                        <div w-class="hoe-name">金锄头</div>
                    </div>
                    <div w-class="dividing">></div>
                    <div w-class="hoe-item">
                        <div w-class="hoe-box">
                            <img src="../../../res/image/diamond_hoe.png"/>
                        </div>
                        <div w-class="hoe-name">钻石锄头</div>
                    </div>
                </div>
            </div>
            
            <div w-class="title">锄头的获得</div>
            <div w-class="get-type">
                {{for index,item of it.getMethod}}
                <div w-class="get-item" >
                    <div w-class="get-item-title">{{item.title}}</div>
                    {{if typeof(item.desc) === 'string'}}
                        <div w-class="get-item-desc">{{item.desc}}{{if item.action}}<span w-class="action" on-tap="actionClick(e,{{index}})">{{item.action}}</span>{{end}}</div>
                    {{else}}
                        <div w-class="get-item-desc">{{item.desc[0]}}</div>
                        <div w-class="get-item-desc">{{item.desc[1]}}</div>
                        <div w-class="get-item-desc">{{item.desc[2]}}{{if item.action}}<span w-class="action" on-tap="actionClick(e,{{index}})">{{item.action}}</span>{{end}}</div>
                    {{end}}
                </div>
                {{end}}
            </div>
            <div w-class="title">矿山</div>
            <div>
                <div w-class="mine-type-title">矿山分类</div>
                <div w-class="mine-type">
                    <div w-class="mine-type-item">
                        <img src="../../../res/image/small_mine.png" style="width:168px;height:122px;"/>
                        <div w-class="mine-name">普通矿山</div>
                    </div>
                    <div w-class="mine-type-item" style="margin:0 20px;">
                        <img src="../../../res/image/mid_mine.png" style="width:220px;height:161px;"/>
                        <div w-class="mine-name">富饶矿山</div>
                    </div>
                    <div w-class="mine-type-item">
                        <img src="../../../res/image/big_mine.png" style="width:250px;height:203px;"/>
                        <div w-class="mine-name">稀世矿山</div>
                    </div>
                </div>
                <div w-class="mine-desc">每日登陆都会赠送矿山，矿场最多储备9座矿山，消耗掉矿山会继续赠送。</div>
            </div>
        </div>
    </div>
</div>