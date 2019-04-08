<div class="new-page" style="background:#fff" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{ title:"我的邀请",background:"#fff" }</app-components-topBar-topBar>
    <div w-class="amount">{{it1.num}}</div>
    <div w-class="inviteNum">已成功邀请人数</div>
    <div w-class="successInvite" on-tap="tap">
        {{for i,v of it1.successList}}
            <div w-class="successBox">
                <img w-class="{{v.obtain?'checkRewardImg':'rewardImg'}}" src="{{v.src}}" alt=""/>
                <p w-class="{{v.obtain?'checkRewardPeople':'rewardPeople'}}">{{v.index}}人</p>
            </div>
        {{end}}
    </div>
    <div w-class="describe">邀请好友下载app，在兑换中输入邀请码，并绑定手机，即视为成功邀请。快去邀请小伙伴一起挖矿吧~</div>
    <div w-class="userList">
        {{for i,v of it1.invites}}
        <widget w-tag="earn-client-app-view-components-inviteUser">{accId:{{v}} }</widget>
        {{end}}
    </div>
</div>