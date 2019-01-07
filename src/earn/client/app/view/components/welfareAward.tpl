<div w-class="box" on-tap="openClick">
    <div w-class="award-box" style="{{ it.canReceive ? 'background-image:url(../../../res/image/can_receive_bg.png);' : ''}}" class="{{ it.received ? 'grayscale' : ''}}">
        <img src="{{ it.imgUrl }}" w-class="award-img"/>
    </div>
    <div w-class="receiving-condition">{{ it.inviteNumber }}人</div>
</div>