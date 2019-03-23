<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    商品信息：
    <div style="height: 300px;overflow: auto;">
        <table>
            <tr>
                <td>商品编号</td>
                <td>ST数量</td>
                <td>名称</td>
                <td>价值</td>
                <td>类型</td>
                <td>库存数量</td>
                <td>已兑换数量</td>
            </tr>
            {{for i,product of it.productsList}}
            <tr>
                <td>{{product.id}}</td>
                <td>{{product.stCount}}</td>
                <td>{{product.name}}</td>
                <td>{{product.value}}</td>
                <td>{{product.level}}</td>
                <td>{{product.leftCount}}</td>
                <td>{{product.convertCount}}</td>
                <button on-tap="modify(e, {{i}})" w-class="btn">修改</button>
                <button on-tap="deleteProduct(e, {{product.id}})" w-class="btn">删除</button>
            </tr>
            {{end}}
        </table>
    </div>
    <div w-class="addProducts">
        <div>
            添加商品信息：
        </div>
        <div>
            <div>商品编号:<input value="{{it.productId}}" on-input="inputProductId"/></div>
            <div>兑换所需ST数量:<input value="{{it.stNum}}" on-input="inputStNum"/></div>
            <div>名称:<input value="{{it.productName}}" on-input="inputProductName"/></div>
            <div>价值:<input value="{{it.value}}" on-input="inputValue"/></div>
            <div>描述:<input value="{{it.desc}}" on-input="inputDesc"/></div>
            <div>兑换流程:<input value="{{it.progress}}" on-input="inputProgress"/></div>
            <div>注意事项:<input value="{{it.tips}}" on-input="inputTips"/></div>
            <div>类型:<input value="{{it.level}}" on-input="inputLevel"/></div>
            <div>商品图片:<input value="{{it.pic}}" on-change="inputPic"/></div>
            <div>上传商品图片:<input type="file" on-change="uploadAvatar"/></div>
        </div>
        <button on-tap="addProduct" w-class="btn">添加商品</button>
        <button on-tap="doModify" w-class="btn">修改商品</button>
        <button on-tap="addProducts" w-class="btn">批量添加商品</button>
    </div>
    <div>
        添加兑换码：
    </div>
    <div>
        <div>兑换码:<input value="{{it.convert}}" on-input="inputConvert"/></div>
        <div>商品编号:<input value="{{it.productNum}}" on-input="inputProductNum"/></div>
        <div>到期时间:<input value="{{it.deadTime}}" on-input="inputDeadTime"/></div>
    </div>
    <button on-tap="addConvert" w-class="btn">添加兑换码</button>
</div>