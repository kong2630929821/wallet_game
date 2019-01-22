<div w-class="body">
    <div w-class="topbar">
        {{for i,item of it.guessList}}
            <div on-tap="changeTopbar({{i}})" w-class="topbar-item" style="color:{{item.matchType===it.selectMacth.matchType?'#5DDDFF':'#ffffff'}}">{{item.matchName}}</div>
        {{end}}
    </div>
    <div style="overflow: hidden auto;scroll-behavior: smooth;height: 100%;padding-bottom: 50px;">
        {{for i,item of it.selectMacth.list}}
            <div w-class="day-item">
                <div w-class="top-date">{{item.time}} {{item.week}}</div>
                {{for j,item1 of item.list}}
                    <widget w-tag="earn-client-app-components-guessItem-guessItem">{showBtn:true,guessData:{{item1}} }</widget>
                {{end}}
            </div>
        {{end}}
    </div>
</div>