<div w-class="mine" on-down="mineClick">
    <div><img src="{{it.imgUrl}}" class="{{it.beginMining && !it.selected ? 'grayscale' : ''}}"/></div>
    <div w-class="hp-bg">
        <div w-class="hp" style="width:{{ (it.hp / it.hpMax * 100) + '%'}}; "></div>
    </div>
</div>