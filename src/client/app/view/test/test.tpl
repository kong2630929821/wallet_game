<div style="background-color: rgb(170, 221, 221);height: -webkit-fill-available;position: fixed;width: -webkit-fill-available;">
    {{for index,button of it.bts}}
        <span w-class="test-btn" on-tap="onTap({{index}})">{{button.name}}</span>
    {{end}}
</div>