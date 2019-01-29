<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    比赛信息：
    <div>
        <div w-class="competitions"> 
            <select on-change="compIndex" name="compInfo">
                {{for i,comp of it.compList}}
                <option value="">{{comp.team1}} &nbsp; VS &nbsp; {{comp.team2}} &nbsp; {{comp.time}} &nbsp; 奖金池{{comp.team1Num}} &nbsp; {{comp.team2Num}} 比赛结果{{comp.result}}&nbsp; 结算状态{{comp.state}}</option>
                {{end}}
            </select>
            <div>
                {{if it.compList[it.compIndex]}}
                <button on-tap= "addResult(e, {{1}}, {{it.compList[it.compIndex].cid}})">{{it.compList[it.compIndex].team1}}胜</button>
                <button on-tap= "addResult(e, {{2}}, {{it.compList[it.compIndex].cid}})">{{it.compList[it.compIndex].team2}}胜</button>
                <button on-tap= "settleGuessing(e, {{it.compList[it.compIndex].cid}})">比赛结算</button>
                <button on-tap= "cancelGuessing(e, {{it.compList[it.compIndex].cid}})">取消比赛</button>
                {{end}}
            </div>
        </div>
    </div>
    <div w-class="addCompInfo">
        <div>
            队伍1：
            <select on-change="inputTeam1">
                {{for i,team of it.teamList}}
                <option value="">{{team.teamName}}</option>
                {{end}}
            </select>
        </div>  
        <div>
            队伍2：
            <select on-change="inputTeam2">
                {{for i,team of it.teamList}}
                <option value="">{{team.teamName}}</option>
                {{end}}
            </select>
        </div>
        <div>
            比赛类型：
            <select on-change="inputMatchType">
                {{for i,compInfo of it.compInfoList}}
                <option value="{{compInfo.pid}}">{{compInfo.name}}</option>
                {{end}}
            </select>
        </div> 
        <div>比赛时间：<input value= "{{it.time}}" type="datetime-local" on-input="inputTime"/></div>
        <div>队伍1初始奖池：<input value= "{{it.team1Num}}" on-input="inputTeam1Num"/></div>
        <div>队伍2初始奖池：<input value= "{{it.team2Num}}" on-input="inputTeam2Num"/></div>
    </div>
    <button on-tap="addComp" w-class="btn">添加比赛</button>
    <input type="file" on-change="uploadAvatar"/>
</div>