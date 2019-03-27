<div class="new-page" w-class="new-page">
    <div id="awardShow" w-class="content" class="popBoxFadeIn {{it.awardOut ? 'adAwardOut' : ''}}" style="transform:translate( {{it.moveX}}px , {{it.moveY}}px ) scale({{it.imgScale}});transition:{{it.imgScale !== 1?'none':'transform 0.5s ease'}};">
        <div w-class="award-container" >
            <div w-class="award-bg" class="adAwardBgRotate"></div>
            <img src="{{it.imgUrl}}" w-class="award-img" class="popBoxShake"/>
        </div>
    </div>
</div>