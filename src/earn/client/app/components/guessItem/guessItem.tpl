<div w-class="body">
    {{% 上部 比赛时间}}
    <div w-class="guess-top">
        <span>2019LPL春季赛常规赛</span>
        <span>截止：{{it.guessData.time.slice(11)}}</span>
    </div>

    {{% 中部 比赛队}}
    <div w-class="guess-center">
        {{% 队伍1}}
        <div w-class="guess-center-team">
            <img src="../../res/image/guessTeam/{{it.guessData.team1}}.png" height="100px" />
            <span style="margin-top:10px">{{it.guessData.team1}}</span>
            {{if it.showOdds}}
            <div>
                <span>赔率</span>
                <span style="color:#1E6DEF">{{it.oddsTeam1}}</span>
            </div>
            {{end}}
        </div>

        {{% VS}}
        <div w-class="guess-center-vs">
            <span style="font-size:32px;margin-bottom: 20px;">VS</span>
            {{if it.showBtn}}
                {{if it.guessBtn}}
                <div on-tap="goGuess" w-class="guess-btn">预测</div>
                {{else}}
                <div w-class="guess-btn notguess">停止预测</div>
                {{end}}
            {{end}}
        </div>


        {{% 队伍2}}
        <div w-class="guess-center-team">
            <img src="../../res/image/guessTeam/{{it.guessData.team2}}.png" height="100px" />
            <span style="margin-top:10px">{{it.guessData.team2}}</span>
            {{if it.showOdds}}
            <div>
                <span>赔率</span>
                <span style="color:#1E6DEF">{{it.oddsTeam2}}</span>
            </div>
            {{end}}
        </div>
    </div>

    {{% 下部 支持人数}}
    <div w-class="guess-bottom">
        <div w-class="suport-left" style="width:{{it.guessData.team1Num / (it.guessData.team2Num+it.guessData.team1Num) *100}}%">
            {{it.guessData.team1Num}} ST
            <div w-class="line"></div>
        </div>
        <div w-class="suport-right" style="width:{{it.guessData.team2Num / (it.guessData.team2Num+it.guessData.team1Num) *100}}%">
            {{it.guessData.team2Num}} ST
        </div>
    </div>
</div>