<div w-class="box {{it.selected === it.hoeType ? 'box-selected' : 'box-noselected'}}" on-tap="selectHoeClick" >
    <img src="{{it.imgUrl}}" style="width:100%;height:100%;"/>
    <div w-class="holded-num">{{ it.holdedNumber >99 ? "99+" : it.holdedNumber}}</div>
</div>