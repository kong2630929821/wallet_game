<div class="new-page" w-class="new-page" on-tap="closeSetting" ev-back-click="backPrePage" ev-next-click="goHistory" ev-next1-click="showSetting">
    {{: topBarTitle = {"zh_Hans":"开宝箱","zh_Hant":"開寶箱","en":""} }}
    <app-components-topBar-topBar>{title:{{topBarTitle}},nextImg:"../../res/image/26_white.png",nextImg1:"../../res/image/more_dot_white.png",background:"transparent" }</app-components-topBar-topBar>
    
    <div w-class="content">
        {{if it.showMoreSetting}}
        <div w-class="moreSetting" on-tap="setting">
            {{if it.noPassword}}
                关闭免密支付
            {{else}}
                开启免密支付
            {{end}}
        </div>
        {{end}}
        
        <div w-class="center">
            {{% 宝箱九宫格}}
            <div w-class="box-content">
                {{if it.ledShow}}
                <img src="../../res/image/openBox_LED1.png" alt="" />
                {{end}}
                <div w-class="box-list">
                    {{for i,item in it.boxList}}
                    <div w-class="box">
                        {{if item === 0}}
                        <img class="chest-img" w-class="chest-img" on-tap="openBox(e,{{i}})" src="../../res/image/{{it.selectChest.type}}box.png" height="100%;"
                            style="margin:0px auto;" />
                        {{elseif item === 1}}
                        <img class="chest-img" src="../../res/image/{{it.selectChest.type}}boxOpen.png" height="100%;"
                            style="margin:0px auto;" />
                        {{elseif item === 2}}
                        <img class="chest-img" src="../../res/image/{{it.selectChest.type}}boxEmpty.png" height="100%;"
                            style="margin:0px auto;" />
                        {{end}}
                    </div>
                    {{end}}
                </div>
            </div>
            {{% 售价}}
            <div w-class="sale">
                <div w-class="sale-btn" on-tap="btnClick(e,0)">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"换一波","zh_Hant":"換一波","en":""}</widget>
                </div>
                
                <div w-class="sale-money">
                    <widget w-tag="pi-ui-lang">{{it.showTip}}</widget>
                </div>
                {{if it.selectChest.type==101001}}
                    <div w-class="sale-btn1" on-tap="btnClick(e,1)">
                        <widget w-tag="pi-ui-lang">{"zh_Hans":"更多机会 {{it.watchAdAward}}/10","zh_Hant":"更多機會 {{it.watchAdAward}}/10","en":""}</widget>
                    </div>
                {{end}}
            </div>
            <div w-class="myMoney">我的嗨豆:&nbsp;{{it.STbalance}}</div>

            {{% 余票}}
            <div w-class="ticket">
                {{for i,item in it.chestList}}
                <div on-tap="btnClick(e,2,{{i}})" w-class="ticket-item {{it.selectChest.type===item.type ?'select':''}}">
                    <img src="../../res/image/{{item.type}}box.png" width="100%;" style="margin-top:-10px;margin-right: -10px" />
                </div>
                {{end}}
            </div>

        </div>
    </div>

</div>