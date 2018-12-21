<div w-class="box {{it.received ? 'received_bg' : ''}}">
    <img src="../../../res/image/iron_hoe.png" w-class="gift"/>
    {{if it.received}}
    <div w-class="received"><img src="../../../res/image/award_received.png"/></div>
    {{else}}
    <div w-class="continue-days">{{ it.continuedDays}}</div>
    {{end}}
</div>