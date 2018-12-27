<div w-class="mine" on-down="mineClick" style="{{it.selected ? 'z-index: 1;' : ''}}">
    <div><img src="{{it.mineImgUrl}}" class="{{it.beginMining && !it.selected ? 'grayscale' : ''}}"/></div>
    {{if it.selected}}
    <div w-class="hp-bg">
        <div w-class="hp" style="width:{{ (it.hp / it.hpMax * 100) + '%'}}; "></div>
    </div>
    
    <div w-class="hoe"><img src="{{it.hoeImgUrl}}"/> </div>
    {{end}}
</div>