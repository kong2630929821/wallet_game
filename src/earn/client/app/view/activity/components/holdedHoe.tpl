<div w-class="box" on-tap="selectHoeClick" style="{{it.selected === it.hoeType ? 'border:4px solid rgba(50,228,169,1);background-color:#222;' : ''}}">
    <img src="{{it.imgUrl}}"/>
    <div w-class="holded-num">{{ it.holdedNumber >99 ? "99+" : it.holdedNumber}}</div>
</div>