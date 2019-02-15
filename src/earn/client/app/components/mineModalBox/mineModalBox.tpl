<div class="new-page" w-class="new-page">
    <div w-class="modal-box">
        <img src="../../res/image/modal_box_close.png" w-class="close" on-tap="closeClick"/>
        <div w-class="modal-box-content">
            {{if it.miningMax}}
                <img src="../../res/image/mine_text.png"/>
            {{else}}
                <div w-class="item">
                    <img src="{{it.routineAwardImgUrl}}" style="width:150px;height:150px;"/>
                    <div w-class="item-text">+{{it.routineAward.number}}</div>
                </div>
                {{if it.extraAward}}
                <div w-class="item">
                    <img src="{{it.extraAwardImgUrl}}" style="width:150px;height:150px;"/>
                    <div w-class="item-text">+{{it.extraAward.number}}</div>
                </div>
                {{end}}
            {{end}}
        </div>
        
    </div>
</div>