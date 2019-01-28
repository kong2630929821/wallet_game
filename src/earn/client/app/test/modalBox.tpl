<div w-class="modal-mask" class="new-page">
    <div w-class="body">
        <div w-class="title">
            {{if typeof(it.title)==='string'}}
                {{it.title}}
            {{else}}
                <pi-ui-lang>{{it.title}}</pi-ui-lang>
            {{end}}
        </div>
        <div w-class="content" style="{{it.style?it.style:''}}">
            {{if typeof(it.content)==='string'}}
                {{it.content}}
            {{else}}
                <pi-ui-lang>{{it.content}}</pi-ui-lang>
            {{end}}
        </div>
        <div w-class="btns">
            <div w-class="btn-cancel" on-tap="cancelBtnClick">
                <span>取消</span>
              
            </div>

            <div w-class="btn-ok" on-tap="okBtnClick">
        
                <span>确定</span>
             
            </div>
        </div>
    </div>
</div>