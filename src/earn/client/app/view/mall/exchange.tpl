<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    <div style="background: #1E6DEF">
        {{: topBarTitle = {"zh_Hans":"兑换商城","zh_Hant":"兌換商城","en":""} }}
        <widget w-tag="app-components-topBar-topBar2">{scrollHeight:0,text:{{topBarTitle}},nextImg:"../../res/image/26_white.png"}</widget>
    </div>

    <div w-class="content">
        <div w-class="body"> 
            {{% 内容}}
                {{for i,item of it1.list}}
                <widget w-tag="earn-client-app-view-mall-virtualItem">{{item}}</widget>
                {{end}}
        </div>
    </div>

</div>