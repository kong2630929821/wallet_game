<div w-class="detail-new-page" class="new-page">
    <div w-class="detail-top">
        <div w-class="detail-head">
            <div w-class="detail-head-inner" style="background-image:url({{it.userInfo[0]?it.userInfo[0].avatar:''}})"></div>
        </div>
        <div w-class="detail-amount">
            <span>{{it.message}}</span>
            <span w-class="detail-currency-name" id="currencyName"></span>
        </div>
        <div w-class="detail-leave-message" id="message"></div>
        <div w-class="detail-input-father">
            {{if it.code}}
            <div w-class="input-father" id="code">{{it.code}}</div>
            <div w-class="detail-copy-btn" on-tap="copyBtnClick" >复制</div>
            {{else}}
            已领完
            {{end}}
        </div>
        <div w-class="detail-receive" on-tap="receiveClick">立即领取</div>
    </div>

    <div w-class="detail-bottom">
        <div w-class="detail-title">已领取{{it.count-it.leftCount}}/{{it.count}}，共{{it.sum}}{{it.moneyType}}</div>
        {{if it.userInfo.length>1}}
            {{for i,v of it.userInfo}}
                {{if i!=0}}
                    <div w-class="detail-item">
                        <img src="{{v.avatar}}" alt="" w-class="avatar"/>
                        <div w-class="info">
                            <div w-class="userInfo">
                                <div w-class="name">{{v.nickName}}</div>
                                <div w-class="time">{{v.time}}</div>
                            </div>
                            <div w-class="userInfo">
                                <div w-class="name">{{v.sum}}{{it.moneyType}}</div>
                                {{if v.fg}}
                                    <div w-class="mark">手气最好</div>
                                {{end}}
                            </div>
                        </div>
                    </div>
                {{end}}
            {{end}}
        {{end}}
    </div>
</div>