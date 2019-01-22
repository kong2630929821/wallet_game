<div w-class="body">
    {{for i,item of it.guessList}}
    <div w-class="day-item">
        <div w-class="top-date">{{item.time}} {{item.week}}</div>
        {{for j,item1 of item.data}}
        <widget w-tag="earn-client-app-components-guessItem-guessItem">{showBtn:true,guessData:{{item1}} }</widget>
        {{end}}
    </div>
    {{end}}
</div>