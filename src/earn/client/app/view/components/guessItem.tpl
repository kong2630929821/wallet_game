<div w-class="body">
    {{% 上部 比赛时间}}
    <div w-class="guess-top">
        <span>2019LPL春季赛常规赛</span>
        <span>截止：00:00:00</span>
    </div>

    {{% 中部 比赛队}}
    <div w-class="guess-center">
        {{% 队伍1}}
        <div w-class="guess-center-team">
            <img src="../../res/image/100701bg.png" height="100px" />
            <span style="margin-top:10px">ko</span>
            {{if it.showOdds}}
            <div>
                <span>赔率</span>
                <span style="color:#1E6DEF">2.3</span>
            </div>
            {{end}}
        </div>

        {{% VS}}
        <div w-class="guess-center-vs">
            <span style="font-size:32px;margin-bottom: 20px;">VS</span>
            {{if it.guessBtn}}
            <div on-tap="goGuess" w-class="guess-btn">预测</div>
            {{end}}
        </div>


        {{% 队伍2}}
        <div w-class="guess-center-team">
            <img src="../../res/image/100701bg.png" height="100px" />
            <span style="margin-top:10px">ko</span>
            {{if it.showOdds}}
            <div>
                <span>赔率</span>
                <span style="color:#1E6DEF">2.3</span>
            </div>
            {{end}}
        </div>
    </div>

    {{% 下部 支持人数}}
    <div w-class="guess-bottom">
        <div w-class="suport-left">
            66225次
            <div w-class="line"></div>
        </div>
        <div w-class="suport-right">66225次</div>
    </div>
</div>