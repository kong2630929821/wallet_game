<div>
    <div w-class="body">
        {{for i,item in it.list}}
        <div w-class="item" on-tap="goProductDetail({{i}})">
            <div style="height: 250px;text-align: center;">
                <img src="../../res/image/virtualGoods/{{item.id}}.jpg" height="100%" alt="" />
            </div>
            
            <div w-class="item-desc">{{item.name}}</div>
            <div w-class="item-money">
                <div w-class="money-one">
                    <span w-class="money-num">{{item.count / 100}}</span>
                    <span w-class="money-num" style="color:#888888;font-size:24px;">ST</span>
                </div>
            </div>
        </div>
        {{end}}

    </div>
</div>