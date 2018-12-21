<div>
    <div w-class="body">

        {{for i,item in it.list}}
        <div w-class="item" on-tap="goProductDetail({{i}})">
            <img src="../../res/image/balloon.png" width="340px" height="250px;" alt="" />
            <div w-class="item-desc">qweqw啊大苏打大苏打实打实大苏打eqwe</div>
            <div w-class="item-money">
                <div w-class="money-one">
                    <img src="../../res/image/goldTicket.png" width="50px" height="40px;" alt="" />
                    <span w-class="money-num">3</span>
                </div>
                <div w-class="money-one">
                    <img src="../../res/image/goldTicket.png" width="50px" height="40px;" alt="" />
                    <span w-class="money-num">3</span>
                </div>
                <div w-class="money-one">
                    <img src="../../res/image/goldTicket.png" width="50px" height="40px;" alt="" />
                    <span w-class="money-num">3</span>
                </div>
            </div>
        </div>
        {{end}}

    </div>
</div>