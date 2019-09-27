<div w-class="mine" on-down="mineClick" style="{{ it.selected ? 'z-index: 1;' : '' }} ">
    <div><img src="{{it.mineImgUrl}}" class="{{it.beginMining && !it.selected ? 'grayscale' : ''}}" style="transform:scale({{ it.scale || 1}})"/></div>
    {{if it.selected}}
    <div w-class="hp-bg">
        <div w-class="hp" style="width:{{ (it.hp / it.hpMax * 100) + '%'}}; "></div>
    </div>
        {{if it.beginMining || it.hoeSelectedLeft }}
        <div w-class="hoe"><img src="{{it.hoeImgUrl}}" w-class="hoe-img"/> </div>
        {{end}}
    {{end}}
</div>
