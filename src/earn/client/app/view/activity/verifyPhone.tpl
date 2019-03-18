<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshPage">
    {{: topBarTitle = {"zh_Hans":"验证手机号","zh_Hant":"驗證手機號","en":""} }}	
    <div style="background:rgb(44, 110, 234);"><app-components-topBar-topBar2>{text:{{topBarTitle}} }</app-components-topBar-topBar2></div>
    <div w-class="content" on-scroll="getMoreList">
        <div w-class="main">
            {{: rule = [
                {"zh_Hans":"1、验证手机号是真实用户的唯一标准。","zh_Hant":"1、驗證手機號是真實用戶的唯一標準。","en":""},
                {"zh_Hans":"2、一个钱包只能验证一个手机号。","zh_Hant":"2，一個錢包只能驗證一個手機號。","en":""},
                {"zh_Hans":"3、可以用未验证的手机号挤掉已验证的","zh_Hant":"3，可以用未驗證的手機號擠掉已驗證的","en":""},
                {"zh_Hans":"4、修改验证可以在账户-手机号中进行修改","zh_Hant":"4，修改驗證可以在賬戶 - 手機號中進行修改","en":""}] }}

            {{: rule_title ={"zh_Hans":"活动规则","zh_Hant":"活動規則","en":""} }} 
            {{: ruleBtn = {"zh_Hans":"去验证手机号","zh_Hant":"去驗證手機號","en":""} }}	 
            
            {{% 标题}}
            <div w-class="phone_part">
                <widget w-class="rule_title" w-tag="pi-ui-lang">{{rule_title}}</widget>
                <div w-class="rule_list">
                    {{for ind,val in rule }}
                    <widget w-class="rule_item" w-tag="pi-ui-lang">{{val}}</widget>
                    {{end}}
                </div>
                
                <widget w-class="rule_btn" w-tag="pi-ui-lang" on-tap="goVerifyPhone">{{ruleBtn}}</widget>
            </div>
        </div>
    </div>
</div>