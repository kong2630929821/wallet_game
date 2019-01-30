/**
 * 竞猜组件
 */

import { getModulConfig } from '../../../../../app/modulConfig';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

export interface Props {
    guessBtn: boolean; // 竞猜按钮形态
    guessData: {       // 竞猜数据
        team1: string;
        team2: string;
        support1: number;
        support2: number;
    };
    showOdds: boolean; // 竞猜赔率显示
    showBtn:boolean;  // 竞猜按钮显示
}
export class GuessItem extends Widget {
    public ok: () => void;
    public props: any = {
        stShow:getModulConfig('ST_SHOW'),
        guessBtn: true,
        guessData: {
            team1: 'ok',
            team2: 'ok',
            time: '2000-10-02 15:26:30',
            week: '星期五',
            result: 1,
            state: 2,
            team1Num: 1,
            team2Num: 1
        },
        showOdds: false,
        showBtn:false,
        timer:{},
        oddsTeam1:0,
        oddsTeam2:0
    };

    public setProps(props: Props) {

        super.setProps(this.props);
        if (props.guessData) {
            this.props.guessData = props.guessData;
        }
        if (props.showOdds) {
            this.props.showOdds = props.showOdds;
        }
        if (props.showBtn) {
            this.props.showBtn = props.showBtn;
        }
        this.props.guessBtn = true;// 初始化
        this.timer();
        this.oddsCompute();
        this.paint();
    }

    /**
     * 计算比赛时间
     */
    public timer() {
        const compareTime = () => {
            const nowDate = new Date();
            const guessDate = new Date(this.props.guessData.time);
            if (nowDate > guessDate || this.props.guessData.result === 3) {
                this.props.guessBtn = false;
                clearInterval(this.props.timer);
                this.paint();
            }
        };
        
        compareTime();
        this.props.timer = setInterval(() => {
            compareTime();
        },1000);

    } 
    /**
     * 赔率计算
     */
    public oddsCompute() {
        if (this.props.guessData.team2Num === 0) {
            this.props.oddsTeam1 = 1;
        } else {
            this.props.oddsTeam1 = (this.props.guessData.team2Num / this.props.guessData.team1Num + 1).toFixed(1);
        }
        if (this.props.guessData.team1Num === 0) {
            this.props.oddsTeam2 = 1;
        } else {
            this.props.oddsTeam2 = (this.props.guessData.team1Num / this.props.guessData.team2Num + 1).toFixed(1);
        }   
        this.paint();
    }
    public destroy() {
        clearInterval(this.props.timer);

        return true;
    }

    /**
     * 点击效果
     */
    public btnClick($dom: any,btnType:number) {
        $dom.className = 'btnClick';
        setTimeout(() => {
            $dom.className = '';
        }, 100);
        switch (btnType) {
            case 0:
                this.goGuess();
                break;
            
            default:
        }
    }

    /**
     * 竞猜详情
     */
    public goGuess() {
        if (this.props.showBtn) {
            if (this.props.guessBtn) {
                popNew('earn-client-app-view-guess-allGuess-guessDetail',{ guessData:this.props.guessData });
            } else {
                popNew('app-components1-message-message', { content: this.config.value.tips[0] });
            }
        }
    }

}