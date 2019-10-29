<div class="new-page" w-class="new-page" ev-refresh-click="refreshPage">
    <div w-class="topBack">
        <app-components1-topBar-topBar1>{avatar:{{it.userInfo.avatar}},title:"任务" }</app-components1-topBar-topBar1>
        <app-publicComponents-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-publicComponents-offlineTip-offlineTip>

    </div>
    <div w-class="body">
        <div w-class="walefareBox" on-tap="test">
            <img src="../../res/image/welfare_bg.png" alt="" w-class="walefare"/>
            <div w-class="walefareMark">我已成功邀请 0 人</div>
        </div>
        <div w-class="todayLogin">今日登录</div>
        <div w-class="signIn-container">
            {{for i,v of it1.awards}}
            {{: flag = it1.signInDays >= v.days }}
            <div w-class="signIn-item">
                <div w-class="signIn-imgDiv" style="background:{{flag?'#CCCCCC':'#FCDC3C'}}">
                    <img src="../../res/image/{{v.prop}}.png" w-class="signIn-img"/>
                </div>
                <div style="color:{{flag?'#CCCCCC':'#F39439'}}">{{flag?"已签":v.days+"天"}}</div>
            </div>
            {{end}}
        </div>
        <div w-class="todayLogin">热门活动</div>
        <div w-class="activeList">
            {{for i,v of it.hotActivities}}
            <div w-class="activeItem" on-tap="goHotActivity({{i}})" on-down="onShow">
                <img src="{{v.img}}" alt="" w-class="activeImg"/>
                <div w-class="descBox">
                    <div w-class="activeTitle">{{v.title}}</div>
                    <div w-class="desc">{{v.desc}}</div>
                </div>
            </div>
            {{end}}
        </div>
        <div w-class="todayLogin">做任务</div>
        <div w-class="welfare-container">
            {{for i,item of it.noviceTask}}
                {{if !item.complete && item.show}}
                <div w-class="welfare-noviceTask-item"  on-tap="goNoviceTask(e,{{i}})" on-down="onShow">
                    <div>
                        <div w-class="noviceTask-title">
                            {{item.title}}
                            {{if item.img}}
                            <img src="../../res/image/{{item.img}}" style="width:50px;margin:0 10px;vertical-align: bottom"/>
                            {{end}}
                            {{if item.addOne}}
                            <span w-class="add-one">+1</span>
                            {{end}}
                        </div>
                        <div w-class="welfare-desc">{{item.desc}}</div>
                    </div>
                    <div w-class="welfare-btn">{{item.btn}}</div>
                </div>
                {{end}}
            {{end}}
        </div>
    </div>
</div>