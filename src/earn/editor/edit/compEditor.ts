
import { popModalBoxs, popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { clientRpcFunc } from '../../client/app/net/init';
import { getMap } from '../../client/app/store/cfgMap';
import { timestampFormat } from '../../client/app/utils/tools';
import { RESULT_SUCCESS } from '../../server/data/constant';
import { AddCompetition, CompResult, MainPageCompList, Result } from '../../server/data/db/guessing.s';
import { add_competitions, cancle_guessing, get_allComps, get_main_competitions, input_competition_result, settle_guessing_award } from '../../server/rpc/guessingCompetition.p';
import { LOLTeamInfosCfg, LOLTypeCfg } from '../../xlsx/competition.s';

/**
 * 比赛编辑
 */

interface Props {
    compList: any;
    teamList: any;
    compInfoList: any;
    cid: number;
    team1: string;
    team2: string;
    matchType: number;
    time: string;
    team1Num: number;
    team2Num: number;
    result:number;
    compIndex: number;
}

export class CompEditor extends Widget {
    public ok : () => void;
    public props: Props = {
        compList: [],
        teamList: getTeamCfg1(),
        compInfoList: getCompCfg(),
        cid: 0,
        team1: getTeamCfg1()[0].teamName,
        team2: getTeamCfg1()[0].teamName,
        matchType: getCompCfg()[0].pid,
        time: '',
        team1Num: 0,
        team2Num: 0,
        result: 0,
        compIndex: 0
    };

    public create() {
        super.create();
        this.initData();
    }

    public initData() {
        getCompetitions().then((res: any) => {
            this.props.compList = res;
            this.paint();
            console.log('initData in !!!!!!!!!!!!!!!!!!!', this.props.compList);
        });
        this.paint();
    }

    public inputTeam1(event:any) {        
        this.props.team1 = event.currentTarget.value;
    }

    public inputTeam2(event: any) {
        this.props.team2 = event.currentTarget.value;
        console.log('inputTeam2!!!!!!', event.currentTarget.value);
    }

    public inputMatchType(event: any) {
        this.props.matchType = event.currentTarget.value;
        console.log('inputMatchType!!!!!!', event.currentTarget.value);
        
    }

    public inputTime(event: any) {
        this.props.time = event.currentTarget.value;
    }

    public inputTeam1Num(event: any) {
        this.props.team1Num = event.currentTarget.value;
    }

    public inputTeam2Num(event: any) {
        this.props.team2Num = event.currentTarget.value;
    }

    public addComp() {
        addCompetition(this.props.team1, this.props.team2, this.props.matchType, this.props.time, this.props.team1Num, this.props.team2Num);
        this.initData();
        this.paint();
    }

    public addResult(e: any, result: number, cid: number) {
        popModalBoxs('earn-editor-edit-modalBox',{
            title: '注意',
            content: '确认比赛结果'
        },() => {
            addResult(result, cid);
            this.initData();
            this.paint();
        });
    }

    public settleGuessing(e: any, cid: number) {
        popModalBoxs('earn-editor-edit-modalBox',{
            title: '注意',
            content: '是否结算比赛'
        },() => {
            settleGuessing(cid);
            this.initData();
            this.paint();
        });
    }

    public cancelGuessing(e: any, cid: number) {
        popModalBoxs('earn-editor-edit-modalBox',{
            title: '注意',
            content: '是否取消比赛'
        },() => {
            cancelGuessing(cid);
            this.initData();
            this.paint();
        });
    }

    public compIndex(event:any) {
        this.props.compIndex = event.srcElement.selectedIndex;
        this.paint();
    }

}

// 获取比赛信息
const getCompetitions = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_allComps, null, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                const compList: MainPageCompList = JSON.parse(r.msg);
                const resData = [];
                compList.list.forEach(element => {
                    const data = {
                        cid: element.comp.cid,
                        team1: getTeamCfg(LOLTeamInfosCfg._$info.name, element.comp.team1).teamName,
                        team2: getTeamCfg(LOLTeamInfosCfg._$info.name, element.comp.team2).teamName,
                        time: timestampFormat(element.comp.time),
                        result: element.comp.result,
                        state: element.comp.state,
                        team1Num: element.team1num,
                        team2Num: element.team2num
                    };
                    resData.push(data);
                });
                console.log('比赛信息!!!!!!!!：', resData);
                resolve(resData);
            } else {
                reject(r);
            }
        });
    });
};

// 新增比赛
const addCompetition = (team1Name:string, team2Name:string, matchType:number, time:string, team1Num:number, team2Num:number) => {
    return new Promise((resolve, reject) => {
        const cfgName = LOLTeamInfosCfg._$info.name;
        if (!time) {
            alert('请输入比赛时间');
            
            return;
        }
        console.log('比赛类型!!!!!!!!：', matchType);
        const team1 = getTeamCfg(cfgName, null, team1Name).pid;
        const team2 = getTeamCfg(cfgName, null, team2Name).pid;
        console.log('队伍编号!!!!!!!!：', team1);
        if (!team1 || !team2) alert('队伍名不存在');
        const addComp = new AddCompetition(team1, team2, time, matchType, team1Num, team2Num);
        console.log('addComp!!!!!!!!!!!!!!', addComp);
        clientRpcFunc(add_competitions, addComp, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                alert('添加比赛成功');
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
};

// 添加比赛结果
const addResult = (winTeam: number, cid: number) => {
    return new Promise((resolve, reject) => {
        const compResult = new CompResult(cid, winTeam);
        clientRpcFunc(input_competition_result, compResult, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                alert('比赛结果录入成功');
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
};

// 结算比赛
const settleGuessing = (cid: number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(settle_guessing_award, cid, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                alert('比赛结算成功');
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
};

// 取消比赛 退回下注额
const cancelGuessing = (cid: number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(cancle_guessing, cid, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                alert('比赛取消成功');
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
};

export const getTeamCfg = (cfgName: string, teamNum?: number, teamName?: string) => {
    const cfgs = getMap(cfgName);
    for (const [k, cfg] of cfgs) {
        if (cfg.pid === teamNum) {
            return cfg;
        }
        if (cfg.teamName === teamName) {
            return cfg;
        }
    }

    return;
};

/**
 * 获取队伍信息
 * @param teamNum 可选,队伍编号，不填返回所有
 */
export const getTeamCfg1 = (teamNum?:number) => {
    const cfgs = getMap(LOLTeamInfosCfg);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if (teamNum && teamNum === cfg.pid) {
            return cfg;
        } else {
            filterCfgs.push(cfg);
        }
    }

    return filterCfgs;
};

/**
 * 获取赛事信息
 * @param teamNum 可选,队伍编号，不填返回所有
 */
export const getCompCfg = (compType?:number) => {
    const cfgs = getMap(LOLTypeCfg);
    const filterCfgs = [];
    for (const [k, cfg] of cfgs) {
        if (compType && compType === cfg.pid) {
            return cfg;
        } else {
            filterCfgs.push(cfg);
        }
    }

    return filterCfgs;
};